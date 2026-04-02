import axios from "axios";

// In production on Vercel, client and API are on the same domain.
// Using a relative URL avoids CORS issues.
const API_URL = import.meta.env.PROD ? "" : (import.meta.env.VITE_URL || "http://localhost:5000");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
