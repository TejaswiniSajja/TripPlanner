import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://trip-planner-backend-6jzm.onrender.com/";

const api = axios.create({ baseURL: API_BASE });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth ────────────────────────────────────────────
export const register = (data) => api.post("/register", data);
export const login = (data) => api.post("/login", data);
export const getMe = () => api.get("/me");

// ── Trips ───────────────────────────────────────────
export const createTrip = (data) => api.post("/trip", data);
export const getTrips = () => api.get("/trips");
export const getTrip = (id) => api.get(`/trip/${id}`);
export const updateTrip = (id, data) => api.put(`/trip/${id}`, data);
export const deleteTrip = (id) => api.delete(`/trip/${id}`);

export default api;
