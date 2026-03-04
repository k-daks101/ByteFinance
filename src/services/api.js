import axios from "axios";

// API Base URL - uses environment variable or defaults to localhost
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const TOKEN_KEY = "bytefinance_token"; // Use same token key as auth context

const normalizeEndpoint = (endpoint) => {
  const safeEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return safeEndpoint.startsWith("/api/") ? safeEndpoint : `/api${safeEndpoint}`;
};

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const clearStoredToken = () => localStorage.removeItem(TOKEN_KEY);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor: add Bearer token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: clear token on 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredToken();
    }
    return Promise.reject(error);
  }
);

// Helper to get backend base (for CSRF, if needed)
const getBackendBase = () => {
  const base =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
  return base.replace(/\/$/, "");
};

export const setupCSRF = async () => {
  try {
    await axios.get(`${getBackendBase()}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Failed to fetch CSRF cookie:", error);
  }
};

// Convenience API methods
export const api = {
  // GET
  get: async (endpoint, config = {}) => {
    try {
      const response = await apiClient.get(normalizeEndpoint(endpoint), config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // POST
  post: async (endpoint, data = {}, config = {}) => {
    try {
      const response = await apiClient.post(normalizeEndpoint(endpoint), data, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // PUT
  put: async (endpoint, data = {}, config = {}) => {
    try {
      const response = await apiClient.put(normalizeEndpoint(endpoint), data, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // DELETE
  delete: async (endpoint, config = {}) => {
    try {
      const response = await apiClient.delete(normalizeEndpoint(endpoint), config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // PATCH
  patch: async (endpoint, data = {}, config = {}) => {
    try {
      const response = await apiClient.patch(normalizeEndpoint(endpoint), data, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default apiClient;

