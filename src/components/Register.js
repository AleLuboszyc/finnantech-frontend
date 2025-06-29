import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  // Creamos "cajas" (estados) para guardar los datos del formulario.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Estados para guardar mensajes de éxito o error de la API.
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Esta función se ejecuta cada vez que el usuario escribe en un campo.
  const handleChange = (e) => {
    // Actualiza la "caja" formData con el nuevo valor.
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Esta función se ejecuta cuando el usuario presiona el botón de "Registrarse".
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue.
    setMessage('');
    setErrors({});

    try {
      // ¡La línea mágica! Enviamos los datos de formData a la API de Laravel.
      const response = await axios.post('http://127.0.0.1:8000/api/register', formData);
      
      // Si todo sale bien, mostramos el mensaje de éxito de la API.
      setMessage(response.data.message);
      setFormData({ name: '', email: '', password: '' }); // Limpiamos el formulario.

    } catch (error) {
      // Si la API devuelve errores de validación (ej: email ya existe).
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        // Para cualquier otro error (ej: el servidor de Laravel no está corriendo).
        setMessage('Ocurrió un error al registrar el usuario.');
        console.error("Error en el registro: ", error);
      }
    }
  };

  // Esto es lo que se dibuja en la pantalla (el HTML).
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Nombre:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          {errors.name && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.name[0]}</p>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/>
          {errors.email && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.email[0]}</p>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Contraseña:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}/>
          {errors.password && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.password[0]}</p>}
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Registrarse</button>
      </form>
      {message && <p style={{ marginTop: '20px', color: 'green' }}>{message}</p>}
    </div>
  );
}

export default Register;
