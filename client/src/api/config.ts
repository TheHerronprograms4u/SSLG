import axios from "axios";

// In production (Vercel), we use a relative URL to ensure requests are routed to our server functions.
// This prevents CORS issues and ensures we don't accidentally hit the Supabase URL.
const API_URL = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? (import.meta.env.VITE_URL || "http://localhost:5000")
  : "";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
