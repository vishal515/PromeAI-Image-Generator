
import React from "react";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-10">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-promeai-700 to-promeai-500 w-10 h-10 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-promeai-700 to-promeai-500">
            PromeAI
          </h1>
        </div>
        <nav className="flex gap-4 items-center">
          <Button variant="ghost" size="sm">Gallery</Button>
          <Button variant="ghost" size="sm">About</Button>
          <Button size="sm" className="bg-gradient-to-r from-promeai-600 to-promeai-400 hover:from-promeai-700 hover:to-promeai-500">
            Get Started
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
