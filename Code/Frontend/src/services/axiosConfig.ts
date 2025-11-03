
import axios from 'axios';

// Cliente para FastAPI (backend principal)
export const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cliente para Spring Boot (autenticación)
export const authClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a todas las peticiones de FastAPI
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('mock_user');
      localStorage.removeItem('mock_profile');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Interceptor para Spring Boot (auth)
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Auth error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);