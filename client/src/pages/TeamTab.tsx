import React, { useState } from 'react';
import type { TeamMember } from '../types';
import { Users, Mail, Folder } from 'lucide-react';
import { TwitterIcon, GithubIcon, LinkedinIcon } from '../components/SocialIcons';

interface TeamTabProps {
  teamMembers: TeamMember[];
  onShowToast: (msg: string) => void;
}

export const TeamTab: React.FC<TeamTabProps> = ({ teamMembers, onShowToast }) => {
  const [activeDept, setActiveDept] = useState<string>('All');

  const departments = ['All', 'Executive Board', 'Tech & Innovation', 'Academic Affairs', 'Research & Dev'];

  const filteredTeam = activeDept === 'All'
    ? teamMembers
    : teamMembers.filter((t) => t.department === activeDept);

  return (
    <div className="team-tab-container fade-in">
      <div className="team-header">
        <span className="team-badge">
          <Users size={14} /> COUNCIL OFFICERS & RESEARCHERS
        </span>
        <h2>Meet the SSLG Leadership & Innovation Team</h2>
        <p>Dedicated student council officers, faculty advisors, and technical leads driving research and student empowerment.</p>
      </div>

      <div className="team-dept-chips">
        {departments.map((dept) => (
          <button
            key={dept}
            className={`team-chip ${activeDept === dept ? 'active' : ''}`}
            onClick={() => setActiveDept(dept)}
          >
            {dept}
          </button>
        ))}
      </div>

      <div className="team-cards-grid">
        {filteredTeam.map((member) => (
          <div key={member.id} className="team-card fade-in">
            <div className="team-card-avatar-wrapper">
              <img src={member.avatar} alt={member.name} className="team-card-avatar" />
              <span className="team-dept-pill">{member.department}</span>
            </div>

            <div className="team-card-content">
              <h3 className="team-member-name">{member.name}</h3>
              <span className="team-member-role">{member.role}</span>
              <p className="team-member-bio">{member.bio}</p>

              <div className="team-card-meta">
                <span><Folder size={14} /> {member.projectsCount} Projects Spearheaded</span>
              </div>

              <div className="team-social-row">
                {member.socials.twitter && (
                  <a href={member.socials.twitter} target="_blank" rel="noreferrer" className="team-social-icon" title="Twitter">
                    <TwitterIcon size={15} />
                  </a>
                )}
                {member.socials.github && (
                  <a href={member.socials.github} target="_blank" rel="noreferrer" className="team-social-icon" title="GitHub">
                    <GithubIcon size={15} />
                  </a>
                )}
                {member.socials.linkedin && (
                  <a href={member.socials.linkedin} target="_blank" rel="noreferrer" className="team-social-icon" title="LinkedIn">
                    <LinkedinIcon size={15} />
                  </a>
                )}
                <button
                  className="team-mail-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(member.email);
                    onShowToast(`Copied email ${member.email} to clipboard!`);
                  }}
                  title="Copy Email"
                >
                  <Mail size={14} /> Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTeam.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #fce4ec', marginTop: '1.5rem' }}>
          <Users size={36} color="var(--accent-primary)" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>No team members currently listed</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Official council team rosters will be published by the SSLG Executive Office.</p>
        </div>
      )}
    </div>
  );
};
