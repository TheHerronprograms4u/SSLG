import React, { useState } from 'react';
import type { Project, Comment } from '../types';
import {
  X,
  Calendar,
  User,
  Building,
  Eye,
  Heart,
  Share2,
  Bookmark,
  Download,
  MessageSquare,
  Send,
  Maximize2,
  FileText
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  allProjects: Project[];
  onSelectRelated: (project: Project) => void;
  onOpenLightbox: (imageUrl: string) => void;
  onShowToast: (msg: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  allProjects,
  onSelectRelated,
  onOpenLightbox,
  onShowToast
}) => {
  if (!project) return null;

  const [likesCount, setLikesCount] = useState(project.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState<Comment[]>(project.comments || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount(likesCount + 1);
      setHasLiked(true);
      onShowToast('You applauded this research project!');
    } else {
      setLikesCount(likesCount - 1);
      setHasLiked(false);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onShowToast(!isBookmarked ? 'Project saved to bookmarks!' : 'Bookmark removed.');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    onShowToast('Project link copied to clipboard!');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: authorName.trim() || 'Student Researcher / Peer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      date: new Date().toISOString().split('T')[0],
      text: newCommentText.trim(),
      likes: 0
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
    onShowToast('Comment posted successfully!');
  };

  const handleCommentLike = (commentId: string) => {
    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      )
    );
  };

  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 2);

  return (
    <div className="project-detail-overlay fade-in" onClick={onClose}>
      <div
        className="project-detail-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="detail-top-bar">
          <div className="detail-top-left">
            <span className="detail-cat-pill">{project.category}</span>
            <span className="detail-status-pill">{project.status}</span>
          </div>
          <div className="detail-top-right">
            <button
              onClick={handleBookmark}
              className={`detail-icon-btn ${isBookmarked ? 'bookmarked' : ''}`}
              title="Save Project"
            >
              <Bookmark size={18} />
            </button>
            <button onClick={handleCopyLink} className="detail-icon-btn" title="Share Project">
              <Share2 size={18} />
            </button>
            <button onClick={onClose} className="detail-close-btn" title="Close Page (Esc)">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="detail-hero-banner">
          <img
            src={project.coverImage}
            alt={project.title}
            className="detail-hero-img"
          />
          <div className="detail-hero-overlay" />
          <div className="detail-hero-content">
            <h1 className="detail-hero-title">{project.title}</h1>
            <p className="detail-hero-subtitle">{project.shortSummary}</p>
          </div>
        </div>

        <div className="detail-meta-bar">
          <div className="meta-block">
            <User size={16} />
            <div>
              <span className="meta-label">RESEARCH AUTHORS</span>
              <strong className="meta-val">{project.authors.join(', ')}</strong>
            </div>
          </div>

          <div className="meta-block">
            <Building size={16} />
            <div>
              <span className="meta-label">INSTITUTION</span>
              <strong className="meta-val">{project.organization}</strong>
            </div>
          </div>

          <div className="meta-block">
            <Calendar size={16} />
            <div>
              <span className="meta-label">DATE PUBLISHED</span>
              <strong className="meta-val">{project.datePublished}</strong>
            </div>
          </div>

          <div className="meta-block">
            <Eye size={16} />
            <div>
              <span className="meta-label">ENGAGEMENT</span>
              <strong className="meta-val">{project.reads} Reads • {likesCount} Likes</strong>
            </div>
          </div>
        </div>

        <div className="detail-main-layout">
          <div className="detail-primary-content">
            <section className="detail-section">
              <h3 className="section-heading">Detailed Project Overview & Implementation</h3>
              <div className="rich-formatted-body">
                {project.fullDescription.split('\n').map((line, idx) => {
                  if (line.startsWith('# ')) return <h1 key={idx}>{line.replace('# ', '')}</h1>;
                  if (line.startsWith('## ')) return <h2 key={idx}>{line.replace('## ', '')}</h2>;
                  if (line.startsWith('### ')) return <h3 key={idx}>{line.replace('### ', '')}</h3>;
                  if (line.startsWith('> ')) return <blockquote key={idx}>{line.replace('> ', '')}</blockquote>;
                  if (line.startsWith('- ')) return <li key={idx}>{line.replace('- ', '')}</li>;
                  if (line.trim() === '') return <br key={idx} />;
                  return <p key={idx}>{line}</p>;
                })}
              </div>
            </section>

            {project.galleryImages && project.galleryImages.length > 0 && (
              <section className="detail-section">
                <h3 className="section-heading">Project Media & Field Photography Gallery</h3>
                <p className="section-desc">Click any image to launch the Lightbox zoom viewer.</p>
                
                <div className="detail-masonry-grid">
                  {project.galleryImages.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="masonry-item"
                      onClick={() => onOpenLightbox(imgUrl)}
                    >
                      <img src={imgUrl} alt={`Project capture ${i}`} loading="lazy" />
                      <div className="masonry-overlay">
                        <Maximize2 size={20} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {project.resources && project.resources.length > 0 && (
              <section className="detail-section">
                <h3 className="section-heading">Attached Documentation & Downloadable Assets</h3>
                <div className="resources-list">
                  {project.resources.map((res) => (
                    <div key={res.id} className="resource-card">
                      <div className="res-icon">
                        <FileText size={22} />
                      </div>
                      <div className="res-info">
                        <strong>{res.name}</strong>
                        <span>Format: {res.format.toUpperCase()} • Size: {res.size}</span>
                      </div>
                      <button
                        className="button res-download-btn"
                        onClick={() => onShowToast(`Downloading ${res.name}...`)}
                      >
                        <Download size={15} /> Download
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="detail-applaud-bar">
              <button
                onClick={handleLike}
                className={`applaud-btn ${hasLiked ? 'liked' : ''}`}
              >
                <Heart size={20} className={hasLiked ? 'fill-heart' : ''} />
                <span>{hasLiked ? 'Applauded!' : 'Applaud Research'} ({likesCount})</span>
              </button>

              <div className="social-share-group">
                <span>Share:</span>
                <button onClick={handleCopyLink} className="social-share-icon" title="Copy Link">
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            <section className="detail-section comments-section">
              <h3 className="section-heading">
                <MessageSquare size={20} /> Research Discussions & Student Feedback ({comments.length})
              </h3>

              <form onSubmit={handleAddComment} className="add-comment-form">
                <input
                  type="text"
                  className="input comment-name-input"
                  placeholder="Your Name / Affiliation (e.g. Student Council Representative)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
                <textarea
                  className="textarea comment-text-input"
                  rows={3}
                  placeholder="Share your thoughts, suggestions, or technical feedback on this initiative..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  required
                />
                <button type="submit" className="button post-comment-btn">
                  <Send size={15} /> Post Feedback Comment
                </button>
              </form>

              <div className="comments-feed">
                {comments.map((c) => (
                  <div key={c.id} className="comment-item">
                    <img src={c.avatar} alt={c.author} className="comment-avatar" />
                    <div className="comment-body">
                      <div className="comment-header">
                        <strong>{c.author}</strong>
                        <span className="comment-date">{c.date}</span>
                      </div>
                      <p className="comment-text">{c.text}</p>
                      <button
                        onClick={() => handleCommentLike(c.id)}
                        className="comment-like-btn"
                      >
                        <Heart size={12} /> {c.likes} Upvotes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="detail-sidebar">
            <div className="sidebar-card">
              <h4>Research Contributors</h4>
              <div className="contributors-list">
                {project.authors.map((author, index) => (
                  <div key={index} className="contributor-item">
                    <div className="contributor-avatar">
                      {author.charAt(0)}
                    </div>
                    <div className="contributor-info">
                      <strong>{author}</strong>
                      <span>Researcher / Contributor</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {relatedProjects.length > 0 && (
              <div className="sidebar-card">
                <h4>Related Projects</h4>
                <div className="related-projects-list">
                  {relatedProjects.map((rel) => (
                    <div
                      key={rel.id}
                      className="related-item"
                      onClick={() => onSelectRelated(rel)}
                    >
                      <img src={rel.coverImage} alt={rel.title} />
                      <div>
                        <h5>{rel.title}</h5>
                        <span>{rel.datePublished}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
