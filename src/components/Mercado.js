// src/components/Mercado.js

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Usaremos axios directamente para CoinGecko aquí
import authService from '../services/authService'; // Para la compra
import './Mercado.css'; // Crearemos este archivo

// -----------------------------------------------------------------
// 👇 FUNCIÓN DE AYUDA PARA FORMATO DE NÚMEROS GRANDES (IMPLEMENTADA) 👇
// -----------------------------------------------------------------

/**
 * Función de ayuda para formatear números grandes a formato abreviado (ej: 3.09B)
 */
const formatLargeNumber = (num) => {
    if (num >= 1.0e+12) { // Mayor o igual a un billón (Trillion)
        return (num / 1.0e+12).toFixed(2) + " T";
    }
    if (num >= 1.0e+9) { // Mayor o igual a mil millones (Billion)
        return (num / 1.0e+9).toFixed(2) + " B";
    }
    if (num >= 1.0e+6) { // Mayor o igual a un millón (Million)
        return (num / 1.0e+6).toFixed(2) + " M";
    }
    return num.toLocaleString('es-AR', { maximumFractionDigits: 0 });
};


// --- Componente Modal para Comprar ---
const ModalCompra = ({ crypto, onClose, onCompraExitosa }) => {
    const [montoArs, setMontoArs] = useState('');
    const [cantidadCrypto, setCantidadCrypto] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Calcular cantidad de crypto al escribir el monto en ARS
    useEffect(() => {
        if (montoArs > 0 && crypto && crypto.current_price) {
            setCantidadCrypto(montoArs / crypto.current_price);
        } else {
            setCantidadCrypto(0);
        }
    }, [montoArs, crypto]);

    const handleCompra = () => {
        if (montoArs <= 0) {
            setError('Ingresa un monto válido en ARS.');
            return;
        }
        setLoading(true);
        setError('');

        authService.comprarCrypto(crypto.id, montoArs)
            .then(response => {
                setLoading(false);
                onCompraExitosa(`¡Compra exitosa! Recibiste ${cantidadCrypto.toFixed(8)} ${crypto.symbol.toUpperCase()}`);
                onClose(); // Cerrar modal
            })
            .catch(err => {
                setLoading(false);
                if (err.response && err.response.data) {
                     // Si es un error de validación (ej. saldo insuficiente)
                     if (err.response.status === 422) {
                          setError(Object.values(err.response.data).flat().join(' '));
                     } else {
                          setError(err.response.data.message || 'Error al procesar la compra.');
                     }
                } else {
                    setError('Error de conexión al intentar comprar.');
                }
            });
    };

    if (!crypto) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Comprar {crypto.name} ({crypto.symbol.toUpperCase()})</h2>
                {/* CORRECCIÓN 1: Se eliminó el '$' manual para evitar el doble signo */}
                <p>Precio actual: {crypto.current_price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })} ARS</p> 
                
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label htmlFor="montoArs">Monto a gastar (ARS):</label>
                    <input 
                        type="number" 
                        id="montoArs"
                        value={montoArs}
                        onChange={(e) => setMontoArs(parseFloat(e.target.value) || 0)}
                        min="1"
                        step="any"
                        placeholder="Ej: 50000"
                    />
                </div>

                <p>Recibirás aprox.: {cantidadCrypto.toFixed(8)} {crypto.symbol.toUpperCase()}</p>

                <div className="modal-actions">
                    <button onClick={handleCompra} disabled={loading || montoArs <= 0}>
                        {loading ? 'Procesando...' : 'Confirmar Compra'}
                    </button>
                    <button onClick={onClose} disabled={loading} className="cancel-btn">Cancelar</button>
                </div>
            </div>
        </div>
    );
};
// --- Fin Modal ---


// --- Componente Principal Mercado ---
const Mercado = () => {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Llamada a CoinGecko para obtener el mercado
        axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'ars', // Pedimos precios en ARS
                order: 'market_cap_desc',
                per_page: 20, // Top 20
                page: 1,
                sparkline: false
            }
        })
        .then(response => {
            setCryptos(response.data);
            setLoading(false);
        })
        .catch(err => {
            setError('Error al cargar los datos del mercado.');
            setLoading(false);
            console.error(err);
        });
    }, []);

    const openModal = (crypto) => {
        setSelectedCrypto(crypto);
        setModalOpen(true);
        setSuccessMessage(''); // Limpiar mensaje de éxito previo
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedCrypto(null);
    };
    
    const handleCompraExitosa = (message) => {
         setSuccessMessage(message);
         // Podríamos recargar los saldos aquí si fuera necesario
    };

    if (loading) {
        return <div style={{ padding: '2rem' }}>Cargando mercado...</div>;
    }

    if (error) {
        return <div className="error-message" style={{ margin: '2rem' }}>{error}</div>;
    }

    return (
        <div className="mercado-container">
            <h2>Mercado de Criptomonedas (Precios en ARS)</h2>

             {successMessage && <div className="success-message" style={{ marginBottom: '1rem' }}>{successMessage}</div>}

            <table className="crypto-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Precio (ARS)</th>
                        <th>Cambio 24h</th>
                        <th>Cap. Mercado</th> {/* ✅ CORRECCIÓN 2: Se simplificó la abreviatura */}
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {cryptos.map((crypto, index) => (
                        <tr key={crypto.id}>
                            <td>{index + 1}</td>
                            <td>
                                <img src={crypto.image} alt={crypto.name} width="20" style={{ marginRight: '10px' }}/>
                                {crypto.name} ({crypto.symbol.toUpperCase()})
                            </td>
                            <td>${crypto.current_price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style={{ color: crypto.price_change_percentage_24h >= 0 ? 'green' : 'red' }}>
                                {crypto.price_change_percentage_24h.toFixed(2)}%
                            </td>
                            {/* ✅ CORRECCIÓN 3: Se aplica la nueva función de formato para números grandes */}
                            <td>$ {formatLargeNumber(crypto.market_cap)}</td>
                            <td>
                                <button onClick={() => openModal(crypto)} className="buy-btn">
                                    Comprar
                                </button>
                                {/* <button className="sell-btn">Vender</button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Renderizar el Modal si está abierto */}
            {modalOpen && selectedCrypto && (
                <ModalCompra 
                    crypto={selectedCrypto} 
                    onClose={closeModal} 
                    onCompraExitosa={handleCompraExitosa}
                />
            )}
        </div>
    );
};

export default Mercado;