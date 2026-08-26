import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/',
});

api.interceptors.request.use((config) => {
    // If payload is FormData, do not set application/json; let the browser set multipart/form-data with boundary
    if (config.data instanceof FormData) {
        if (config.headers) {
            delete config.headers['Content-Type'];
        }
    } else if (config.headers && !config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
});

export default api;
