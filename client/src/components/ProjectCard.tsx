import React from 'react';
import type { Project } from '../types';
import {
  Calendar,
  User,
  ArrowRight,
  Eye,
  Heart,
  Sparkles
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onLike?: (id: string, e: React.MouseEvent) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, onLike }) => {
  return (
    <article
      className={`project-card-wrapper fade-in ${project.featured ? 'is-featured' : ''}`}
      onClick={() => onSelect(project)}
    >
      {project.featured && (
        <div className="card-featured-badge">
          <Sparkles size={12} /> FEATURED INITIATIVE
        </div>
      )}

      <div className="card-media-wrapper">
        <img
          src={project.coverImage}
          alt={project.title}
          className="card-media-img"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="card-category-badge">{project.category}</div>
        <div className="card-status-badge">{project.status}</div>
      </div>

      <div className="card-body">
        <div className="card-meta-row">
          <span className="card-meta-item">
            <Calendar size={13} /> {project.datePublished}
          </span>
          <span className="card-meta-item">
            <User size={13} /> {project.authors[0] || 'SSLG Team'}
            {project.authors.length > 1 ? ` +${project.authors.length - 1}` : ''}
          </span>
        </div>

        <h3 className="card-title">{project.title}</h3>
        <p className="card-summary">{project.shortSummary}</p>

        <div className="card-footer-row">
          <div className="card-stats">
            <span className="stat-pill" title="Reads">
              <Eye size={13} /> {project.reads}
            </span>
            <button
              type="button"
              className="stat-pill like-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (onLike) onLike(project.id, e);
              }}
              title="Applaud Project"
            >
              <Heart size={13} /> {project.likes}
            </button>
          </div>

          <button className="read-more-btn">
            Read More <ArrowRight size={15} className="arrow-icon" />
          </button>
        </div>
      </div>
    </article>
  );
};
