import axios from 'axios';

const API_BASE_URL = 'http://localhost:9000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for better error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Enhanced error handling
        if (error.code === 'ECONNABORTED') {
            error.message = 'Request timeout. The server is taking too long to respond.';
        } else if (error.code === 'ERR_NETWORK' || !error.response) {
            error.message = 'Cannot connect to server. Please make sure the backend is running on http://localhost:9000';
            error.isConnectionError = true;
        } else if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            if (status === 401) {
                error.message = 'Invalid credentials. Please check your email and password.';
            } else if (status === 403) {
                error.message = 'Access denied. You do not have permission to perform this action.';
            } else if (status === 404) {
                error.message = 'Resource not found.';
            } else if (status >= 500) {
                error.message = 'Server error. Please try again later.';
            } else {
                // Use backend error message if available
                if (typeof error.response.data === 'string') {
                    error.message = error.response.data;
                } else if (error.response.data?.message) {
                    error.message = error.response.data.message;
                } else {
                    error.message = 'An error occurred. Please try again.';
                }
            }
        }
        return Promise.reject(error);
    }
);

// Health check function
export const checkBackendHealth = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/stores/active`, { timeout: 5000 });
        return { isHealthy: true, data: response.data };
    } catch (error) {
        return { 
            isHealthy: false, 
            error: error.message || 'Backend is not reachable',
            isConnectionError: !error.response
        };
    }
};

export default api;
