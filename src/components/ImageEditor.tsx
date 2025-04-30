
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { editImage, EditImageParams } from "@/services/api";
import { Crop, RotateCw, ZoomIn, FlipHorizontal2, ArrowLeft, Save, Undo } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "sonner";

interface ImageEditorProps {
  imageUrl: string;
  onBack: () => void;
  onSave: (newImageUrl: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onBack, onSave }) => {
  const [editedImageUrl, setEditedImageUrl] = useState<string>(imageUrl);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([imageUrl]);
  const [activeTab, setActiveTab] = useState("crop");
  const [originalImageSize, setOriginalImageSize] = useState({ width: 512, height: 512 });

  // Load original image dimensions when component mounts or imageUrl changes
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setOriginalImageSize({
        width: img.width,
        height: img.height
      });
      
      // Update resize settings with actual image dimensions
      setResizeSettings({
        ...resizeSettings,
        width: img.width,
        height: img.height
      });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const [cropSettings, setCropSettings] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  const [resizeSettings, setResizeSettings] = useState({
    width: 512,
    height: 512,
    maintainAspectRatio: true,
  });

  const [rotateSettings, setRotateSettings] = useState({
    degrees: 0,
  });

  const handleEditOperation = async (operation: EditImageParams['operation']) => {
    setIsLoading(true);
    try {
      let params: EditImageParams = {
        imageUrl: editedImageUrl,
        operation: operation,
        options: {}
      };

      switch (operation) {
        case 'crop':
          // Calculate actual pixel values from percentages
          const actualWidth = Math.round((cropSettings.width / 100) * originalImageSize.width);
          const actualHeight = Math.round((cropSettings.height / 100) * originalImageSize.height);
          const actualX = Math.round((cropSettings.x / 100) * originalImageSize.width);
          const actualY = Math.round((cropSettings.y / 100) * originalImageSize.height);
          
          params.options = {
            x: actualX,
            y: actualY,
            width: actualWidth,
            height: actualHeight,
          };
          break;
          
        case 'resize':
          params.options = {
            width: resizeSettings.width,
            height: resizeSettings.height,
          };
          break;
          
        case 'rotate':
          params.options = {
            degrees: rotateSettings.degrees,
          };
          break;
          
        case 'flip':
          params.options = {
            direction: 'horizontal',
          };
          break;
      }

      console.log(`Applying ${operation} with options:`, params.options);
      const newImageUrl = await editImage(params);
      setEditedImageUrl(newImageUrl);
      setHistory([...history, newImageUrl]);
      
      // Update original size for the newly edited image
      const newImg = new Image();
      newImg.onload = () => {
        setOriginalImageSize({
          width: newImg.width,
          height: newImg.height
        });
      };
      newImg.src = newImageUrl;
      
      toast.success(`Image ${operation} applied successfully`);
    } catch (error) {
      console.error("Error editing image:", error);
      toast.error(`Failed to ${operation} image. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlipVertical = async () => {
    setIsLoading(true);
    try {
      const params: EditImageParams = {
        imageUrl: editedImageUrl,
        operation: 'flip',
        options: { direction: 'vertical' }
      };
      
      const newImageUrl = await editImage(params);
      setEditedImageUrl(newImageUrl);
      setHistory([...history, newImageUrl]);
      toast.success("Image flipped vertically");
    } catch (error) {
      console.error("Error flipping image:", error);
      toast.error("Failed to flip image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    
    const newHistory = [...history];
    newHistory.pop();
    const previousImage = newHistory[newHistory.length - 1];
    
    setEditedImageUrl(previousImage);
    setHistory(newHistory);
    
    // Update original size for the previous image
    const prevImg = new Image();
    prevImg.onload = () => {
      setOriginalImageSize({
        width: prevImg.width,
        height: prevImg.height
      });
    };
    prevImg.src = previousImage;
    
    toast.info("Change undone");
  };

  const handleSave = () => {
    onSave(editedImageUrl);
    toast.success("Image saved successfully");
  };

  // Handle aspect ratio in resize
  const updateDimension = (dimension: 'width' | 'height', value: number) => {
    if (resizeSettings.maintainAspectRatio) {
      const aspectRatio = originalImageSize.width / originalImageSize.height;
      
      if (dimension === 'width') {
        setResizeSettings({
          ...resizeSettings,
          width: value,
          height: Math.round(value / aspectRatio)
        });
      } else {
        setResizeSettings({
          ...resizeSettings,
          height: value,
          width: Math.round(value * aspectRatio)
        });
      }
    } else {
      setResizeSettings({
        ...resizeSettings,
        [dimension]: value
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Generator
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={history.length <= 1 || isLoading}
          >
            <Undo className="w-4 h-4 mr-1" /> Undo
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isLoading} className="bg-promeai-500 hover:bg-promeai-600 text-white">
            <Save className="w-4 h-4 mr-1" /> Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative bg-black/5 rounded-lg overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
              <LoadingSpinner size="lg" />
            </div>
          )}
          <img
            src={editedImageUrl}
            alt="Edited image"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="bg-secondary/30 rounded-lg p-4 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="crop" className="flex flex-col items-center text-xs py-2">
                <Crop className="h-4 w-4 mb-1" />
                Crop
              </TabsTrigger>
              <TabsTrigger value="resize" className="flex flex-col items-center text-xs py-2">
                <ZoomIn className="h-4 w-4 mb-1" />
                Resize
              </TabsTrigger>
              <TabsTrigger value="rotate" className="flex flex-col items-center text-xs py-2">
                <RotateCw className="h-4 w-4 mb-1" />
                Rotate
              </TabsTrigger>
              <TabsTrigger value="flip" className="flex flex-col items-center text-xs py-2">
                <FlipHorizontal2 className="h-4 w-4 mb-1" />
                Flip
              </TabsTrigger>
            </TabsList>

            <TabsContent value="crop" className="space-y-4 mt-2">
              <div className="space-y-2">
                <label className="text-sm">X Position: {cropSettings.x}%</label>
                <Slider
                  value={[cropSettings.x]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(values) => setCropSettings({ ...cropSettings, x: values[0] })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Y Position: {cropSettings.y}%</label>
                <Slider
                  value={[cropSettings.y]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(values) => setCropSettings({ ...cropSettings, y: values[0] })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Width: {cropSettings.width}%</label>
                <Slider
                  value={[cropSettings.width]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={(values) => setCropSettings({ ...cropSettings, width: values[0] })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Height: {cropSettings.height}%</label>
                <Slider
                  value={[cropSettings.height]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={(values) => setCropSettings({ ...cropSettings, height: values[0] })}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleEditOperation('crop')}
                disabled={isLoading}
              >
                Apply Crop
              </Button>
            </TabsContent>

            <TabsContent value="resize" className="space-y-4 mt-2">
              <div className="space-y-2">
                <label className="text-sm">Width (px): {resizeSettings.width}</label>
                <Slider
                  value={[resizeSettings.width]}
                  min={64}
                  max={1024}
                  step={8}
                  onValueChange={(values) => updateDimension('width', values[0])}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Height (px): {resizeSettings.height}</label>
                <Slider
                  value={[resizeSettings.height]}
                  min={64}
                  max={1024}
                  step={8}
                  onValueChange={(values) => updateDimension('height', values[0])}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="maintain-ratio"
                  checked={resizeSettings.maintainAspectRatio}
                  onChange={(e) => setResizeSettings({
                    ...resizeSettings,
                    maintainAspectRatio: e.target.checked
                  })}
                  className="rounded text-promeai-500 focus:ring-promeai-500"
                />
                <label htmlFor="maintain-ratio" className="text-sm">
                  Maintain aspect ratio
                </label>
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleEditOperation('resize')}
                disabled={isLoading}
              >
                Apply Resize
              </Button>
            </TabsContent>

            <TabsContent value="rotate" className="space-y-4 mt-2">
              <div className="space-y-2">
                <label className="text-sm">Rotation angle: {rotateSettings.degrees}°</label>
                <Slider
                  value={[rotateSettings.degrees]}
                  min={0}
                  max={360}
                  step={5}
                  onValueChange={(values) => setRotateSettings({ degrees: values[0] })}
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setRotateSettings({ degrees: 90 });
                    setTimeout(() => handleEditOperation('rotate'), 10);
                  }}
                  disabled={isLoading}
                >
                  90°
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setRotateSettings({ degrees: 180 });
                    setTimeout(() => handleEditOperation('rotate'), 10);
                  }}
                  disabled={isLoading}
                >
                  180°
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setRotateSettings({ degrees: 270 });
                    setTimeout(() => handleEditOperation('rotate'), 10);
                  }}
                  disabled={isLoading}
                >
                  270°
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setRotateSettings({ degrees: 0 });
                    setTimeout(() => handleEditOperation('rotate'), 10);
                  }}
                  disabled={isLoading}
                >
                  Reset
                </Button>
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleEditOperation('rotate')}
                disabled={isLoading}
              >
                Apply Rotation
              </Button>
            </TabsContent>

            <TabsContent value="flip" className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col"
                  onClick={() => handleEditOperation('flip')}
                  disabled={isLoading}
                >
                  <FlipHorizontal2 className="h-8 w-8 mb-2" />
                  Flip Horizontally
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col"
                  onClick={handleFlipVertical}
                  disabled={isLoading}
                >
                  <FlipHorizontal2 className="h-8 w-8 mb-2 transform rotate-90" />
                  Flip Vertically
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
