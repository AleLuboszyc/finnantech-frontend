import axios from 'axios';

// Esta es la URL de tu backend en Laravel.
// ¡Asegúrate de que el puerto (ej. 8000) sea el correcto!
const API_URL = 'http://127.0.0.1:8000/api'; 

/**
 * Llama al endpoint /api/register del backend
 */
const register = (userData) => {
  return axios.post(API_URL + '/register', userData);
};

/**
 * Llama al endpoint /api/login
 */
const login = (email, password) => {
  return axios.post(API_URL + '/login', {
    email,
    password,
  }).then((response) => {
    // Si el login es exitoso, guardamos el token y el usuario en el navegador
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  });
};

/**
 * Borra el token y el usuario para cerrar sesión
 */
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;