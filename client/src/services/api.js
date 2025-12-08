import axios from "axios";

const API_BASE = "http://localhost:5001/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getMe: () => api.get("/auth/me"),
};

// User API calls
export const userAPI = {
  getInventory: () => api.get("/user/inventory"),
  addItem: (itemData) => api.post("/user/inventory/item", itemData),
  updateCoins: (amount) => api.put("/user/inventory/coins", { amount }),
  getPets: () => api.get("/user/pets"),
  getPet: (petId) => api.get(`/user/pets/${petId}`),
  createPet: (petData) => api.post("/user/pets", petData),
  updatePet: (petId, updates) => api.put(`/user/pets/${petId}`, updates),
  playWithPet: (petId) => api.post(`/user/pets/${petId}/play`),
  feedPet: (petId, itemId) => api.post(`/user/pets/${petId}/feed`, { itemId }),
};

// Tasks API calls
export const tasksAPI = {
  getTasks: () => api.get("/tasks"),
  createTask: (taskData) => api.post("/tasks", taskData),
  updateTask: (taskId, updates) => api.put(`/tasks/${taskId}`, updates),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
};

export default api;