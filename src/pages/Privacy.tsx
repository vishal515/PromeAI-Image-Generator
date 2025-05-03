
import React from "react";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto prose">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <section className="mb-6">
            <h2 className="text-2xl font-medium mb-3">1. Information We Collect</h2>
            <p>
              PromeAI collects prompts submitted by users to generate images, as well as any images generated through our service. We do not collect personal information unless voluntarily provided.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-medium mb-3">2. How We Use Information</h2>
            <p>
              Information collected is used to provide and improve our services, develop new features, and ensure compliance with our terms of service.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-medium mb-3">3. Data Sharing</h2>
            <p>
              We do not sell user data. We may share information with third-party service providers to help us operate our business and serve our users.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-medium mb-3">4. Data Security</h2>
            <p>
              We implement reasonable security measures to protect user data. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-2xl font-medium mb-3">5. Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify users of any changes by posting the new Privacy Policy on this page.
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

export default Privacy;
