import React from 'react';
import { Target, Award, Shield, Zap, Compass } from 'lucide-react';

export const AboutTab: React.FC = () => {
  const stats = [
    { label: 'Active Projects', value: '24+', change: '+12 this year' },
    { label: 'Student Body Served', value: '3,200+', change: '100% campus reach' },
    { label: 'Publications & Papers', value: '18', change: 'Indexed repositories' },
    { label: 'Community Initiatives', value: '45+', change: 'Active student forums' },
  ];

  const pillars = [
    {
      icon: Target,
      title: 'Student Voice & Advocacy',
      desc: 'Establishing anonymous, data-backed feedback pipelines that directly inform institutional policy changes and campus welfare.'
    },
    {
      icon: Zap,
      title: 'Tech & Research Innovation',
      desc: 'Pioneering open-source AI tools, IoT solar grids, and digital learning platforms designed by high school researchers for learners.'
    },
    {
      icon: Award,
      title: 'Academic Excellence',
      desc: 'Promoting STEM mentorship, peer tutoring networks, and research symposiums to cultivate critical thinking.'
    },
    {
      icon: Shield,
      title: 'Transparent Governance',
      desc: 'Maintaining open project progress tracking, audited fiscal accountability, and responsive leadership.'
    }
  ];

  const milestones = [
    { year: '2026', title: 'Launch of AI Student Hub & Eco-Solar Pods', desc: 'Deployed full smart campus assistant and off-grid solar study spaces.' },
    { year: '2025', title: 'Digital Feedback Charter Adopted', desc: 'Formalized real-time feedback resolution protocols with the school administration.' },
    { year: '2024', title: 'Establishment of SSLG Research Division', desc: 'Integrated student tech leads into institutional development teams.' }
  ];

  return (
    <div className="about-tab-container fade-in">
      <section className="about-hero-card">
        <span className="about-badge">
          <Compass size={14} /> ABOUT GUBAT NHS SSLG
        </span>
        <h2>Building the Future of Secondary Learner Empowerment</h2>
        <p>
          The Supreme Secondary Learner Government (SSLG) at Gubat National High School is the primary student-led governing body and innovation hub. We combine student advocacy with cutting-edge technological research to elevate educational experience, campus sustainability, and student leadership.
        </p>
      </section>

      <section className="about-stats-grid">
        {stats.map((item, idx) => (
          <div key={idx} className="about-stat-card">
            <span className="stat-value">{item.value}</span>
            <strong className="stat-label">{item.label}</strong>
            <span className="stat-change">{item.change}</span>
          </div>
        ))}
      </section>

      <section className="about-pillars-section">
        <h3 className="section-title-centered">Our Four Core Pillars</h3>
        <div className="pillars-grid">
          {pillars.map((pil, idx) => (
            <div key={idx} className="pillar-card">
              <div className="pillar-icon">
                <pil.icon size={26} />
              </div>
              <h4>{pil.title}</h4>
              <p>{pil.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-timeline-section">
        <h3 className="section-title-centered">Institutional Roadmap & History</h3>
        <div className="timeline-wrapper">
          {milestones.map((m, idx) => (
            <div key={idx} className="timeline-node">
              <div className="node-year">{m.year}</div>
              <div className="node-content">
                <h4>{m.title}</h4>
                <p>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
