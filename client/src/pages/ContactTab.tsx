import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send, HelpCircle, CheckCircle2 } from 'lucide-react';

interface ContactTabProps {
  onShowToast: (msg: string) => void;
}

export const ContactTab: React.FC<ContactTabProps> = ({ onShowToast }) => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    onShowToast('Inquiry sent to SSLG Executive Office!');
  };

  const faqs = [
    {
      q: 'How can students submit feedback anonymously?',
      a: 'Click "Share Your Voice" in the top navigation bar. Select a category, rate your experience, type your message, and check "Submit anonymously".'
    },
    {
      q: 'How do student researchers publish projects on this portal?',
      a: 'Project publishing is managed by authorized SSLG officers via the Administrator Publishing Module. Reach out to the Tech & Innovation team to submit a research proposal.'
    },
    {
      q: 'Where is the SSLG Head Office located on campus?',
      a: 'Beside the track & soccer field, Gubat National High School, Gubat, Sorsogon, Philippines.'
    }
  ];

  return (
    <div className="contact-tab-container fade-in">
      <div className="contact-header">
        <span className="contact-badge">
          <Mail size={14} /> GET IN TOUCH WITH SSLG
        </span>
        <h2>Contact & Official Inquiry Hub</h2>
        <p>Have questions, research proposals, or administrative inquiries? Reach out directly to the Supreme Secondary Learner Government.</p>
      </div>

      <div className="contact-grid">
        {/* Left: Contact Form */}
        <div className="contact-card-box">
          <h3>Send an Official Message</h3>

          {sent ? (
            <div className="contact-sent-box fade-in">
              <CheckCircle2 size={50} color="#22c55e" />
              <h4>Message Transmitted</h4>
              <p>Thank you for reaching out. The SSLG secretariat will respond to your inquiry via email shortly.</p>
              <button
                className="button"
                onClick={() => {
                  setSent(false);
                  setForm({ name: '', email: '', subject: '', message: '' });
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Maria Santos"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject / Purpose</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Research Collaboration Proposal"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message Details *</label>
                <textarea
                  className="textarea"
                  rows={5}
                  placeholder="Write your detailed inquiry here..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="button contact-submit-btn">
                <Send size={16} /> Send Inquiry
              </button>
            </form>
          )}
        </div>

        {/* Right: Info Cards */}
        <div className="contact-sidebar-info">
          <div className="contact-info-card">
            <h4>Office Location & Hours</h4>
            <div className="info-row">
              <MapPin size={18} className="info-icon" />
              <div>
                <strong>SSLG Secretariat Office</strong>
                <p>Beside the track & soccer field, Gubat National High School, Gubat, Sorsogon, Philippines</p>
              </div>
            </div>

            <div className="info-row">
              <Clock size={18} className="info-icon" />
              <div>
                <strong>Consultation Hours</strong>
                <p>Mon - Fri: 8:00 AM - 5:00 PM</p>
              </div>
            </div>

            <div className="info-row">
              <Mail size={18} className="info-icon" />
              <div>
                <strong>Official Email</strong>
                <p>sslg.gubatnhs@gmail.com</p>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="contact-faq-card">
            <h4>Frequently Asked Questions</h4>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <strong><HelpCircle size={15} /> {faq.q}</strong>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
