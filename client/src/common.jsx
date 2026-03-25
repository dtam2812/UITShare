import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

axios.interceptors.request.use(
  (config) => {
    const configUrl = config.url;
    if (configUrl.includes("auth/admin")) {
      config.headers["Authorization"] =
        `Bearer ${localStorage.getItem("access_token")}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axios;
