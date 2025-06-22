// crm-frontend/src/api/axios.js
import axios from 'axios';


const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api', // Remplacez par l'URL de votre backend
  withCredentials: true, // Pour envoyer les cookies si utilisés (pas directement pour JWT ici mais bonne pratique)
});

export default API;