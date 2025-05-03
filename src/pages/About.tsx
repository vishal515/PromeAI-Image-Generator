
import React from "react";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto prose">
          <h1 className="text-3xl font-bold mb-6">About PromeAI</h1>
          
          <section className="mb-6">
            <h2 className="text-2xl font-medium mb-3">Our Mission</h2>
            <p>
              PromeAI aims to democratize creative expression by making powerful AI image generation tools accessible to everyone, regardless of their artistic background or technical expertise.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-medium mb-3">How It Works</h2>
            <p>
              Our platform leverages state-of-the-art AI models to transform textual descriptions into unique, high-quality images. Simply describe what you want to see, and our AI will generate an image that matches your vision.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-medium mb-3">Technology</h2>
            <p>
              PromeAI uses advanced machine learning models, including Stable Diffusion XL, to create images based on text prompts. These models have been trained on diverse datasets to ensure high-quality, versatile image generation.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-medium mb-3">Our Team</h2>
            <p>
              We are a team of AI enthusiasts, developers, and designers passionate about making cutting-edge technology accessible to everyone. Our team works continuously to improve PromeAI's capabilities and user experience.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-medium mb-3">Contact Us</h2>
            <p>
              Have questions, feedback, or suggestions? We'd love to hear from you! Reach out to us at support@promeai.com.
            </p>
          </section>
        </div>
      </main>
      
      {/* Footer with links */}
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

export default About;
