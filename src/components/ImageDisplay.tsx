
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Download,
  ImageDown
} from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  prompt: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  imageUrl, 
  isLoading, 
  prompt
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
        <Button size="sm" variant="secondary" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-1" /> Download
        </Button>
      </div>
    </div>
  );
};

export default ImageDisplay;
