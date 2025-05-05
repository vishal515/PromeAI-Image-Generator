import React, { useState } from "react";
import Header from "@/components/Header";
import PromptInput from "@/components/PromptInput";
import ImageDisplay from "@/components/ImageDisplay";
import Gallery from "@/components/Gallery";
import AdSense from "@/components/AdSense";
import { generateImage } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>PromeAI: Free AI Image Generator</title>
        <meta name="description" content="Create stunning, unique images with AI. Simply describe what you want to see, and our AI will bring your vision to life." />
        <meta name="keywords" content="AI image generator, artificial intelligence, image creation, text to image, AI art" />
        <meta property="og:title" content="PromeAI: Free AI Image Generator" />
        <meta property="og:description" content="Create stunning, unique images with AI. Simply describe what you want to see, and our AI will bring your vision to life." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PromeAI: Free AI Image Generator" />
        <meta name="twitter:description" content="Create stunning, unique images with AI. Simply describe what you want to see, and our AI will bring your vision to life." />
        <link rel="canonical" href="https://www.promeai.com/" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <section className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-promeai-700 to-promeai-500 bg-clip-text text-transparent mb-2">
              Free AI Image Generator
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
                  />
                </div>
              </div>
              
              {/* AdSense Banner */}
              <div className="mt-8 mb-8">
                <AdSense
                  adClient="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense client ID
                  adSlot="XXXXXXXXXX" // Replace with your AdSense slot ID
                  style={{ display: 'block', minHeight: '100px', width: '100%', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}
                  className="bg-secondary/30 p-2 rounded-lg"
                />
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
              
              {/* AdSense Banner for Gallery tab as well */}
              <div className="mt-8">
                <AdSense
                  adClient="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense client ID
                  adSlot="XXXXXXXXXX" // Replace with your AdSense slot ID
                  style={{ display: 'block', minHeight: '100px', width: '100%', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}
                  className="bg-secondary/30 p-2 rounded-lg"
                />
              </div>
            </TabsContent>
          </Tabs>
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
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
