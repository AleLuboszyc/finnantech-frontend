import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors({});

    try {
      // Enviamos los datos del formulario al endpoint de login.
      const response = await axios.post('http://127.0.0.1:8000/api/login', formData);
      
      // ¡Paso clave! Si el login es exitoso, guardamos el token de acceso.
      localStorage.setItem('auth_token', response.data.access_token);
      
      setMessage('¡Login exitoso! Redirigiendo...');
      // En un futuro, aquí redirigiremos a la página principal.
      // window.location.href = '/dashboard';

    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Maneja errores de validación (ej: contraseña incorrecta).
        setErrors(error.response.data.errors);
      } else {
        setMessage('Ocurrió un error al iniciar sesión.');
        console.error("Error en el login: ", error);
      }
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
           {errors.email && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.email[0]}</p>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Contraseña:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/>
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Entrar</button>
      </form>
      {message && <p style={{ marginTop: '20px', color: errors.email ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
}

export default Login;
