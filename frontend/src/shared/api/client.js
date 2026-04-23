import axios, { AxiosInstance } from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});
// Response interceptor for error handling
apiClient.interceptors.response.use((response) => response, (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
});
export default apiClient;
//# sourceMappingURL=client.js.map