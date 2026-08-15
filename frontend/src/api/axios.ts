// frontend/src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  // Ensure this matches the port your Django server is running on (usually 8000)
  baseURL: 'http://127.0.0.1:8000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;