
import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-10">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-promeai-700 to-promeai-500 w-10 h-10 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-promeai-700 to-promeai-500">
            PromeAI
          </h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
