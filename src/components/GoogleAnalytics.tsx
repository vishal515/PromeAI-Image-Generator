
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface Window {
  dataLayer?: any[];
  gtag?: (...args: any[]) => void;
}

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

const GoogleAnalytics = ({ trackingId = 'G-JZYXKE56jgJZ4S' }) => {
  const location = useLocation();

  useEffect(() => {
    // Add Google Analytics script
    const hasGtagScript = document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"]`);
    
    if (!hasGtagScript) {
      const script1 = document.createElement('script');
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      script1.async = true;
      document.head.appendChild(script1);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer?.push(arguments);
      };
      
      window.gtag('js', new Date());
      window.gtag('config', trackingId);
    }
  }, [trackingId]);

  useEffect(() => {
    // Send pageview when location changes
    if (window.gtag) {
      window.gtag('config', trackingId, { 
        page_path: location.pathname 
      });
    }
  }, [location, trackingId]);

  return null;
};

export default GoogleAnalytics;
