// src/components/Registro.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService'; 
import './Registro.css'; 

const Registro = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [dni, setDni] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [sexo, setSexo] = useState('masculino'); 
    const [terms, setTerms] = useState(false); 
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 

        //Validación simple en el frontend
        if (password !== passwordConfirmation) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (!terms) {
            setError('Debes aceptar los términos y condiciones.');
            return;
        }

        try {
            //Objeto con todos los datos para el backend
            const userData = {
                nombre,
                apellido,
                email,
                password,
                password_confirmation: passwordConfirmation,
                dni,
                fecha_nacimiento: fechaNacimiento,
                telefono,
                sexo,
                terms: terms, 
            };

            //Llamamos al servicio de autenticación
            await authService.register(userData);
            
            //Si todo sale bien, redirigimos al login
            navigate('/login');

        } catch (err) {
            //Manejo de errores del backend
            if (err.response && err.response.data) {
                const messages = Object.values(err.response.data).flat().join(' ');
                setError(messages);
            } else {
                setError('Error al registrar el usuario. Inténtelo de nuevo.');
            }
            console.error(err);
        }
    };

    //Renderizado del Formulario 
    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                
                <h2 className="form-full-width">Registro de Usuario</h2>
                
                {error && <div className="form-full-width error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

                <div className="form-grid">
                    
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="apellido">Apellido:</label>
                        <input
                            type="text"
                            id="apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="dni">DNI:</label>
                        <input
                            type="text"
                            id="dni"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            required
                        />
                    </div>
                    
                    {/* Fila 3 */}
                    <div className="form-group">
                        <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
                        <input
                            type="date"
                            id="fechaNacimiento"
                            value={fechaNacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono:</label>
                        <input
                            type="tel"
                            id="telefono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                        />
                    </div>
                    
                     <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength="8"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="passwordConfirmation">Confirmar Contraseña:</label>
                        <input
                            type="password"
                            id="passwordConfirmation"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="sexo">Sexo:</label>
                        <select id="sexo" value={sexo} onChange={(e) => setSexo(e.target.value)} required>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="otro">Prefiero no decirlo</option>
                        </select>
                    </div>

                </div> 

                <div className="form-group terms-group form-full-width">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={terms}
                        onChange={(e) => setTerms(e.target.checked)}
                    />
                    <label htmlFor="terms">
                        Acepto los términos y condiciones.
                    </label>
                </div>

                <button type="submit" className="register-button form-full-width">Registrarse</button>
            </form>
        </div>
    );
};

export default Registro;