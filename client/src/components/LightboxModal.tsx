import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface LightboxModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.3, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.3, 0.7));

  return (
    <div className="lightbox-overlay fade-in" onClick={onClose}>
      <div className="lightbox-top-toolbar" onClick={(e) => e.stopPropagation()}>
        <button onClick={handleZoomIn} className="lightbox-tool-btn" title="Zoom In">
          <ZoomIn size={18} />
        </button>
        <button onClick={handleZoomOut} className="lightbox-tool-btn" title="Zoom Out">
          <ZoomOut size={18} />
        </button>
        <button onClick={onClose} className="lightbox-close-btn" title="Close Lightbox">
          <X size={22} />
        </button>
      </div>

      <div className="lightbox-content-area" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageUrl}
          alt="Enlarged media preview"
          className="lightbox-active-img"
          style={{ transform: `scale(${zoom})` }}
        />
      </div>
    </div>
  );
};
