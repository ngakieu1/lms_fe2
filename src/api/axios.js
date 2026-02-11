import axios from 'axios';

// 1. Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8080/aims_test/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
// 2. Request Interceptor: Attach Access Token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
// 3. Response Interceptor: Handle 401 Errors (Token Expired)
api.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            try{
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post('http://localhost:8080/aims_test/api/auth/refresh', { refreshToken: refreshToken, });
                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError){
                console.error('Session expired. Please login again.');
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
export default api;