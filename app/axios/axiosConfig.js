// src/axiosConfig.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'https://medical-api-advo.onrender.com', // Ensure this URL is correct
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true, // Ensure cookies are sent with requests
    
});

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
    response => response,
    async error => {
        const { status, config } = error.response || {};

        if (status === 401 && !config.__isRetryRequest) {
            try {
                // Use correct base URL for token refresh endpoint
                const refreshResponse = await axios.post('https://medical-api-advo.onrender.com/api/hospital/refresh-token', {}, {
                    withCredentials: true
                });
                const { accessToken } = refreshResponse.data;

                // Store and set the new access token
                localStorage.setItem('accessToken', accessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                // Retry the original request
                config.__isRetryRequest = true;
                config.headers['Authorization'] = `Bearer ${accessToken}`;
                return api(config);
            } catch (refreshError) {
                // Handle refresh token error and redirect to login
                localStorage.removeItem('accessToken');
                window.location.href = '/login'; // Redirect to login page
            }
        }
        return Promise.reject(error);
    }
);

export default api;
