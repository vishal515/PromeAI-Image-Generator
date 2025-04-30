
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Share, 
  Crop, 
  ArrowRight, 
  ImageDown,
  RotateCw,
  ZoomIn
} from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  prompt: string;
  onEdit: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  imageUrl, 
  isLoading, 
  prompt,
  onEdit
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleDownload = () => {
    if (!imageUrl) return;
    
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `promeai-${new Date().getTime()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (!imageUrl || !navigator.share) return;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `promeai-image.png`, { type: blob.type });
      
      await navigator.share({
        title: 'PromeAI Generated Image',
        text: prompt,
        files: [file]
      });
    } catch (error) {
      console.error("Error sharing image:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full aspect-square bg-secondary/50 rounded-lg flex flex-col items-center justify-center p-8">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground animate-pulse">Generating your masterpiece...</p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full aspect-square bg-secondary/30 rounded-lg flex flex-col items-center justify-center p-8 border-2 border-dashed border-secondary">
        <div className="bg-secondary/50 p-4 rounded-full mb-4">
          <ImageDown className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-center">Your generated image will appear here</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden bg-black/5 relative">
      {!isImageLoaded && <LoadingSpinner className="absolute inset-0 flex items-center justify-center" />}
      <img
        src={imageUrl}
        alt={prompt}
        className={`w-full h-full object-contain ${!isImageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsImageLoaded(true)}
      />
      
      <div className="p-3 bg-background/80 backdrop-blur-sm absolute bottom-0 left-0 right-0 flex justify-between items-center">
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" /> Save
          </Button>
          {navigator.share && (
            <Button size="sm" variant="secondary" onClick={handleShare}>
              <Share className="w-4 h-4 mr-1" /> Share
            </Button>
          )}
        </div>
        <Button size="sm" onClick={onEdit} className="bg-promeai-500 hover:bg-promeai-600 text-white">
          <Crop className="w-4 h-4 mr-1" /> Edit Image <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default ImageDisplay;
