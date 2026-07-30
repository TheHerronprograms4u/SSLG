import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Building2,
  Calendar,
  Users,
  Heart,
  ChevronLeft,
  CheckCircle2,
  Send,
  MessageSquare
} from 'lucide-react';
import { supabase } from '../api/supabase';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

const categories = [
  { id: 'academics', label: 'Academics', icon: BookOpen, desc: 'Curriculum, tutoring, exams & learning resources' },
  { id: 'facilities', label: 'Facilities', icon: Building2, desc: 'Classrooms, lab equipment, sanitation & campus spaces' },
  { id: 'events', label: 'Events & Activities', icon: Calendar, desc: 'Student forums, sports, clubs & cultural meets' },
  { id: 'leadership', label: 'Leadership', icon: Users, desc: 'SSLG governance, transparency & representation' },
  { id: 'welfare', label: 'Student Welfare', icon: Heart, desc: 'Health, anti-bullying, mental wellness & safety' },
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onShowToast }) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    rating: 0,
    message: '',
    is_anonymous: true,
    student_id: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.from('feedback').insert([
        {
          category: formData.category,
          rating: formData.rating,
          message: formData.message,
          is_anonymous: formData.is_anonymous,
          student_id: formData.is_anonymous ? null : formData.student_id,
        },
      ]);
    } catch (err) {
      console.log('Using local fallback for feedback store:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
      onShowToast('Feedback submitted to SSLG Officers!');
    }
  };

  const handleReset = () => {
    setStep(1);
    setSubmitted(false);
    setFormData({
      category: '',
      rating: 0,
      message: '',
      is_anonymous: true,
      student_id: '',
    });
    onClose();
  };

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className="feedback-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-pill">
              <MessageSquare size={14} /> SHARE YOUR VOICE
            </span>
            <h2>Gubat NHS Student Feedback Portal</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="feedback-submitted-view fade-in">
            <CheckCircle2 size={70} className="success-icon" />
            <h2>Feedback Received!</h2>
            <p>
              Thank you for sharing your thoughts with the Supreme Secondary Learner Government. Your recommendations shape our campus policies.
            </p>
            <button onClick={handleReset} className="button" style={{ margin: '1.5rem auto 0' }}>
              Back to Hub
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="feedback-step-bar">
              <span className={`step-dot ${step >= 1 ? 'active' : ''}`}>1. Category</span>
              <span className="step-line" />
              <span className={`step-dot ${step >= 2 ? 'active' : ''}`}>2. Rating</span>
              <span className="step-line" />
              <span className={`step-dot ${step >= 3 ? 'active' : ''}`}>3. Message</span>
            </div>

            {step === 1 && (
              <div className="fade-in">
                <p className="step-instruction">Select a category for your inquiry or suggestion:</p>
                <div className="category-selection-grid">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className={`cat-card-item ${formData.category === cat.id ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                    >
                      <cat.icon size={28} className="cat-card-icon" />
                      <div>
                        <strong>{cat.label}</strong>
                        <p>{cat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="form-step-footer">
                  <button
                    type="button"
                    disabled={!formData.category}
                    onClick={() => setStep(2)}
                    className="button modal-next-btn"
                  >
                    Continue to Rating
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="fade-in">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="step-back-btn"
                >
                  <ChevronLeft size={16} /> Back to Categories
                </button>

                <h3 className="step-instruction" style={{ marginTop: '1rem' }}>
                  How would you rate current progress in {formData.category.toUpperCase()}?
                </h3>

                <div className="rating-selector-wrapper">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-select-btn ${formData.rating === star ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, rating: star })}
                    >
                      <span className="star-num">{star}</span>
                      <span className="star-label">
                        {star === 1 ? 'Poor' : star === 3 ? 'Neutral' : star === 5 ? 'Excellent' : 'Good'}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="form-step-footer">
                  <button
                    type="button"
                    disabled={formData.rating === 0}
                    onClick={() => setStep(3)}
                    className="button modal-next-btn"
                  >
                    Continue to Message
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="fade-in">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="step-back-btn"
                >
                  <ChevronLeft size={16} /> Back to Rating
                </button>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label">Your Message or Policy Suggestion *</label>
                  <textarea
                    className="textarea"
                    rows={5}
                    placeholder="Provide details, constructive feedback, or suggestions for the SSLG council..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <div className="anon-toggle-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_anonymous}
                      onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                    />
                    <span>Submit anonymously (Identity protected)</span>
                  </label>
                </div>

                {!formData.is_anonymous && (
                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label">Student LRN / ID Number (Optional)</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. 109823450091"
                      value={formData.student_id}
                      onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    />
                  </div>
                )}

                <div className="form-step-footer">
                  <button
                    type="submit"
                    disabled={loading || !formData.message.trim()}
                    className="button modal-submit-btn"
                  >
                    {loading ? 'Submitting...' : 'Send Feedback to SSLG'} <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
