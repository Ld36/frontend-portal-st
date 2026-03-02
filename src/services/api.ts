import axios from 'axios';

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('portal_st_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor de Resposta: Proteção de Sessão
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o backend retornar 401, a sessão expirou ou o token é inválido
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('portal_st_token');
        window.location.href = '/'; 
      }
    }
    return Promise.reject(error);
  }
);