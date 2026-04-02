import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/config";
import {
  BookOpen,
  Building2,
  Calendar,
  Users,
  Heart,
  ChevronLeft,
  CheckCircle2,
  Send,
} from "lucide-react";

const categories = [
  { id: "academics", label: "Academics", icon: BookOpen },
  { id: "facilities", label: "Facilities", icon: Building2 },
  { id: "events", label: "Events", icon: Calendar },
  { id: "leadership", label: "Leadership", icon: Users },
  { id: "welfare", label: "Welfare", icon: Heart },
];

const Feedback: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    rating: 0,
    message: "",
    is_anonymous: true,
    student_id: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/rest/v1/feedback", formData);
      setSubmitted(true);
    } catch (error) {
      console.log(error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container fade-in" style={{ textAlign: "center" }}>
        <CheckCircle2
          size={80}
          color="#22c55e"
          style={{ margin: "0 auto 2rem" }}
        />
        <h1 style={{ marginBottom: "1rem" }}>Message Received.</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          Thank you for sharing your thoughts. Your feedback helps us make a
          difference.
        </p>
        <button onClick={() => navigate("/")} className="button">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <button
        onClick={() => (step > 1 ? setStep(step - 1) : navigate("/"))}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "none",
          border: "none",
          color: "var(--text-secondary)",
          cursor: "pointer",
          marginBottom: "2rem",
          padding: 0,
        }}
      >
        <ChevronLeft size={20} /> Back
      </button>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="fade-in">
              <h2 style={{ marginBottom: "0.5rem" }}>Select a category</h2>
              <p
                style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}
              >
                What would you like to talk about?
              </p>
              <div className="category-grid">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`category-item ${formData.category === cat.id ? "active" : ""}`}
                    onClick={() =>
                      setFormData({ ...formData, category: cat.id })
                    }
                  >
                    <cat.icon size={24} />
                    <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                      {cat.label}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                disabled={!formData.category}
                onClick={() => setStep(2)}
                className="button"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  opacity: formData.category ? 1 : 0.5,
                }}
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <h2 style={{ marginBottom: "0.5rem" }}>How are we doing?</h2>
              <p
                style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}
              >
                Rate your experience in this category.
              </p>
              <div className="rating-scale">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div
                    key={num}
                    className={`rating-dot ${formData.rating === num ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, rating: num })}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <button
                type="button"
                disabled={formData.rating === 0}
                onClick={() => setStep(3)}
                className="button"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  opacity: formData.rating ? 1 : 0.5,
                }}
              >
                Next
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="fade-in">
              <h2 style={{ marginBottom: "0.5rem" }}>Leave a message</h2>
              <p
                style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}
              >
                Tell us more about your thoughts or suggestions.
              </p>
              <textarea
                className="textarea"
                rows={6}
                placeholder="Type your message here..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                style={{ marginBottom: "1.5rem", resize: "none" }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "2rem",
                }}
              >
                <input
                  type="checkbox"
                  id="anon"
                  checked={formData.is_anonymous}
                  onChange={(e) =>
                    setFormData({ ...formData, is_anonymous: e.target.checked })
                  }
                />
                <label
                  htmlFor="anon"
                  style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}
                >
                  Submit anonymously
                </label>
              </div>

              {!formData.is_anonymous && (
                <input
                  type="text"
                  className="input"
                  placeholder="Student ID (Optional)"
                  value={formData.student_id}
                  onChange={(e) =>
                    setFormData({ ...formData, student_id: e.target.value })
                  }
                  style={{ marginBottom: "2rem" }}
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className="button"
                style={{ width: "100%", justifyContent: "center" }}
              >
                {loading ? "Submitting..." : "Send Feedback"} <Send size={18} />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Feedback;
