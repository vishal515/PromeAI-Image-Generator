
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useEffect, useState } from "react";
import GoogleAnalytics from "./components/GoogleAnalytics";
import Index from "./pages/Index";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [initialPath, setInitialPath] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a redirect path stored
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      setInitialPath(redirectPath);
      sessionStorage.removeItem('redirectPath');
    }
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <TooltipProvider>
            <GoogleAnalytics />
            <Toaster />
            <Sonner />
            {initialPath && <Navigate to={initialPath} replace />}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/about" element={<About />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </HashRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
