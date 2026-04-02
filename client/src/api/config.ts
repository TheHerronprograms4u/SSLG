import axios from "axios";

const API_URL = import.meta.env.VITE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    apikey: import.meta.env.VITE_API_KEY,
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export default api;
