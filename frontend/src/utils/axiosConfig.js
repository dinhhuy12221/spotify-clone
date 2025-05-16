import axios from 'axios';

const instance = axios.create({
  baseURL: `http://${window.location.hostname ?? 'localhost'}:8000/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gắn access_token nếu có
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Hàm gọi refresh token
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return false;

    const res = await axios.post('http://localhost:8000/api/token/refresh/', {
      refresh,
    });

    localStorage.setItem('access_token', res.data.access);
    return true;
  } catch (error) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    window.location.href = '/login';
    return false;
  }
};

// Interceptor xử lý lỗi 401
instance.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const success = await refreshToken();
      if (success) {
        originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
        return instance(originalRequest); // retry request cũ
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
