import React, { useState, useEffect } from "react";
import { supabase } from "../api/supabase";
import { dbGetFeedback, dbDeleteFeedback } from "../api/db";
import {
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Clock,
  X,
  ArrowLeft,
  Key,
  Search,
  Trash2,
  Quote,
  Star,
  BookOpen,
  Building2,
  Calendar,
  Users,
  Heart,
  Sparkles
} from "lucide-react";

export const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);

  // Search & Filter States (Send-The-Song Style)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRating, setSelectedRating] = useState<number | "all">("all");

  useEffect(() => {
    const checkSession = async () => {
      const isLocalAuth = localStorage.getItem("sslg_admin_auth") === "true";
      const {
        data: { session },
      } = await supabase.auth.getSession();
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
      if (password === "sslg2026" || password === "admin" || password === "sslgadmin") {
        localStorage.setItem("sslg_admin_auth", "true");
        setIsLoggedIn(true);
        fetchDashboardData();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: "sslg.gubatnhs@gmail.com",
          password,
        });

        if (error) throw new Error("Invalid administrator passcode.");
        localStorage.setItem("sslg_admin_auth", "true");
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
      const categories = ["academics", "facilities", "events", "leadership", "welfare"];
      const categoryDistribution = categories.map((cat) => {
        const catFeedback =
          feedbackData?.filter(
            (f: any) => f.category?.toLowerCase() === cat.toLowerCase()
          ) || [];
        const count = catFeedback.length;
        const avg_rating =
          count > 0
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
    localStorage.removeItem("sslg_admin_auth");
    setIsLoggedIn(false);
    setStats(null);
    setResponses([]);
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this feedback entry?")) {
      await dbDeleteFeedback(id);
      setSelectedFeedback(null);
      fetchDashboardData();
    }
  };

  // Category Icon helper
  const getCategoryIcon = (categoryStr?: string) => {
    const cat = (categoryStr || "").toLowerCase();
    if (cat.includes("academic")) return <BookOpen size={14} />;
    if (cat.includes("facility")) return <Building2 size={14} />;
    if (cat.includes("event")) return <Calendar size={14} />;
    if (cat.includes("leadership")) return <Users size={14} />;
    if (cat.includes("welfare")) return <Heart size={14} />;
    return <Sparkles size={14} />;
  };

  // Filtered responses for Send-The-Song Grid View
  const filteredResponses = responses.filter((item) => {
    // Category match
    if (
      selectedCategory !== "all" &&
      (item.category || "").toLowerCase() !== selectedCategory.toLowerCase()
    ) {
      return false;
    }
    // Rating match
    if (selectedRating !== "all" && Number(item.rating) !== Number(selectedRating)) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const msg = (item.message || "").toLowerCase();
      const cat = (item.category || "").toLowerCase();
      const sid = (item.student_id || "").toLowerCase();
      return msg.includes(q) || cat.includes(q) || sid.includes(q);
    }
    return true;
  });

  if (!isLoggedIn) {
    return (
      <div className="container fade-in" style={{ padding: "4rem 1rem" }}>
        <div
          className="card"
          style={{
            maxWidth: "420px",
            margin: "0 auto",
            padding: "2.5rem",
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(90, 10, 58, 0.25)",
            border: "1px solid #fce4ec",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                background: "#fce4ec",
                color: "var(--accent-primary)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <Key size={26} />
            </div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--text-primary)", fontWeight: 800 }}>
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
                  color: "var(--text-primary)",
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
            <a
              href="/"
              style={{
                color: "var(--accent-primary)",
                fontSize: "0.85rem",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              ← Return to Main Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ maxWidth: "1140px", padding: "2rem 1rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <LayoutDashboard color="white" size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.6rem", color: "white", fontWeight: 800 }}>
              SSLG Feedback Wall & Dashboard
            </h1>
            <p style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.9)" }}>
              Send-The-Song style feedback explorer for Gubat NHS students
            </p>
          </div>
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
              fontSize: "0.88rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 600,
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
              fontSize: "0.88rem",
              fontWeight: 600,
            }}
          >
            <LogOut size={16} /> Logout Admin
          </button>
        </div>
      </div>

      {/* Category Stats Overview */}
      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2.5rem",
          }}
        >
          <div
            className="card"
            style={{
              padding: "1.25rem",
              background: "linear-gradient(135deg, #ffffff 0%, #fff0f5 100%)",
              border: "1px solid #fbcfe8",
            }}
          >
            <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.25rem" }}>
              TOTAL FEEDBACKS
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--accent-primary)" }}>
              {stats.totalResponses}
            </div>
          </div>
          {stats.categoryDistribution.map((item: any) => (
            <div
              key={item.category}
              className="card"
              style={{
                padding: "1.25rem",
                background: "#ffffff",
                border: "1px solid #fce4ec",
                cursor: "pointer",
              }}
              onClick={() => setSelectedCategory(item.category)}
            >
              <div
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  marginBottom: "0.4rem",
                  textTransform: "capitalize",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {getCategoryIcon(item.category)} {item.category}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-primary)" }}>
                  {item.count}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#d97706", fontWeight: 800 }}>
                  ★ {item.avg_rating > 0 ? item.avg_rating.toFixed(1) : "N/A"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Send-The-Song Search & Filter Bar */}
      <div
        className="card"
        style={{
          padding: "1.25rem 1.5rem",
          marginBottom: "2rem",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(90, 10, 58, 0.15)",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1rem" }}>
          {/* Search Input */}
          <div style={{ position: "relative", flex: 1, minWidth: "240px" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              className="input"
              placeholder="Search feedback text, student ID, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "42px", height: "44px" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Rating Filter Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)" }}>Rating:</span>
            <select
              value={selectedRating}
              onChange={(e) =>
                setSelectedRating(e.target.value === "all" ? "all" : Number(e.target.value))
              }
              className="input"
              style={{ width: "130px", height: "44px", cursor: "pointer" }}
            >
              <option value="all">All Stars</option>
              <option value="5">5 Stars (★ 5)</option>
              <option value="4">4 Stars (★ 4)</option>
              <option value="3">3 Stars (★ 3)</option>
              <option value="2">2 Stars (★ 2)</option>
              <option value="1">1 Star (★ 1)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", marginRight: "4px" }}>
            Category:
          </span>
          {["all", "academics", "facilities", "events", "leadership", "welfare"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                border: selectedCategory === cat ? "none" : "1px solid #fbcfe8",
                background: selectedCategory === cat ? "var(--accent-primary)" : "#fff0f5",
                color: selectedCategory === cat ? "#ffffff" : "var(--text-primary)",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {cat !== "all" && getCategoryIcon(cat)}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Title & Count */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h2 style={{ color: "white", fontSize: "1.25rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
          <MessageCircle size={20} color="white" /> Student Feedback Wall ({filteredResponses.length})
        </h2>
        <span style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.85rem" }}>
          Click any card to open and read full message
        </span>
      </div>

      {/* Send-The-Song Aesthetic Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
          gap: "1.25rem",
          marginBottom: "3rem",
        }}
      >
        {filteredResponses.map((res) => (
          <div
            key={res.id}
            className="card"
            style={{
              padding: "1.5rem",
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              background: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #fce4ec",
              boxShadow: "0 10px 25px rgba(90, 10, 58, 0.08)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            onClick={() => setSelectedFeedback(res)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 20px 35px rgba(216, 27, 96, 0.2)";
              e.currentTarget.style.borderColor = "#f87171";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(90, 10, 58, 0.08)";
              e.currentTarget.style.borderColor = "#fce4ec";
            }}
          >
            <div>
              {/* Card Top Pill & Rating */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    backgroundColor: "#fce4ec",
                    color: "var(--accent-primary)",
                    textTransform: "capitalize",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {getCategoryIcon(res.category)}
                  {res.category || "General"}
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: "2px", color: "#f59e0b", fontWeight: 800, fontSize: "0.85rem" }}>
                  <Star size={14} fill="#f59e0b" stroke="none" />
                  <span>{res.rating || 5}</span>
                </div>
              </div>

              {/* Send-The-Song Quote Card Body */}
              <div style={{ position: "relative", marginBottom: "1.25rem" }}>
                <Quote size={24} style={{ color: "#fbcfe8", marginBottom: "4px" }} />
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--text-primary)",
                    lineHeight: "1.5",
                    fontWeight: 500,
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    fontStyle: "italic",
                  }}
                >
                  "{res.message || "No text provided with rating."}"
                </p>
              </div>
            </div>

            {/* Footer metadata */}
            <div
              style={{
                borderTop: "1px solid #fce4ec",
                paddingTop: "0.85rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.78rem",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ fontWeight: 700, color: "var(--text-secondary)" }}>
                {res.is_anonymous ? "👤 Anonymous" : `🆔 ${res.student_id || "Student"}`}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={12} />
                {new Date(res.created_at || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResponses.length === 0 && (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "#ffffff",
            borderRadius: "20px",
            color: "var(--text-secondary)",
          }}
        >
          <MessageCircle size={48} style={{ color: "var(--accent-primary)", marginBottom: "1rem", opacity: 0.5 }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>No feedback matching filters</h3>
          <p style={{ fontSize: "0.9rem" }}>Try clearing search keywords or selecting a different category.</p>
        </div>
      )}

      {/* Send-The-Song Style Expanded Modal Overlay */}
      {selectedFeedback && (
        <div
          className="modal-overlay fade-in"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(90, 10, 58, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "1rem",
            backdropFilter: "blur(6px)",
          }}
          onClick={() => setSelectedFeedback(null)}
        >
          <div
            className="card fade-in"
            style={{
              width: "100%",
              maxWidth: "620px",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              padding: "2.5rem",
              background: "#ffffff",
              borderRadius: "24px",
              boxShadow: "0 25px 50px rgba(90, 10, 58, 0.35)",
              border: "1px solid #fce4ec",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedFeedback(null)}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "#fce4ec",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--accent-primary)",
              }}
            >
              <X size={20} />
            </button>

            {/* Header info */}
            <div style={{ marginBottom: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                <span
                  style={{
                    padding: "6px 16px",
                    borderRadius: "9999px",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    backgroundColor: "#fce4ec",
                    color: "var(--accent-primary)",
                    textTransform: "capitalize",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {getCategoryIcon(selectedFeedback.category)}
                  {selectedFeedback.category || "General"}
                </span>

                <div
                  style={{
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    backgroundColor: "#fffbeb",
                    color: "#b45309",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Star size={14} fill="#f59e0b" stroke="none" />
                  <span>Rating: {selectedFeedback.rating || 5} / 5</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Clock size={15} />
                  {new Date(selectedFeedback.created_at || Date.now()).toLocaleString()}
                </div>
                <div>•</div>
                <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                  {selectedFeedback.is_anonymous
                    ? "Anonymous Student Submission"
                    : `Student ID: ${selectedFeedback.student_id || "Not specified"}`}
                </div>
              </div>
            </div>

            {/* Send-The-Song Quote Container */}
            <div
              style={{
                padding: "2rem",
                backgroundColor: "#fff5f8",
                borderRadius: "18px",
                border: "1px solid #fbcfe8",
                marginBottom: "2rem",
                position: "relative",
              }}
            >
              <Quote size={32} style={{ color: "#f472b6", opacity: 0.6, marginBottom: "0.5rem" }} />
              <p
                style={{
                  color: "var(--text-primary)",
                  fontSize: "1.15rem",
                  lineHeight: "1.7",
                  whiteSpace: "pre-wrap",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  fontStyle: "italic",
                }}
              >
                "{selectedFeedback.message || "No text description attached."}"
              </p>
            </div>

            {/* Modal Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid #fce4ec",
                paddingTop: "1.5rem",
              }}
            >
              <button
                onClick={(e) => handleDelete(selectedFeedback.id, e)}
                className="button"
                style={{
                  background: "#ef4444",
                  padding: "10px 18px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                }}
              >
                <Trash2 size={16} /> Delete Feedback Entry
              </button>

              <button
                onClick={() => setSelectedFeedback(null)}
                className="button"
                style={{
                  background: "var(--accent-primary)",
                  padding: "10px 24px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                }}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
