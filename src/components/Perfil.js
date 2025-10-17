// src/components/Perfil.js

import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import './Perfil.css'; // Crearemos este archivo para los estilos

const Perfil = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Pedimos los datos del perfil al cargar el componente
    useEffect(() => {
        authService.getProfile()
            .then(response => {
                setUser(response.data);
            })
            .catch(err => {
                setError('Error al cargar el perfil.');
                console.error(err);
            });
    }, []);

    // Esta función se activa cuando el usuario elige un archivo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Limpiamos mensajes
        setError('');
        setMessage('Subiendo foto...');

        // 1. Creamos el FormData
        const formData = new FormData();
        formData.append('avatar', file); // 'avatar' debe coincidir con el backend

        // 2. Llamamos al servicio
        authService.uploadAvatar(formData)
            .then(response => {
                // 3. Actualizamos el usuario en el estado con los nuevos datos
                setUser(response.data.user); 
                setMessage(response.data.message);
            })
            .catch(err => {
                console.error(err);
                setMessage('');
                if (err.response && err.response.data) {
                    setError('Error: ' + Object.values(err.response.data).flat().join(' '));
                } else {
                    setError('Error al subir la imagen.');
                }
            });
    };

    // Esta función "simula" un clic en el input oculto
    const handleAvatarClick = () => {
        document.getElementById('avatarInput').click();
    };

    // Si todavía está cargando, mostramos un mensaje
    if (!user) {
        return <div>Cargando perfil...</div>;
    }

    // URL base de tu backend (para armar la URL de la foto)
    const API_BASE_URL = 'http://127.0.0.1:8000';
    const avatarSrc = user.avatar_url 
                        ? `${API_BASE_URL}${user.avatar_url}` 
                        : `https://ui-avatars.com/api/?name=${user.nombre}+${user.apellido}&background=random`; // Avatar por defecto

    return (
        <div className="perfil-container">
            <h2>Mi Perfil</h2>
            
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <div className="perfil-card">
                
                {/* --- SECCIÓN DE AVATAR --- */}
                <div className="avatar-section">
                    <img 
                        src={avatarSrc} 
                        alt="Avatar" 
                        className="avatar-img"
                        onClick={handleAvatarClick}
                        title="Haz clic para cambiar la foto"
                    />
                    {/* Input de tipo 'file' oculto */}
                    <input 
                        type="file" 
                        id="avatarInput"
                        style={{ display: 'none' }} 
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/jpg"
                    />
                </div>
                {/* --- FIN AVATAR --- */}
                
                <h3>{user.nombre} {user.apellido}</h3>
                <p className="email-text">{user.email}</p>

                <hr />

                <div className="info-section">
                    <h4>Información de la Cuenta</h4>
                    <div className="info-item">
                        <span>Nombre de usuario:</span>
                        <span>{user.nombre} {user.apellido}</span>
                    </div>
                    <div className="info-item">
                        <span>Email verificado:</span>
                        <span>{user.email_verified_at ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="info-item">
                        <span>DNI:</span>
                        <span>{user.dni}</span>
                    </div>
                    <div className="info-item">
                        <span>Teléfono:</span>
                        <span>{user.telefono}</span>
                    </div>
                    <div className="info-item">
                        <span>Miembro desde:</span>
                        <span>{new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;