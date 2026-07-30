import React, { useState, useEffect } from 'react';
import type { Project, Publication, TeamMember } from '../types';
import { Search, X, ArrowRight, BookOpen, Users, Folder } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  publications: Publication[];
  team: TeamMember[];
  onSelectProject: (p: Project) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  projects,
  publications,
  team,
  onSelectProject
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.shortSummary.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPublications = publications.filter(
    (pub) =>
      pub.title.toLowerCase().includes(query.toLowerCase()) ||
      pub.abstract.toLowerCase().includes(query.toLowerCase()) ||
      pub.authors.some((a) => a.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredTeam = team.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.role.toLowerCase().includes(query.toLowerCase()) ||
      t.department.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-overlay fade-in" onClick={onClose}>
      <div className="search-dialog-card" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-header">
          <Search size={22} className="search-magnifier" />
          <input
            type="text"
            className="search-prompt-input"
            placeholder="Search projects, publications, team members, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} className="search-close-btn">
            <X size={18} />
          </button>
        </div>

        <div className="search-results-scroll">
          {!query && (
            <div className="search-quick-tags">
              <span>Quick Filters:</span>
              {['AI & Learning', 'Sustainable Energy', 'Student Welfare', 'Publications', 'Team'].map((tag) => (
                <button
                  key={tag}
                  className="quick-tag-btn"
                  onClick={() => setQuery(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {filteredProjects.length > 0 && (
            <div className="search-result-group">
              <div className="result-group-title">
                <Folder size={15} /> RESEARCH PROJECTS ({filteredProjects.length})
              </div>
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="search-item-card"
                  onClick={() => {
                    onSelectProject(proj);
                    onClose();
                  }}
                >
                  <img src={proj.coverImage} alt={proj.title} className="search-item-thumb" />
                  <div className="search-item-info">
                    <strong>{proj.title}</strong>
                    <p>{proj.shortSummary}</p>
                    <span className="search-item-tag">{proj.category}</span>
                  </div>
                  <ArrowRight size={16} className="search-item-arrow" />
                </div>
              ))}
            </div>
          )}

          {filteredPublications.length > 0 && (
            <div className="search-result-group">
              <div className="result-group-title">
                <BookOpen size={15} /> ACADEMIC PUBLICATIONS ({filteredPublications.length})
              </div>
              {filteredPublications.map((pub) => (
                <div key={pub.id} className="search-item-card text-only">
                  <div className="search-item-info">
                    <strong>{pub.title}</strong>
                    <p>{pub.journal} ({pub.year}) • DOI: {pub.doi}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredTeam.length > 0 && (
            <div className="search-result-group">
              <div className="result-group-title">
                <Users size={15} /> TEAM & OFFICERS ({filteredTeam.length})
              </div>
              {filteredTeam.map((t) => (
                <div key={t.id} className="search-item-card">
                  <img src={t.avatar} alt={t.name} className="search-item-thumb round" />
                  <div className="search-item-info">
                    <strong>{t.name}</strong>
                    <p>{t.role} • {t.department}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {query && filteredProjects.length === 0 && filteredPublications.length === 0 && filteredTeam.length === 0 && (
            <div className="search-empty-state">
              <p>No results found for "{query}". Try searching for keywords like "AI", "Solar", or "Publications".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
