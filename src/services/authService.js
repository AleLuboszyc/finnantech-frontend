import axios from 'axios';

// Esta es la URL de tu backend en Laravel.
const API_URL = 'http://127.0.0.1:8000/api'; 

/**
 * Función para obtener el token guardado en localStorage
 */
const getToken = () => {
 return localStorage.getItem('auth_token');
};

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
     localStorage.setItem('auth_token', response.data.access_token);
     localStorage.setItem('user', JSON.stringify(response.data.user));
   }
   return response.data;
 });
};

/**
 * Borra el token y el usuario para cerrar sesión
 */
const logout = () => {
 localStorage.removeItem('auth_token');
 localStorage.removeItem('user');
};

/**
 * Sube la imagen del avatar al backend.
 * Recibe un objeto FormData.
 */
const uploadAvatar = (formData) => {
 const token = getToken(); // Obtenemos el token

 return axios.post(API_URL + '/profile/avatar', formData, {
   headers: {
     // Es crucial poner 'multipart/form-data'
     'Content-Type': 'multipart/form-data', 
     // Y enviar el token de autorización
     'Authorization': `Bearer ${token}` 
   }
 });
};

/**
 * Obtiene los datos del perfil del usuario logueado
 */
const getProfile = () => {
    const token = getToken();
    return axios.get(API_URL + '/profile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

/**
 * Llama al endpoint para cargar el saldo simulado
 */
const cargarSaldoSimulado = () => {
 const token = getToken();
 // Enviamos un cuerpo vacío {} porque el POST lo requiere
 return axios.post(API_URL + '/saldos/cargar-simulado', {}, { 
   headers: { 
     'Authorization': `Bearer ${token}` 
   }
 });
};


// -----------------------------------------------------------------
// 👇 NUEVAS FUNCIONES PARA EL PASO 3 (COMPRA/VENTA/HISTORIAL) 👇
// -----------------------------------------------------------------

/**
 * Llama al endpoint para comprar cripto
 */
const comprarCrypto = (cryptoId, cantidadArs) => {
 const token = getToken();
 return axios.post(API_URL + '/trade/comprar', 
   { crypto_id: cryptoId, cantidad_ars: cantidadArs }, // Cuerpo de la petición 
   { headers: { 'Authorization': `Bearer ${token}` } }
 );
};

/**
 * Llama al endpoint para vender cripto (a futuro)
 */
const venderCrypto = (cryptoId, cantidadCrypto) => {
   // const token = getToken(); // COMENTADO para evitar el warning 'token' sin usar. Se descomenta al implementar la venta.
   // return axios.post(API_URL + '/trade/vender', { crypto_id: cryptoId, cantidad_crypto: cantidadCrypto }, { headers: { 'Authorization': `Bearer ${token}` } });
   
   // Por ahora devuelve un error 501, ya que el backend aún no está implementado
   return Promise.reject({
       response: {
           status: 501, 
           data: {
               message: "Función vender no implementada aún."
           }
       }
   }); 
};

/**
 * Obtiene el historial de transacciones
 */
const getHistorialTransacciones = () => {
    const token = getToken();
    return axios.get(API_URL + '/transacciones', { headers: { 'Authorization': `Bearer ${token}` } });
};

/**
 * Llama al endpoint para obtener las noticias
 */
const getNoticias = () => {
    const token = getToken();
    // Asumiendo que el endpoint es /api/noticias y requiere autenticación
    return axios.get(API_URL + '/noticias', { 
        headers: { 'Authorization': `Bearer ${token}` } 
    });
};


// Creamos el objeto del servicio con todas las funciones
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
  getNoticias // 👈 ¡CORRECCIÓN CLAVE: SE AGREGÓ LA FUNCIÓN AQUÍ!
};

export default authService;