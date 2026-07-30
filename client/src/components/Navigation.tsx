import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  Moon,
  Sun,
  Menu,
  X,
  Share2,
  Sparkles,
  Bookmark
} from 'lucide-react';

export type NavTab = 'home' | 'about' | 'projects' | 'gallery' | 'publications' | 'team' | 'contact';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onShareVoiceClick: () => void;
  onSearchClick: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  theme: 'dark' | 'light' | 'OLED';
  onThemeToggle: () => void;
  onShowToast: (msg: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onShareVoiceClick,
  onSearchClick,
  isAdmin,
  onToggleAdmin,
  theme,
  onThemeToggle,
  onShowToast
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 220) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'publications', label: 'Publications' },
    { id: 'team', label: 'Team' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleShareWebsite = () => {
    navigator.clipboard.writeText(window.location.href);
    onShowToast('Website URL copied to clipboard!');
    setIsMoreMenuOpen(false);
  };

  return (
    <nav className={`sticky-nav-wrapper ${isScrolled ? 'scrolled-glass' : ''}`}>
      <div className="nav-container">
        <div className="mobile-nav-top">
          <div className="nav-brand-small">
            <span className="brand-dot" />
            <span className="brand-text">SSLG Hub</span>
          </div>
          <button
            className="mobile-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className={`nav-links-wrapper ${isMobileMenuOpen ? 'mobile-visible' : ''}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                onTabChange(item.id);
                setIsMobileMenuOpen(false);
              }}
            >
              {item.label}
              {activeTab === item.id && <span className="nav-indicator-pill" />}
            </button>
          ))}
        </div>

        <div className="nav-actions-right">
          <button
            onClick={onShareVoiceClick}
            className="action-btn action-primary"
            title="Submit Student Voice & Feedback"
          >
            <MessageSquare size={16} />
            <span className="btn-text">Share Your Voice</span>
            <Sparkles size={14} className="sparkle-icon" />
          </button>

          <button
            onClick={onSearchClick}
            className="action-btn action-secondary"
            title="Search Projects, Papers & Team"
          >
            <Search size={16} />
            <span className="btn-text">Search</span>
            <kbd className="cmd-shortcut">Ctrl+K</kbd>
          </button>

          <div className="more-options-relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`action-btn action-icon ${isMoreMenuOpen ? 'active' : ''}`}
              title="More Options & Admin Access"
            >
              <MoreHorizontal size={18} />
            </button>

            {isMoreMenuOpen && (
              <div className="more-dropdown-menu fade-in">
                <div className="dropdown-section-title">ADMIN & MODERATION</div>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    onToggleAdmin();
                    setIsMoreMenuOpen(false);
                  }}
                >
                  {isAdmin ? (
                    <>
                      <ShieldCheck size={16} color="#22c55e" />
                      <span>Admin Mode Active</span>
                      <span className="dropdown-badge green">ON</span>
                    </>
                  ) : (
                    <>
                      <Shield size={16} />
                      <span>Admin Access / Publishing</span>
                      <span className="dropdown-badge">LOGIN</span>
                    </>
                  )}
                </button>

                <div className="dropdown-section-title">APPEARANCE</div>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    onThemeToggle();
                    setIsMoreMenuOpen(false);
                  }}
                >
                  {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                  <span>Switch Theme ({theme})</span>
                </button>

                <div className="dropdown-section-title">TOOLS & SHARE</div>
                <button className="dropdown-item" onClick={handleShareWebsite}>
                  <Share2 size={16} />
                  <span>Share Profile Link</span>
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    onShowToast('Bookmark saved in local session!');
                    setIsMoreMenuOpen(false);
                  }}
                >
                  <Bookmark size={16} />
                  <span>Bookmark Profile</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
