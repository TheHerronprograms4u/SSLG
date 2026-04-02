import React, { useState, useEffect } from "react";
import { supabase } from "../api/supabase";
import { LayoutDashboard, LogOut, MessageCircle, Clock } from "lucide-react";

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      setIsLoggedIn(true);
      fetchDashboardData();
    } catch (error: any) {
      alert(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch Responses
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (feedbackError) throw feedbackError;
      
      setResponses(feedbackData || []);

      // Calculate Stats
      const categories = ['academics', 'facilities', 'events', 'leadership', 'welfare'];
      const categoryDistribution = categories.map(cat => {
        const catFeedback = feedbackData?.filter(f => f.category === cat) || [];
        const count = catFeedback.length;
        const avg_rating = count > 0 
          ? catFeedback.reduce((sum, f) => sum + f.rating, 0) / count 
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
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setStats(null);
    setResponses([]);
  };

  if (!isLoggedIn) {
    return (
      <div className="container fade-in">
        <div className="card" style={{ maxWidth: "400px", margin: "0 auto" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            Admin Access
          </h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="button"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
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
          <LayoutDashboard color="var(--accent-color)" />
          <h1 style={{ fontSize: "1.5rem" }}>SSLG Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className="button"
          style={{
            background: "#ef4444",
            padding: "8px 16px",
            fontSize: "0.9rem",
          }}
        >
          <LogOut size={16} /> Logout
        </button>
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
            <div style={{ fontSize: "2rem", fontWeight: 800 }}>
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
                <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                  {item.count}
                </div>
                <div
                  style={{ fontSize: "0.8rem", color: "var(--accent-color)" }}
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
        }}
      >
        <MessageCircle size={24} /> Recent Feedback
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {responses.map((res) => (
          <div key={res.id} className="card" style={{ padding: "1.5rem" }}>
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
                <div>★ {res.rating}</div>
              </div>
            </div>
            <p style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
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
    </div>
  );
};

export default Admin;
