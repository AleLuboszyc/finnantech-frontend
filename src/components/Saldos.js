// src/components/Saldos.js

import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import './Saldos.css'; // Crearemos este archivo

const Saldos = () => {
    const [saldos, setSaldos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [userName, setUserName] = useState('');

    // Función para traer los datos del perfil (que incluye los saldos)
    const fetchDatos = () => {
        setLoading(true);
        authService.getProfile()
            .then(response => {
                setSaldos(response.data.saldos || []);
                setUserName(response.data.nombre); // Guardamos el nombre para saludar
                setLoading(false);
            })
            .catch(err => {
                setError('Error al cargar los saldos. Intenta recargar la página.');
                setLoading(false);
            });
    };

    // Cargar saldos al inicio
    useEffect(() => {
        fetchDatos();
    }, []);

    // Función del botón
    const handleCargarSaldo = () => {
        setError('');
        setMessage('Cargando saldo...');
        
        authService.cargarSaldoSimulado()
            .then(response => {
                setMessage(response.data.message);
                fetchDatos(); // Volvemos a pedir los datos para actualizar la lista
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    setError(err.response.data.message);
                } else {
                    setError('Error al cargar el saldo.');
                }
                setMessage('');
            });
    };

    if (loading) {
        return <div style={{ padding: '2rem' }}>Cargando saldos...</div>;
    }

    return (
        <div className="saldos-container">
            <h2>¡Hola {userName}! Este es tu resumen de saldos</h2>

            {/* Mensajes de feedback */}
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <div className="saldos-card">
                <div className="saldos-list">
                    {saldos.length > 0 ? (
                        saldos.map(saldo => (
                            <div key={saldo.id} className="saldo-item">
                                <span className="moneda">{saldo.moneda}</span>
                                {/* Damos formato de moneda al número */}
                                <span className="cantidad">
                                    {parseFloat(saldo.cantidad).toLocaleString('es-AR', { 
                                        style: 'currency', 
                                        currency: saldo.moneda,
                                        minimumFractionDigits: 2 
                                    })}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="saldo-item-empty">
                            <p>No tenés saldos disponibles.</p>
                            <p>¡Cargá tu saldo de prueba para empezar!</p>
                        </div>
                    )}
                </div>

                {/* Botón para cargar saldo */}
                <button 
                    onClick={handleCargarSaldo} 
                    className="cargar-saldo-btn"
                    // Deshabilitamos el botón si ya tiene saldo en ARS
                    enable={saldos.some(s => s.moneda === 'ARS')} 
                >
                    Cargar $1,000,000 ARS (Prueba)
                </button>
            </div>
        </div>
    );
};

export default Saldos;