
import React, { useState } from "react";
import Header from "@/components/Header";
import PromptInput from "@/components/PromptInput";
import ImageDisplay from "@/components/ImageDisplay";
import ImageEditor from "@/components/ImageEditor";
import Gallery from "@/components/Gallery";
import { generateImage } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Index = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("create");
  const [generatedImages, setGeneratedImages] = useState<
    Array<{ url: string; prompt: string; timestamp: number }>
  >([]);

  const handleGenerateImage = async (promptData: {
    prompt: string;
    negative_prompt: string;
    num_inference_steps: number;
    guidance_scale: number;
  }) => {
    setIsGenerating(true);
    setCurrentPrompt(promptData.prompt);
    
    try {
      const generatedImageUrl = await generateImage(promptData);
      setImageUrl(generatedImageUrl);
      
      // Add to gallery
      setGeneratedImages([
        {
          url: generatedImageUrl,
          prompt: promptData.prompt,
          timestamp: Date.now(),
        },
        ...generatedImages,
      ]);
      
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveEdit = (editedImageUrl: string) => {
    setImageUrl(editedImageUrl);
    setIsEditing(false);
    
    // Update the most recent image in gallery
    if (generatedImages.length > 0) {
      const updatedImages = [...generatedImages];
      updatedImages[0] = {
        ...updatedImages[0],
        url: editedImageUrl,
      };
      setGeneratedImages(updatedImages);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <section className="max-w-5xl mx-auto">
          {!isEditing ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-promeai-700 to-promeai-500 bg-clip-text text-transparent mb-2">
                  Free AI Image Generator & Editor
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Create stunning, unique images with AI. Simply describe what you want to see, 
                  and our AI will bring your vision to life.
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="create">Create Image</TabsTrigger>
                  <TabsTrigger value="gallery">My Gallery</TabsTrigger>
                </TabsList>
                
                <TabsContent value="create" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h2 className="text-xl font-medium mb-4">Describe Your Image</h2>
                      <PromptInput
                        onGenerate={handleGenerateImage}
                        isGenerating={isGenerating}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-medium mb-4">Generated Image</h2>
                      <ImageDisplay
                        imageUrl={imageUrl}
                        isLoading={isGenerating}
                        prompt={currentPrompt}
                        onEdit={() => setIsEditing(true)}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="gallery" className="mt-6">
                  <h2 className="text-xl font-medium mb-4">My Generated Images</h2>
                  <Gallery
                    generatedImages={generatedImages}
                    onSelectImage={(url) => {
                      setImageUrl(url);
                      setActiveTab("create");
                    }}
                  />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div>
              <h2 className="text-xl font-medium mb-4">Edit Your Image</h2>
              <ImageEditor
                imageUrl={imageUrl!}
                onBack={() => setIsEditing(false)}
                onSave={handleSaveEdit}
              />
            </div>
          )}
        </section>
      </main>
      
      <footer className="bg-background border-t border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-promeai-700 to-promeai-500 w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} PromeAI. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
