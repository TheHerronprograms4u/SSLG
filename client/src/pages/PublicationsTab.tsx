import React, { useState } from 'react';
import type { Publication } from '../types';
import { BookOpen, Download, Copy, Search, FileText } from 'lucide-react';

interface PublicationsTabProps {
  publications: Publication[];
  onShowToast: (msg: string) => void;
}

export const PublicationsTab: React.FC<PublicationsTabProps> = ({ publications, onShowToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredPubs = publications.filter(
    (pub) =>
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.authors.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const copyCitation = (citation: string) => {
    navigator.clipboard.writeText(citation);
    onShowToast('Citation copied to clipboard!');
  };

  return (
    <div className="publications-tab-container fade-in">
      <div className="pub-header">
        <span className="pub-badge">
          <BookOpen size={14} /> ACADEMIC & INSTITUTIONAL PAPERS
        </span>
        <h2>Peer-Reviewed Publications & Research Briefs</h2>
        <p>Explore scholarly papers, research frameworks, and institutional reports published by SSLG officers and student researchers.</p>
      </div>

      <div className="pub-search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="input pub-input"
          placeholder="Search by paper title, abstract keywords, or author name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="pub-list">
        {filteredPubs.map((pub) => (
          <div key={pub.id} className="pub-card fade-in">
            <div className="pub-card-top">
              <span className="pub-category-pill">{pub.category}</span>
              <span className="pub-year">{pub.year}</span>
            </div>

            <h3 className="pub-title">{pub.title}</h3>
            
            <p className="pub-authors">
              <strong>Authors:</strong> {pub.authors.join(', ')}
            </p>

            <div className="pub-journal-info">
              <span><strong>Journal:</strong> {pub.journal}</span>
              <span className="pub-doi">DOI: {pub.doi}</span>
            </div>

            <div className="pub-actions">
              <button
                className="pub-btn pub-abstract-btn"
                onClick={() => setExpandedId(expandedId === pub.id ? null : pub.id)}
              >
                <FileText size={15} /> {expandedId === pub.id ? 'Hide Abstract' : 'View Abstract'}
              </button>

              <button
                className="pub-btn pub-cite-btn"
                onClick={() => copyCitation(pub.citation)}
              >
                <Copy size={15} /> Copy APA Citation
              </button>

              <button
                className="pub-btn pub-download-btn"
                onClick={() => onShowToast(`Downloading paper "${pub.title}.pdf"...`)}
              >
                <Download size={15} /> PDF Brief
              </button>
            </div>

            {expandedId === pub.id && (
              <div className="pub-abstract-box fade-in">
                <h4>Abstract Overview</h4>
                <p>{pub.abstract}</p>
                <div className="citation-preview-box">
                  <code>{pub.citation}</code>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredPubs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #fce4ec', marginTop: '1.5rem' }}>
          <BookOpen size={36} color="var(--accent-primary)" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>No publications currently listed</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Academic papers and briefs will be published here upon release.</p>
        </div>
      )}
    </div>
  );
};
