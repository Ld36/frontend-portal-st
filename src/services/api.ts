import axios from 'axios';

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export const api = axios.create({
  baseURL: apiBaseUrl,
});

export const setAuthType = (type: 'interno' | 'externo') => {
  api.defaults.headers.common['x-actor-type'] = type;
};

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('portal_st_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-actor-type'] = 'interno';
    } else {
      config.headers['x-actor-type'] = config.headers['x-actor-type'] || 'externo';
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