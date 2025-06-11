import axios from 'axios'
import {getToken, removeToken, saveToken} from './auth'

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
})

let isRedirecting = false;

// Before each request, if a token exists, add it to headers
api.interceptors.request.use(config => {
    const token = getToken()
    if (token && token !== 'undefined' && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`
    }

    if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json'
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

api.interceptors.response.use(
    (response) => {
        // Check for new token in response headers (token refresh)
        const newToken = response.headers['x-new-token']
        if (newToken) {
            saveToken(newToken)
            console.log('Token refreshed automatically')
        }
        return response
    },
    (error) => {
        console.error('API Error:', error.response?.status, error.response?.data);

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !isRedirecting) {
            console.log('Token invalid or expired, redirecting to auth...');
            isRedirecting = true;

            // Clear invalid token
            removeToken();

            // Stop activity tracking if it's running
            if (window.activityTracker) {
                window.activityTracker.stopTracking();
            }

            // Force redirect to auth page
            window.location.replace('/auth');

            // Reset redirect flag after delay
            setTimeout(() => {
                isRedirecting = false;
            }, 1000);

            return Promise.reject(new Error('Authentication required'));
        }

        return Promise.reject(error)
    }
)

export default api