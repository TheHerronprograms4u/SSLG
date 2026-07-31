import React, { useState } from 'react';
import type { Project } from '../types';
import { RichTextEditor } from './RichTextEditor';
import {
  UploadCloud,
  FileText,
  Plus,
  Trash2,
  Image as ImageIcon,
  Lock,
  Layers,
  RotateCcw,
  MessageSquare
} from 'lucide-react';

interface AdminPublishingModuleProps {
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
  projects: Project[];
  onAddProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const AdminPublishingModule: React.FC<AdminPublishingModuleProps> = ({
  isAdmin,
  onLogin,
  onLogout,
  projects,
  onAddProject,
  onDeleteProject,
  onShowToast
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [shortSummary, setShortSummary] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [category, setCategory] = useState<Project['category']>('AI & Learning');
  const [status, setStatus] = useState<Project['status']>('Active');
  const [authors, setAuthors] = useState('Gubat NHS SSLG');
  const [organization, setOrganization] = useState('Gubat NHS SSLG Innovation Hub');
  const [datePublished, setDatePublished] = useState(new Date().toISOString().split('T')[0]);
  const [coverImage, setCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [docName, setDocName] = useState('');

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadProgress(10);

    const fileList = Array.from(files);
    let loadedCount = 0;
    const loadedUrls: string[] = [];

    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          loadedUrls.push(result);
        }
        loadedCount++;
        const pct = Math.round((loadedCount / fileList.length) * 100);
        setUploadProgress(pct);

        if (loadedCount === fileList.length) {
          setIsUploading(false);
          onShowToast(`${fileList.length} image file(s) uploaded successfully!`);
          setGalleryImages((prevArr) => [...prevArr, ...loadedUrls]);
          if (!coverImage && loadedUrls.length > 0) {
            setCoverImage(loadedUrls[0]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortSummary.trim()) {
      alert('Please fill in at least the project title and short summary.');
      return;
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title,
      shortSummary,
      fullDescription: fullDescription || shortSummary,
      category,
      status,
      authors: authors.split(',').map((a) => a.trim()).filter(Boolean),
      organization,
      datePublished,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      galleryImages,
      resources: [
        {
          id: `res-${Date.now()}`,
          name: docName || 'Project Resource Document.pdf',
          url: '#',
          size: '3.4 MB',
          format: 'pdf'
        }
      ],
      comments: [],
      likes: 1,
      reads: 12,
      featured: status === 'Featured'
    };

    onAddProject(newProject);
    onShowToast(`Project "${title}" published successfully!`);

    setTitle('');
    setShortSummary('');
    setFullDescription('');
  };

  if (!isAdmin) {
    return (
      <div className="admin-lock-card">
        <div className="admin-lock-icon">
          <Lock size={28} />
        </div>
        <div className="admin-lock-text">
          <h3>Administrator Project Publishing Module</h3>
          <p>This module allows officers to publish projects, upload media, and edit rich research content.</p>
        </div>
        <div className="admin-lock-actions">
          <button onClick={onLogin} className="button admin-demo-login-btn">
            <Lock size={16} /> Admin Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-module-container fade-in">
      <div className="admin-module-header">
        <div className="admin-title-group">
          <span className="admin-badge">
            <Layers size={14} /> ADMINISTRATOR CONTROL CENTER
          </span>
          <h2>Project Publishing & Research Management Module</h2>
        </div>
        <div className="admin-header-buttons">
          <a
            href="/admin"
            className="admin-secondary-btn"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <MessageSquare size={15} /> Feedback Dashboard
          </a>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="admin-secondary-btn"
          >
            {isExpanded ? 'Collapse Form' : 'Expand Form'}
          </button>
          <button type="button" onClick={onLogout} className="admin-danger-btn">
            Logout Admin
          </button>
        </div>
      </div>

      {isExpanded && (
        <form onSubmit={handlePublishSubmit} className="admin-publishing-form">
          <div className="form-section">
            <h4 className="section-subtitle">
              <FileText size={16} /> 1. Basic Project Information
            </h4>
            
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Next-Gen Student Portal & Automated Research Repository"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Project['category'])}
                  >
                    <option value="AI & Learning">AI & Learning</option>
                    <option value="Campus Infrastructure">Campus Infrastructure</option>
                    <option value="Educational Tech">Educational Tech</option>
                    <option value="Sustainable Energy">Sustainable Energy</option>
                    <option value="Student Welfare">Student Welfare</option>
                    <option value="Innovation">Innovation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Publication Status</label>
                  <select
                    className="input"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Project['status'])}
                  >
                    <option value="Active">Active</option>
                    <option value="Featured">Featured</option>
                    <option value="Completed">Completed</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Short Summary (Featured Card Excerpt) *</label>
              <textarea
                className="textarea"
                rows={2}
                placeholder="Brief high-level overview displayed on the project card..."
                value={shortSummary}
                onChange={(e) => setShortSummary(e.target.value)}
                required
              />
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Authors / Researchers (Comma Separated)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Dr. Alexis Vance, Mark Rivers, M.Sc."
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Organization / Lab</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Gubat NHS SSLG & Innovation Hub"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date Published</label>
                <input
                  type="date"
                  className="input"
                  value={datePublished}
                  onChange={(e) => setDatePublished(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-subtitle">
              <ImageIcon size={16} /> 2. Media Upload & Gallery Generation
            </h4>

            <div className="form-group">
              <label className="form-label">Featured Cover Image</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Paste image URL or click Upload ->"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                />
                <label className="button browse-file-btn" style={{ whiteSpace: 'nowrap', cursor: 'pointer', padding: '0.6rem 1rem' }}>
                  Upload Cover
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const res = ev.target?.result as string;
                          if (res) setCoverImage(res);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div
              className={`drag-drop-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <UploadCloud size={40} className="upload-icon" />
              <h4>Drag & Drop Project Photographs Here</h4>
              <p>Upload multiple photos to automatically generate Masonry Layouts, Lightbox Previews & Zoom Effects.</p>
              
              <label className="button browse-file-btn">
                Browse Files
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </label>

              {isUploading && (
                <div className="upload-progress-wrapper">
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <span className="progress-text">Processing & Generating Gallery Assets... {uploadProgress}%</span>
                </div>
              )}
            </div>

            <div className="gallery-preview-grid">
              {galleryImages.map((imgUrl, index) => (
                <div key={index} className="gallery-preview-item">
                  <img src={imgUrl} alt={`Gallery preview ${index}`} />
                  <button
                    type="button"
                    className="remove-img-btn"
                    onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== index))}
                    title="Remove Photo"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Supporting Documentation File Name</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. SSLG-Research-Whitepaper-2026.pdf"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-subtitle">
              <FileText size={16} /> 3. Rich Content Article Editor
            </h4>
            <RichTextEditor
              value={fullDescription}
              onChange={setFullDescription}
            />
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="button publish-submit-btn">
              <Plus size={18} /> Publish Project to Live Feed
            </button>
            <button
              type="button"
              className="admin-secondary-btn"
              onClick={() => {
                setTitle('');
                setShortSummary('');
                setFullDescription('');
                onShowToast('Form cleared.');
              }}
            >
              <RotateCcw size={16} /> Reset Form
            </button>
          </div>
        </form>
      )}

      <div className="admin-manage-list">
        <h3>Currently Managed Projects ({projects.length})</h3>
        <div className="admin-projects-table">
          {projects.map((proj) => (
            <div key={proj.id} className="admin-project-row">
              <img src={proj.coverImage} alt={proj.title} className="row-thumb" />
              <div className="row-details">
                <strong className="row-title">{proj.title}</strong>
                <span className="row-meta">
                  {proj.category} • {proj.status} • {proj.datePublished}
                </span>
              </div>
              <div className="row-actions">
                <button
                  type="button"
                  onClick={() => {
                    onDeleteProject(proj.id);
                    onShowToast(`Deleted project "${proj.title}"`);
                  }}
                  className="row-delete-btn"
                  title="Delete Project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
