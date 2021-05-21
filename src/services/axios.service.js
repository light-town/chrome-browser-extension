import axios from "axios";

const API_URL = "http://127.0.0.1:8080/v1/api";

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use((config) => {
  return config;
});

export default instance;
