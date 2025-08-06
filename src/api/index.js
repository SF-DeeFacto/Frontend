import axios from "axios";

// 공통으로 사용하는
const apiClient = axios.create({
  baseURL: process.env.VITE_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
