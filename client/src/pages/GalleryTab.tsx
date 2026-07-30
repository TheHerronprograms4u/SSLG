import React, { useState } from 'react';
import type { GalleryItem } from '../types';
import { Maximize2, Calendar, Image as ImageIcon } from 'lucide-react';

interface GalleryTabProps {
  galleryItems: GalleryItem[];
  onOpenLightbox: (url: string) => void;
}

export const GalleryTab: React.FC<GalleryTabProps> = ({ galleryItems, onOpenLightbox }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Events', 'Research', 'Campus', 'Innovation Showcase'];

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="gallery-tab-container fade-in">
      <div className="gallery-header">
        <span className="gallery-badge">
          <ImageIcon size={14} /> INSTITUTIONAL MEDIA & PHOTOGRAPHY
        </span>
        <h2>Research & Event Photo Gallery</h2>
        <p>Explore field research captures, lab workshops, student government forums, and campus milestones.</p>
      </div>

      <div className="gallery-filter-chips">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`gallery-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="gallery-masonry-container">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="gallery-card-item fade-in"
            onClick={() => onOpenLightbox(item.url)}
          >
            <img src={item.url} alt={item.title} loading="lazy" />
            <div className="gallery-item-hover">
              <span className="gallery-cat-pill">{item.category}</span>
              <h4>{item.title}</h4>
              <p>{item.caption}</p>
              <div className="gallery-item-footer">
                <span><Calendar size={13} /> {item.date}</span>
                <span className="zoom-icon"><Maximize2 size={16} /> Click to Enlarge</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #fce4ec', marginTop: '1.5rem' }}>
          <ImageIcon size={36} color="var(--accent-primary)" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>No media items currently available</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Photos and media will be published by the SSLG media committee.</p>
        </div>
      )}
    </div>
  );
};
