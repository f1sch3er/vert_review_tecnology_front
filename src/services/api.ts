import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Sem barra no final aqui
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@Ledger:token');
  console.log("Interceptor enviando token:", token); // Verifique se isso aparece no F12
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;