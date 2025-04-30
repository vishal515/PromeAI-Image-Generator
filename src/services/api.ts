
import { toast } from "sonner";

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/DeepFloyd/IF-I-XL-v1.0";
const HUGGINGFACE_ACCESS_TOKEN = "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";

interface GenerateImageParams {
  prompt: string;
  negative_prompt?: string;
  num_inference_steps?: number;
  guidance_scale?: number;
}

export async function generateImage(params: GenerateImageParams): Promise<string> {
  try {
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
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
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      let width = img.width;
      let height = img.height;
      
      switch (params.operation) {
        case 'crop':
          width = params.options.width || width;
          height = params.options.height || height;
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(
            img,
            params.options.x || 0,
            params.options.y || 0,
            width,
            height,
            0,
            0,
            width,
            height
          );
          break;
          
        case 'resize':
          width = params.options.width || width;
          height = params.options.height || height;
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          break;
          
        case 'rotate':
          const degrees = params.options.degrees || 0;
          const radians = degrees * Math.PI / 180;
          
          // Calculate new dimensions after rotation
          const newWidth = Math.abs(height * Math.sin(radians)) + Math.abs(width * Math.cos(radians));
          const newHeight = Math.abs(width * Math.sin(radians)) + Math.abs(height * Math.cos(radians));
          
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          // Move to center of canvas
          ctx.translate(newWidth / 2, newHeight / 2);
          
          // Rotate around center point
          ctx.rotate(radians);
          
          // Draw image centered
          ctx.drawImage(img, -width / 2, -height / 2, width, height);
          break;
          
        case 'flip':
          canvas.width = width;
          canvas.height = height;
          
          if (params.options.direction === 'horizontal') {
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
          } else {
            ctx.translate(0, height);
            ctx.scale(1, -1);
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          break;
          
        default:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
      }
      
      // Convert canvas to image URL
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for editing'));
    };
    
    img.src = params.imageUrl;
  });
}
