
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageDown } from "lucide-react";

interface GalleryProps {
  generatedImages: Array<{
    url: string;
    prompt: string;
    timestamp: number;
  }>;
  onSelectImage: (url: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ generatedImages, onSelectImage }) => {
  if (generatedImages.length === 0) {
    return (
      <div className="w-full p-8 bg-secondary/30 rounded-lg flex flex-col items-center justify-center text-center border-2 border-dashed border-secondary">
        <div className="bg-secondary/50 p-4 rounded-full mb-4">
          <ImageDown className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Your gallery is empty</h3>
        <p className="text-muted-foreground mb-4">
          Images you generate will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="recent">
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="favorite">Favorites</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            Clear All
          </Button>
        </div>

        <TabsContent value="recent" className="mt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {generatedImages.map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer"
                onClick={() => onSelectImage(image.url)}
              >
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200" />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-white text-xs line-clamp-2">
                    {image.prompt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorite">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">
              No favorite images yet. Mark images as favorites to see them here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Gallery;
