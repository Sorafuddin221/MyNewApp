import axios from 'axios';
import { toast } from 'react-toastify';

// Create a new axios instance
const api = axios.create({
    baseURL: '/', // Your base URL if you have one, otherwise defaults to current domain
});

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response;
    },
    (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        if (error.response && error.response.status === 401) {
            // Specifically check for the session expired message from our middleware
            if (error.response.data.message === 'Session expired. Please log in again.') {
                toast.error('Session expired. Please log in again.');
                
                // We can't easily access redux store or next/router here.
                // A hard redirect is the simplest and most effective way to handle this globally.
                // This will clear all state and force the user to re-authenticate.
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }
        }
        
        // Return the error so that the original caller can handle it if needed
        return Promise.reject(error);
    }
);

export default api;
