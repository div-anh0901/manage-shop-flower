import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT),
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request interceptor
// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Response interceptor
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // handle unauthorized access, e.g., redirect to login
//       console.log('Unauthorized, redirecting to login...');
//     }
//     return Promise.reject(error);
//   }
// );

export default API;
