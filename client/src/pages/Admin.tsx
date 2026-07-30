import React, { useState, useEffect } from "react";
import { supabase } from "../api/supabase";
import { dbGetFeedback } from "../api/db";
import { LayoutDashboard, LogOut, MessageCircle, Clock, X, ArrowLeft, Key } from "lucide-react";

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const isLocalAuth = localStorage.getItem("sslg_admin_auth") === "true";
      const { data: { session } } = await supabase.auth.getSession();
      if (session || isLocalAuth) {
        setIsLoggedIn(true);
        fetchDashboardData();
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (password === 'sslg2026' || password === 'admin' || password === 'sslgadmin') {
        localStorage.setItem('sslg_admin_auth', 'true');
        setIsLoggedIn(true);
        fetchDashboardData();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: 'sslg.gubatnhs@gmail.com',
          password,
        });

        if (error) throw new Error("Invalid administrator passcode.");
        localStorage.setItem('sslg_admin_auth', 'true');
        setIsLoggedIn(true);
        fetchDashboardData();
      }
    } catch (error: any) {
      alert(error.message || "Invalid administrator passcode");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const feedbackData = await dbGetFeedback();
      setResponses(feedbackData || []);

      // Calculate Stats
      const categories = ['academics', 'facilities', 'events', 'leadership', 'welfare'];
      const categoryDistribution = categories.map(cat => {
        const catFeedback = feedbackData?.filter((f: any) => 
          f.category?.toLowerCase() === cat.toLowerCase()
        ) || [];
        const count = catFeedback.length;
        const avg_rating = count > 0 
          ? catFeedback.reduce((sum: number, f: any) => sum + (Number(f.rating) || 0), 0) / count 
          : 0;
        
        return { category: cat, count, avg_rating };
      });

      setStats({
        totalResponses: feedbackData?.length || 0,
        categoryDistribution,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    localStorage.removeItem('sslg_admin_auth');
    setIsLoggedIn(false);
    setStats(null);
    setResponses([]);
  };

  if (!isLoggedIn) {
    return (
      <div className="container fade-in" style={{ padding: "4rem 1rem" }}>
        <div className="card" style={{ maxWidth: "420px", margin: "0 auto", padding: "2.5rem", background: "#ffffff", borderRadius: "20px", boxShadow: "0 20px 40px rgba(90, 10, 58, 0.25)" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#fce4ec", color: "var(--accent-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <Key size={26} />
            </div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              Admin Feedback Access
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Enter official SSLG administrator passcode to view student feedback.
            </p>
          </div>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  color: "var(--text-primary)"
                }}
              >
                Passcode / Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                placeholder="Enter passcode (e.g. sslg2026)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="button"
              style={{ width: "100%", justifyContent: "center", padding: "12px", fontWeight: 700 }}
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Access Feedback Dashboard"}
            </button>
          </form>
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <a href="/" style={{ color: "var(--accent-primary)", fontSize: "0.85rem", textDecoration: "none", fontWeight: 600 }}>
              ← Return to Main Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container fade-in"
      style={{ maxWidth: "1000px", padding: "2rem 1rem" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "3rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <LayoutDashboard color="white" />
          <h1 style={{ fontSize: "1.5rem", color: "white" }}>SSLG Feedback Dashboard</h1>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <a
            href="/"
            className="button"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              color: "white",
              textDecoration: "none",
              padding: "8px 16px",
              fontSize: "0.9rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <ArrowLeft size={16} /> Home Website
          </a>
          <button
            onClick={handleLogout}
            className="button"
            style={{
              background: "#ef4444",
              padding: "8px 16px",
              fontSize: "0.9rem",
            }}
          >
            <LogOut size={16} /> Logout Admin
          </button>
        </div>
      </div>

      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          <div className="card" style={{ padding: "1.5rem" }}>
            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
              }}
            >
              Total Responses
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-primary)" }}>
              {stats.totalResponses}
            </div>
          </div>
          {stats.categoryDistribution.map((item: any) => (
            <div
              key={item.category}
              className="card"
              style={{ padding: "1.5rem" }}
            >
              <div
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                  textTransform: "capitalize",
                }}
              >
                {item.category}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent-primary)" }}>
                  {item.count}
                </div>
                <div
                  style={{ fontSize: "0.8rem", color: "var(--accent-primary)", fontWeight: 700 }}
                >
                  ★ {item.avg_rating.toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "white"
        }}
      >
        <MessageCircle size={24} color="white" /> Recent Feedback
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {responses.map((res) => (
          <div 
            key={res.id} 
            className="card" 
            style={{ padding: "1.5rem", cursor: "pointer", transition: "transform 0.2s ease" }}
            onClick={() => setSelectedFeedback(res)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  backgroundColor: "rgba(99, 102, 241, 0.1)",
                  color: "var(--accent-color)",
                  textTransform: "capitalize",
                }}
              >
                {res.category}
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "var(--text-secondary)",
                  fontSize: "0.8rem",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Clock size={14} />{" "}
                  {new Date(res.created_at).toLocaleDateString()}
                </div>
                <div style={{ color: "var(--accent-primary)", fontWeight: 700 }}>★ {res.rating}</div>
              </div>
            </div>
            <p style={{ marginBottom: "1rem", color: "var(--text-primary)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {res.message || (
                <em style={{ color: "var(--text-secondary)" }}>
                  No message provided.
                </em>
              )}
            </p>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              {res.is_anonymous
                ? "Anonymous"
                : `Student ID: ${res.student_id || "Not provided"}`}
            </div>
          </div>
        ))}
        {responses.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "var(--text-secondary)",
            }}
          >
            No feedback received yet.
          </div>
        )}
      </div>

      {/* Enlarged Feedback Modal */}
      {selectedFeedback && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
            backdropFilter: "blur(4px)"
          }}
          onClick={() => setSelectedFeedback(null)}
        >
          <div 
            className="card" 
            style={{ 
              width: "100%", 
              maxWidth: "600px", 
              maxHeight: "90vh", 
              overflowY: "auto", 
              position: "relative",
              padding: "2.5rem"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedFeedback(null)}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)"
              }}
            >
              <X size={24} />
            </button>

            <div style={{ marginBottom: "2rem" }}>
              <span
                style={{
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  backgroundColor: "rgba(216, 27, 96, 0.1)",
                  color: "var(--accent-color)",
                  textTransform: "capitalize",
                  display: "inline-block",
                  marginBottom: "1rem"
                }}
              >
                {selectedFeedback.category}
              </span>
              
              <div style={{ display: "flex", alignItems: "center", gap: "20px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Clock size={16} />
                  {new Date(selectedFeedback.created_at).toLocaleString()}
                </div>
                <div style={{ color: "var(--gold-color)", fontWeight: 700, fontSize: "1.1rem" }}>
                  Rating: {selectedFeedback.rating} / 5
                </div>
              </div>
            </div>

            <div style={{ 
              padding: "1.5rem", 
              backgroundColor: "var(--bg-color)", 
              borderRadius: "12px", 
              marginBottom: "2rem",
              color: "white",
              fontSize: "1.1rem",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap"
            }}>
              {selectedFeedback.message || "No message provided."}
            </div>

            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              borderTop: "1px solid var(--border-color)",
              paddingTop: "1.5rem"
            }}>
              <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 600 }}>
                {selectedFeedback.is_anonymous
                  ? "Anonymous Submission"
                  : `Student ID: ${selectedFeedback.student_id || "Not provided"}`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
