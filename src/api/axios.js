// src/api/API.ts
import axios from 'axios';

const baseURL =
  import.meta.env.PROD
    ? import.meta.env.VITE_API_BASE_URL
    : "/api"; 

const API = axios.create({
    baseURL,
    withCredentials: true,
    headers: { Accept: 'application/json' },
    timeout: 20000,
});

export default API;
