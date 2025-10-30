import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import './Saldos.css';

const Saldos = () => {
    const [saldos, setSaldos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [userName, setUserName] = useState('');

    const fetchDatos = () => {
        setLoading(true);
        setError('');
        setMessage('');

        authService.getProfile()
            .then(response => {
                setSaldos(response.data.saldos || []);
                setUserName(response.data.nombre);
                setLoading(false);
            })
            .catch(err => {
                setError('Error al cargar los saldos. Intenta recargar la página.');
                setLoading(false);
                console.error("Error en fetchDatos:", err);
            });
    };

    useEffect(() => {
        fetchDatos();
    }, []);

    const handleCargarSaldo = () => {
        setError('');
        setMessage('Cargando saldo...');
        
        authService.cargarSaldoSimulado()
            .then(response => {
                setMessage(response.data.message);
                fetchDatos();
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

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <div className="saldos-card">
                <div className="saldos-list">
                    {saldos.length > 0 ? (
                        saldos.map(saldo => {
                            let cantidadFormateada;
                            
                            try {
                                cantidadFormateada = parseFloat(saldo.cantidad).toLocaleString('es-AR', { 
                                    style: 'currency', 
                                    currency: saldo.moneda,
                                    minimumFractionDigits: 2 
                                });
                            } catch (e) {
                                cantidadFormateada = `${parseFloat(saldo.cantidad).toFixed(8)} ${saldo.moneda}`;
                            }

                            return (
                                <div key={saldo.id} className="saldo-item">
                                    <span className="moneda">{saldo.moneda}</span>
                                    <span className="cantidad">{cantidadFormateada}</span>
                                </div>
                            );
                        })
                    ) : (
                        <div className="saldo-item-empty">
                            <p>No tenés saldos disponibles.</p>
                            <p>¡Cargá tu saldo de prueba para empezar!</p>
                        </div>
                    )}
                </div>
                
                <button 
                    onClick={handleCargarSaldo} 
                    className="cargar-saldo-btn"
                    disabled={saldos.some(s => s.moneda === 'ARS' && s.cantidad > 0)} 
                >
                    Cargar $1,000,000 ARS (Prueba)
                </button>
            </div>
        </div>
    );
};

export default Saldos;