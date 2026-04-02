import React, { useState, useEffect } from "react";
import api from "../api/config";
import { LayoutDashboard, LogOut, MessageCircle, Clock } from "lucide-react";

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsLoggedIn(true);
      fetchDashboardData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get("/rest/v1/admins", {
        params: {
          username: `eq.${username}`,
          password_hash: `eq.${password}`,
          select: "*",
        },
      });

      if (res.data.length === 0) {
        alert("Invalid credentials");
        return;
      }

      localStorage.setItem("adminToken", username);
      setIsLoggedIn(true);
      fetchDashboardData();
    } catch (error) {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const responsesRes = await api.get("/rest/v1/feedback");
      const data = responsesRes.data;
      setResponses(data);

      const categoryMap: Record<
        string,
        { count: number; total_rating: number }
      > = {};
      data.forEach((item: any) => {
        if (!categoryMap[item.category]) {
          categoryMap[item.category] = { count: 0, total_rating: 0 };
        }
        categoryMap[item.category].count++;
        categoryMap[item.category].total_rating += item.rating || 0;
      });

      const categoryDistribution = Object.entries(categoryMap).map(
        ([category, val]) => ({
          category,
          count: val.count,
          avg_rating: val.count > 0 ? val.total_rating / val.count : 0,
        }),
      );

      setStats({
        totalResponses: data.length,
        categoryDistribution,
      });
    } catch (error) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
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
                htmlFor="username"
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                }}
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autocomplete="username"
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
                autocomplete="current-password"
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
