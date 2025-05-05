
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a custom 404 handler for direct URL access
const handleDirectPageAccess = () => {
  // This ensures proper page loading on direct URL access 
  // or when refreshing a page other than home
  const path = window.location.pathname;
  if (path !== '/' && !path.includes('.') && !path.includes('api')) {
    // Store the path to redirect after app load
    sessionStorage.setItem('redirectPath', path);
  }
};

// Handle direct page access before rendering the app
handleDirectPageAccess();

createRoot(document.getElementById("root")!).render(<App />);
