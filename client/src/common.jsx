import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

axios.interceptors.request.use(
  (config) => {
    const configUrl = config.url;
    config.headers["Authorization"] =
      `Bearer ${localStorage.getItem("access_token")}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axios;
