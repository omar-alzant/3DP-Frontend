import React, { useState } from 'react';
import '../Style/ThreeDVierwer.css';

const ThreeDViewer = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div style={{ width: '100%', height: '500px', position: 'relative' }}>
      {isLoading && (
        <div className='spinner-cont'>
          <div className="spinner" />
        </div>
      )}

      <iframe
        title="3D Model"
        src="https://app.vectary.com/p/1C5szPy0UhyP25YxPbclIM"
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        onLoad={handleIframeLoad}
        style={{ border: 'none' }}
      ></iframe>
    </div>
  );
};

export default ThreeDViewer;
