
import React, { useEffect } from 'react';

interface AdSenseProps {
  className?: string;
  adClient: string;
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
}

const AdSense: React.FC<AdSenseProps> = ({ 
  className, 
  adClient, 
  adSlot, 
  adFormat = 'auto', 
  style 
}) => {
  useEffect(() => {
    // Load AdSense script if it hasn't been loaded already
    const hasAdScript = document.querySelector('script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]');
    
    if (!hasAdScript) {
      const adScript = document.createElement('script');
      adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      adScript.async = true;
      adScript.crossOrigin = 'anonymous';
      document.head.appendChild(adScript);
    }

    // Push the ad to the queue for rendering
    try {
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={style || { display: 'block', textAlign: 'center' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSense;
