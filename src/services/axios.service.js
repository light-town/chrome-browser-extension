import axios from "axios";

const axios = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

axios.interceptors.request.use((config) => {
  console.log(config);
  return config;
});

export default axios;
