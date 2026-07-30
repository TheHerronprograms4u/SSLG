import React from 'react';
import {
  CheckCircle2,
  Globe,
  MapPin,
  Calendar,
  Mail,
  Award
} from 'lucide-react';


interface HeroHeaderProps {
  onContactClick?: () => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ onContactClick }) => {
  return (
    <header className="hero-profile-container">
      {/* Cover Banner */}
      <div className="hero-banner-wrapper">
        <img
          src="/assets/Background.png"
          alt="SSLG Profile Cover Banner"
          className="hero-banner-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80';
          }}
        />
        <div className="hero-banner-overlay" />
        <div className="hero-banner-badge">
          <Award size={14} /> Official Profile & Institutional Hub
        </div>
      </div>

      {/* Avatar & Profile Info Container */}
      <div className="hero-profile-content">
        {/* Overlapping Circular Profile Picture */}
        <div className="hero-avatar-wrapper">
          <img
            src="/assets/hero-D4LPL9Z8.png"
            alt="SSLG Crest Profile"
            className="hero-avatar-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/hero.png';
            }}
          />
          <div className="hero-avatar-status" title="Active Organization Hub" />
        </div>

        {/* Profile Identity Details */}
        <div className="hero-identity">
          <div className="hero-title-row">
            <h1 className="hero-title">Gubat NHS Supreme Secondary Learner Government</h1>
            <span className="hero-verified-badge" title="Verified Institutional Organization">
              <CheckCircle2 size={20} className="verified-icon" />
            </span>
          </div>

          <p className="hero-handle">
            <a
              href="https://www.facebook.com/GubatNHS.SSLG"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              https://www.facebook.com/GubatNHS.SSLG
            </a>
          </p>

          <p className="hero-bio">
            Empowering student voices, pioneering academic & technological innovations, and advancing data-driven campus governance across secondary education.
          </p>

          {/* Institutional Metadata & Links */}
          <div className="hero-meta-grid">
            <span className="hero-meta-item">
              <MapPin size={15} /> Gubat, Sorsogon, Philippines
            </span>
            <a href="mailto:sslg.gubatnhs@gmail.com" className="hero-meta-item" style={{ color: 'inherit', textDecoration: 'none' }}>
              <Mail size={15} /> sslg.gubatnhs@gmail.com
            </a>
            <span className="hero-meta-item">
              <Calendar size={15} /> Academic Year 2026-2027
            </span>
          </div>

          {/* Social Icons Bar */}
          <div className="hero-social-bar">
            <a href="https://www.facebook.com/GubatNHS.SSLG" target="_blank" rel="noreferrer" className="hero-social-btn" title="Facebook Page">
              <Globe size={16} />
            </a>
            <button onClick={onContactClick} className="hero-social-btn" title="Email Contact">
              <Mail size={17} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
