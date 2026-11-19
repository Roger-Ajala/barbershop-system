import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333',
});

// Interceptador de Requisição
api.interceptors.request.use((config) => {
  // Busca o token salvo no momento do login
  const token = localStorage.getItem('@Barbershop:token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});