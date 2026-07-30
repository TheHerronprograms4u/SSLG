import React, { useState, useEffect } from 'react';
import { HeroHeader } from '../components/HeroHeader';
import { Navigation } from '../components/Navigation';
import type { NavTab } from '../components/Navigation';
import { AdminPublishingModule } from '../components/AdminPublishingModule';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
import { FeedbackModal } from '../components/FeedbackModal';
import { SearchModal } from '../components/SearchModal';
import { LightboxModal } from '../components/LightboxModal';
import { Toast } from '../components/Toast';

import { AboutTab } from './AboutTab';
import { GalleryTab } from './GalleryTab';
import { PublicationsTab } from './PublicationsTab';
import { TeamTab } from './TeamTab';
import { ContactTab } from './ContactTab';

import type { Project } from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_PUBLICATIONS,
  INITIAL_TEAM,
  INITIAL_GALLERY
} from '../data/mockData';

import { SlidersHorizontal, Sparkles, Layers } from 'lucide-react';

export const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [theme, setTheme] = useState<'dark' | 'light' | 'OLED'>('dark');

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('sslg_admin_auth') === 'true';
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('sslg_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PROJECTS;
  });

  useEffect(() => {
    localStorage.setItem('sslg_projects', JSON.stringify(projects));
  }, [projects]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => setToastMessage(msg);

  const handleToggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      localStorage.setItem('sslg_admin_auth', 'false');
      showToast('Admin logged out.');
    } else {
      setIsAdmin(true);
      localStorage.setItem('sslg_admin_auth', 'true');
      showToast('Logged in as Administrator (Demo Mode).');
    }
  };

  const handleAddProject = (newProj: Project) => {
    setProjects([newProj, ...projects]);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleLikeProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjects(
      projects.map((p) =>
        p.id === id ? { ...p, likes: p.likes + 1 } : p
      )
    );
    showToast('Applauded project initiative!');
  };

  const categories = ['All', 'AI & Learning', 'Campus Infrastructure', 'Educational Tech', 'Sustainable Energy', 'Student Welfare', 'Innovation'];

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    return new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime();
  });

  return (
    <div className={`sslg-app-wrapper theme-${theme}`}>
      <div className="main-content-layout">
        <HeroHeader
          onContactClick={() => setActiveTab('contact')}
        />

        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onShareVoiceClick={() => setIsFeedbackOpen(true)}
          onSearchClick={() => setIsSearchOpen(true)}
          isAdmin={isAdmin}
          onToggleAdmin={handleToggleAdmin}
          theme={theme}
          onThemeToggle={() => {
            const nextTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'OLED' : 'dark';
            setTheme(nextTheme);
            showToast(`Theme switched to ${nextTheme.toUpperCase()} mode.`);
          }}
          onShowToast={showToast}
        />

        <AdminPublishingModule
          isAdmin={isAdmin}
          onLogin={() => {
            setIsAdmin(true);
            localStorage.setItem('sslg_admin_auth', 'true');
            showToast('Administrator Mode Activated');
          }}
          onLogout={() => {
            setIsAdmin(false);
            localStorage.setItem('sslg_admin_auth', 'false');
            showToast('Administrator Mode Disabled');
          }}
          projects={projects}
          onAddProject={handleAddProject}
          onDeleteProject={handleDeleteProject}
          onShowToast={showToast}
        />

        <main className="feed-main-container">
          {(activeTab === 'home' || activeTab === 'projects') && (
            <div className="projects-feed-wrapper fade-in">
              <div className="feed-filter-bar">
                <div className="filter-chips-scroll">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`filter-chip-pill ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="feed-sort-group">
                  <span className="sort-label"><SlidersHorizontal size={14} /> Sort:</span>
                  <button
                    className={`sort-toggle-btn ${sortBy === 'latest' ? 'active' : ''}`}
                    onClick={() => setSortBy('latest')}
                  >
                    Latest
                  </button>
                  <button
                    className={`sort-toggle-btn ${sortBy === 'popular' ? 'active' : ''}`}
                    onClick={() => setSortBy('popular')}
                  >
                    Most Popular
                  </button>
                </div>
              </div>

              <div className="feed-section-header">
                <div>
                  <h2 className="feed-title">Published Projects & Initiatives</h2>
                  <p className="feed-subtitle">
                    Showing {filteredProjects.length} institutional research projects and learner government initiatives.
                  </p>
                </div>
                {isAdmin && (
                  <span className="feed-admin-tag">
                    <Sparkles size={13} /> Admin Editor Mode
                  </span>
                )}
              </div>

              <div className="projects-card-grid">
                {filteredProjects.map((proj) => (
                  <ProjectCard
                    key={proj.id}
                    project={proj}
                    onSelect={setSelectedProject}
                    onLike={handleLikeProject}
                  />
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="feed-empty-box">
                  <Layers size={40} />
                  <h3>No projects found in this category</h3>
                  <p>Try switching categories or use the Admin Module to publish a new initiative.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && <AboutTab />}

          {activeTab === 'gallery' && (
            <GalleryTab
              galleryItems={INITIAL_GALLERY}
              onOpenLightbox={(url) => setLightboxImg(url)}
            />
          )}

          {activeTab === 'publications' && (
            <PublicationsTab
              publications={INITIAL_PUBLICATIONS}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'team' && (
            <TeamTab
              teamMembers={INITIAL_TEAM}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'contact' && (
            <ContactTab onShowToast={showToast} />
          )}
        </main>

        <footer className="hub-footer">
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-logo">
                <span className="brand-dot" />
                <strong>Gubat NHS Supreme Secondary Learner Government</strong>
              </div>
              <p>Empowering learners, advancing research, and modernizing institutional campus governance.</p>
            </div>

            <div className="footer-links">
              <div>
                <strong>Navigation</strong>
                <a onClick={() => setActiveTab('home')}>Home Feed</a>
                <a onClick={() => setActiveTab('about')}>About SSLG</a>
                <a onClick={() => setActiveTab('projects')}>Projects</a>
                <a onClick={() => setActiveTab('gallery')}>Gallery</a>
              </div>
              <div>
                <strong>Research & Governance</strong>
                <a onClick={() => setActiveTab('publications')}>Publications</a>
                <a onClick={() => setActiveTab('team')}>Council Team</a>
                <a onClick={() => setIsFeedbackOpen(true)}>Share Voice</a>
                <a onClick={handleToggleAdmin}>{isAdmin ? 'Logout Admin' : 'Admin Login'}</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Gubat National High School SSLG. All rights reserved.</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="back-to-top-btn"
            >
              Back to Top ↑
            </button>
          </div>
        </footer>
      </div>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        allProjects={projects}
        onSelectRelated={setSelectedProject}
        onOpenLightbox={(url) => setLightboxImg(url)}
        onShowToast={showToast}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onShowToast={showToast}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        projects={projects}
        publications={INITIAL_PUBLICATIONS}
        team={INITIAL_TEAM}
        onSelectProject={setSelectedProject}
      />

      <LightboxModal
        imageUrl={lightboxImg}
        onClose={() => setLightboxImg(null)}
      />

      <Toast
        message={toastMessage}
        onClear={() => setToastMessage(null)}
      />
    </div>
  );
};

export default Home;
