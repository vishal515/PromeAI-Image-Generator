
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface PromptInputProps {
  onGenerate: (promptData: {
    prompt: string;
    negative_prompt: string;
    num_inference_steps: number;
    guidance_scale: number;
  }) => void;
  isGenerating: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [numSteps, setNumSteps] = useState(50);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    onGenerate({
      prompt: prompt.trim(),
      negative_prompt: negativePrompt.trim(),
      num_inference_steps: numSteps,
      guidance_scale: guidanceScale,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-2">
        <Label htmlFor="prompt">Describe the image you want to create</Label>
        <Textarea
          id="prompt"
          placeholder="A beautiful sunset over mountains with reflections in a lake, highly detailed, vibrant colors, 8k resolution"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-24 resize-y"
          required
        />
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
        >
          {showAdvancedOptions ? "Hide" : "Show"} Advanced Options
        </Button>
        
        <Button 
          type="submit" 
          disabled={isGenerating || !prompt.trim()} 
          className={`bg-gradient-to-r from-promeai-600 to-promeai-400 hover:from-promeai-700 hover:to-promeai-500 ${isGenerating ? 'opacity-80' : ''}`}
        >
          {isGenerating ? "Generating..." : "Generate Image"}
        </Button>
      </div>
      
      {showAdvancedOptions && (
        <div className="p-4 bg-secondary/50 rounded-lg space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="negative-prompt">Negative Prompt (things to avoid)</Label>
            <Textarea
              id="negative-prompt"
              placeholder="Blurry, distorted, low quality, watermark"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="resize-y"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="steps">Inference Steps: {numSteps}</Label>
            </div>
            <Slider
              id="steps"
              min={20}
              max={100}
              step={1}
              value={[numSteps]}
              onValueChange={(values) => setNumSteps(values[0])}
            />
            <span className="text-xs text-muted-foreground">Higher values = better quality, but slower generation</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="guidance">Guidance Scale: {guidanceScale.toFixed(1)}</Label>
            </div>
            <Slider
              id="guidance"
              min={1}
              max={15}
              step={0.1}
              value={[guidanceScale]}
              onValueChange={(values) => setGuidanceScale(values[0])}
            />
            <span className="text-xs text-muted-foreground">How closely to follow the prompt (higher = more faithful but less creative)</span>
          </div>
        </div>
      )}
    </form>
  );
};

export default PromptInput;
