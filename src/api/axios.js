// src/api/API.ts
import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: { Accept: 'application/json' },
    timeout: 20000,
});

export default API;
