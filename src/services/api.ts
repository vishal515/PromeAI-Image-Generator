
import { toast } from "sonner";

// Updated to use a widely supported stable diffusion model
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
const HUGGINGFACE_ACCESS_TOKEN = "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";

interface GenerateImageParams {
  prompt: string;
  negative_prompt?: string;
  num_inference_steps?: number;
  guidance_scale?: number;
}

export async function generateImage(params: GenerateImageParams): Promise<string> {
  try {
    toast.info("Generating your image, please wait...");
    
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${HUGGINGFACE_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        inputs: params.prompt,
        parameters: {
          negative_prompt: params.negative_prompt || "",
          num_inference_steps: params.num_inference_steps || 50,
          guidance_scale: params.guidance_scale || 7.5,
        }
      }),
    });

    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      
      try {
        const errorData = await response.json();
        if (errorData.error) {
          if (errorData.error.includes("currently loading")) {
            errorMessage = "Model is loading, please try again in a moment.";
          } else if (errorData.error.includes("is not supported")) {
            errorMessage = "This model is not supported by the Hugging Face API. Please contact support.";
          } else {
            errorMessage = errorData.error;
          }
        }
      } catch (e) {
        console.error("Failed to parse error response:", e);
      }
      
      throw new Error(errorMessage);
    }

    // The response should be the image data
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
    toast.error(errorMessage);
    console.error("Image generation error:", error);
    throw error;
  }
}

export interface EditImageParams {
  imageUrl: string;
  operation: 'crop' | 'resize' | 'rotate' | 'flip';
  options: {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    degrees?: number;
    direction?: 'horizontal' | 'vertical';
  };
}

export function editImage(params: EditImageParams): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create a new image object to load the source image
    const img = new Image();
    
    // Set up error handling for image loading
    img.onerror = () => {
      reject(new Error('Failed to load image for editing'));
    };
    
    // Set up what happens when the image loads
    img.onload = () => {
      try {
        // Create canvas and get context
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Default dimensions - will be modified based on operation
        let width = img.width;
        let height = img.height;
        
        // Handle different operations
        switch (params.operation) {
          case 'crop':
            // Convert percentage values to actual pixel values if needed
            const x = params.options.x !== undefined ? params.options.x : 0;
            const y = params.options.y !== undefined ? params.options.y : 0;
            width = params.options.width !== undefined ? params.options.width : width;
            height = params.options.height !== undefined ? params.options.height : height;
            
            // Set canvas size to the crop dimensions
            canvas.width = width;
            canvas.height = height;
            
            // Draw the cropped portion of the image
            ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
            break;
            
          case 'resize':
            // Get new dimensions
            width = params.options.width !== undefined ? params.options.width : width;
            height = params.options.height !== undefined ? params.options.height : height;
            
            // Set canvas to new dimensions
            canvas.width = width;
            canvas.height = height;
            
            // Draw the image with new dimensions
            ctx.drawImage(img, 0, 0, width, height);
            break;
            
          case 'rotate':
            const degrees = params.options.degrees !== undefined ? params.options.degrees : 0;
            const radians = (degrees * Math.PI) / 180;
            
            // Calculate new dimensions after rotation to ensure the full rotated image fits
            const cos = Math.abs(Math.cos(radians));
            const sin = Math.abs(Math.sin(radians));
            const newWidth = Math.floor(width * cos + height * sin);
            const newHeight = Math.floor(height * cos + width * sin);
            
            canvas.width = newWidth;
            canvas.height = newHeight;
            
            // Move to the center of the canvas
            ctx.translate(newWidth / 2, newHeight / 2);
            
            // Rotate the canvas
            ctx.rotate(radians);
            
            // Draw the image centered at the origin
            ctx.drawImage(img, -width / 2, -height / 2, width, height);
            break;
            
          case 'flip':
            canvas.width = width;
            canvas.height = height;
            
            // Save the current context state
            ctx.save();
            
            // Apply transformation based on flip direction
            if (params.options.direction === 'horizontal') {
              ctx.translate(width, 0);
              ctx.scale(-1, 1);
            } else {
              ctx.translate(0, height);
              ctx.scale(1, -1);
            }
            
            // Draw the flipped image
            ctx.drawImage(img, 0, 0, width, height);
            
            // Restore the context state
            ctx.restore();
            break;
            
          default:
            // Just copy the image if no valid operation
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
        }
        
        // Convert the canvas to a data URL and resolve the promise
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    };
    
    // Start loading the image (this will trigger onload when done)
    // Handle both blob URLs and data URLs
    if (params.imageUrl.startsWith('blob:') || params.imageUrl.startsWith('data:')) {
      img.src = params.imageUrl;
    } else {
      // If it's a regular URL, we might need to handle CORS
      img.crossOrigin = 'anonymous';
      img.src = params.imageUrl;
    }
  });
}
