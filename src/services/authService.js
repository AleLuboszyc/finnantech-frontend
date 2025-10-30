import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'; 

const getToken = () => {
 return localStorage.getItem('auth_token');
};

const register = (userData) => {
 return axios.post(API_URL + '/register', userData);
};

const login = (email, password) => {
 return axios.post(API_URL + '/login', {
   email,
   password,
 }).then((response) => {
   if (response.data.access_token) {
     localStorage.setItem('auth_token', response.data.access_token);
     localStorage.setItem('user', JSON.stringify(response.data.user));
   }
   return response.data;
 });
};

const logout = () => {
 localStorage.removeItem('auth_token');
 localStorage.removeItem('user');
};

const uploadAvatar = (formData) => {
 const token = getToken();
 return axios.post(API_URL + '/profile/avatar', formData, {
   headers: {
     'Content-Type': 'multipart/form-data', 
     'Authorization': `Bearer ${token}` 
   }
 });
};

const getProfile = () => {
    const token = getToken();
    return axios.get(API_URL + '/profile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

const cargarSaldoSimulado = () => {
 const token = getToken();
 return axios.post(API_URL + '/saldos/cargar-simulado', {}, { 
   headers: { 
     'Authorization': `Bearer ${token}` 
   }
 });
};

const comprarCrypto = (cryptoId, cantidadArs) => {
 const token = getToken();
 return axios.post(API_URL + '/trade/comprar', 
   { crypto_id: cryptoId, cantidad_ars: cantidadArs },
   { headers: { 'Authorization': `Bearer ${token}` } }
 );
};

const venderCrypto = (cryptoId, cantidadCrypto) => {
   const token = getToken();
   return axios.post(API_URL + '/trade/vender', 
     { crypto_id: cryptoId, cantidad_crypto: cantidadCrypto }, 
     { headers: { 'Authorization': `Bearer ${token}` } }
   );
};

const getHistorialTransacciones = () => {
    const token = getToken();
    return axios.get(API_URL + '/transacciones', { headers: { 'Authorization': `Bearer ${token}` } });
};

 
const getNoticias = () => {
    const token = getToken();
    return axios.get(API_URL + '/noticias', { 
        headers: { 'Authorization': `Bearer ${token}` } 
    });
};

const authService = {
  register,
  login,
  logout,
  uploadAvatar,
  getProfile,
  cargarSaldoSimulado,
  comprarCrypto,
  venderCrypto,
  getHistorialTransacciones,
  getNoticias // 
};

export default authService;
