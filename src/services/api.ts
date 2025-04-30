
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
