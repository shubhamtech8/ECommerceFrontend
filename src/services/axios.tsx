import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7135",
  headers: {
    "Content-Type": "application/json",
  },
});

const api2 = axios.create({
  baseURL: "https://localhost:7135",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token from localStorage for api2 instance (Product API)
api2.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
export { api2 };
