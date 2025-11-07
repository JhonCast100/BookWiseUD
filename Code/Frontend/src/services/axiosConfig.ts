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

// Interceptor para agregar token a FastAPI
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para agregar token también a Spring Boot
authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Manejo de errores y expiración del token
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('profile');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Manejo de errores en Spring Boot (solo mostrar)
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Auth error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
