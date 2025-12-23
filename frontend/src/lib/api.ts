import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const response = await api.post("/auth/refresh", {
            refresh_token: refreshToken,
          });
          
          const { access_token, refresh_token } = response.data;
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

// API Functions
export const authApi = {
  register: (data: RegisterData) => api.post("/auth/register", data),
  login: (data: LoginData) => api.post("/auth/login", data),
  refresh: (refreshToken: string) => api.post("/auth/refresh", { refresh_token: refreshToken }),
};

export const hsCodeApi = {
  search: (query: string, limit = 10) => api.get(`/hs-codes/search?q=${query}&limit=${limit}`),
  get: (hsCode: string) => api.get(`/hs-codes/${hsCode}`),
  mapToCN: (hsCode: string) => api.post(`/hs-codes/map-to-cn?hs_code=${hsCode}`),
};

// Types
export interface RegisterData {
  email: string;
  phone: string;
  password: string;
  full_name: string;
  role?: string;
}

export interface LoginData {
  identifier: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  role: string;
  subscription_tier: string;
  created_at: string;
}

export interface HSCodeResult {
  hs_code: string;
  description: string;
  unit_of_measurement?: string;
  basic_duty_rate?: number;
  igst_rate?: number;
  is_restricted: boolean;
  chapter: string;
  relevance_score: number;
  is_cbam_relevant: boolean;
}
