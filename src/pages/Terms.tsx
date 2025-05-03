
import React from "react";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto prose">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <section className="mb-6">
            <h2 className="text-2xl font-medium mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using PromeAI's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-medium mb-3">2. Use of Service</h2>
            <p>
              PromeAI provides an AI image generation service. Users are responsible for the content they generate and must comply with all applicable laws and regulations.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-medium mb-3">3. Intellectual Property</h2>
            <p>
              Images generated using PromeAI are available for personal and commercial use. However, PromeAI retains the right to use generated images for service improvement and promotional purposes.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-medium mb-3">4. Limitations of Liability</h2>
            <p>
              PromeAI is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of our services.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-medium mb-3">5. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of PromeAI after changes constitutes acceptance of the updated terms.
            </p>
          </section>
        </div>
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

export default Terms;
