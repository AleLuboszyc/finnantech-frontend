import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import authService from '../services/authService'; 
import './Mercado.css';

const ModalCompra = ({ crypto, onClose, onCompraExitosa }) => {
    const [montoArs, setMontoArs] = useState('');
    const [cantidadCrypto, setCantidadCrypto] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
                onCompraExitosa(`¡Compra exitosa!`);
                onClose(); 
            })
            .catch(err => {
                setLoading(false);
                if (err.response && err.response.data) {
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
                <p>Precio actual: {crypto.current_price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })} ARS</p>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="montoArs">Monto a gastar (ARS):</label>
                    <input 
                        type="number" 
                        id="montoArs"
                        value={montoArs}
                        onChange={(e) => setMontoArs(parseFloat(e.target.value) || 0)}
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

const ModalVenta = ({ crypto, saldo, onClose, onVentaExitosa }) => {
    const [cantidadCrypto, setCantidadCrypto] = useState('');
    const [montoArs, setMontoArs] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (cantidadCrypto > 0 && crypto && crypto.current_price) {
            setMontoArs(cantidadCrypto * crypto.current_price);
        } else {
            setMontoArs(0);
        }
    }, [cantidadCrypto, crypto]);

    const handleVenta = () => {
        if (cantidadCrypto <= 0 || cantidadCrypto > saldo) {
            setError('Ingresa una cantidad válida para vender.');
            return;
        }
        setLoading(true);
        setError('');

        authService.venderCrypto(crypto.id, cantidadCrypto)
            .then(response => {
                setLoading(false);
                onVentaExitosa('¡Venta exitosa!');
                onClose();
            })
            .catch(err => {
                setLoading(false);
                if (err.response && err.response.data) {
                    if (err.response.status === 422) {
                        setError(Object.values(err.response.data).flat().join(' '));
                    } else {
                        setError(err.response.data.message || 'Error al procesar la venta.');
                    }
                } else {
                    setError('Error de conexión al intentar vender.');
                }
            });
    };

    if (!crypto) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Vender {crypto.name} ({crypto.symbol.toUpperCase()})</h2>
                <p>Tu saldo: {saldo.toFixed(8)} {crypto.symbol.toUpperCase()}</p>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="cantidadCrypto">Cantidad a vender:</label>
                    <input
                        type="number"
                        id="cantidadCrypto"
                        value={cantidadCrypto}
                        onChange={(e) => setCantidadCrypto(parseFloat(e.target.value) || 0)}
                        max={saldo}
                        placeholder={`Máx: ${saldo.toFixed(8)}`}
                    />
                </div>
                <p>Recibirás aprox.: {montoArs.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })} ARS</p>
                <div className="modal-actions">
                    <button onClick={handleVenta} disabled={loading || cantidadCrypto <= 0 || cantidadCrypto > saldo}>
                        {loading ? 'Procesando...' : 'Confirmar Venta'}
                    </button>
                    <button onClick={onClose} disabled={loading} className="cancel-btn">Cancelar</button>
                </div>
            </div>
        </div>
    );
};


const Mercado = () => {
    const [cryptos, setCryptos] = useState([]);
    const [saldos, setSaldos] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modal, setModal] = useState({ type: null, crypto: null });
    const [successMessage, setSuccessMessage] = useState('');

    const fetchData = () => {
        setLoading(true);
        Promise.all([
            axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                params: { vs_currency: 'ars', order: 'market_cap_desc', per_page: 20, page: 1, sparkline: false }
            }),
            authService.getProfile()
        ])
        .then(([marketResponse, profileResponse]) => {
            setCryptos(marketResponse.data);
            
            const saldosArray = profileResponse.data.saldos || [];
            const saldosObj = saldosArray.reduce((acc, saldo) => {
                acc[saldo.moneda] = saldo.cantidad;
                return acc;
            }, {});
            setSaldos(saldosObj);
            
            setLoading(false);
        })
        .catch(err => {
            setError('Error al cargar los datos.');
            setLoading(false);
            console.error(err);
        });
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const openModal = (type, crypto) => {
        setModal({ type, crypto });
        setSuccessMessage(''); 
    };

    const closeModal = () => {
        setModal({ type: null, crypto: null });
    };
    
    const handleTransaccionExitosa = (message) => {
         setSuccessMessage(message);
         fetchData(); 
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
                        <th>Tu Saldo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cryptos.map((crypto, index) => {
                        const simbolo = crypto.symbol.toUpperCase();
                        const miSaldo = parseFloat(saldos[simbolo] || 0);
                        return (
                            <tr key={crypto.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <img src={crypto.image} alt={crypto.name} width="20" style={{ marginRight: '10px' }}/>
                                    {crypto.name} ({simbolo})
                                </td>
                                <td>${crypto.current_price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td style={{ color: crypto.price_change_percentage_24h >= 0 ? 'green' : 'red' }}>
                                    {crypto.price_change_percentage_24h.toFixed(2)}%
                                </td>
                                <td>
                                    {miSaldo > 0 ? `${miSaldo.toFixed(8)} ${simbolo}` : '-'}
                                </td>
                                <td>
                                    <button onClick={() => openModal('compra', crypto)} className="buy-btn">
                                        Comprar
                                    </button>
                                    {miSaldo > 0 && (
                                        <button onClick={() => openModal('venta', crypto)} className="sell-btn">
                                            Vender
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            {modal.type === 'compra' && (
                <ModalCompra 
                    crypto={modal.crypto} 
                    onClose={closeModal} 
                    onCompraExitosa={handleTransaccionExitosa}
                />
            )}
            {modal.type === 'venta' && (
                <ModalVenta 
                    crypto={modal.crypto} 
                    saldo={parseFloat(saldos[modal.crypto.symbol.toUpperCase()] || 0)}
                    onClose={closeModal} 
                    onVentaExitosa={handleTransaccionExitosa}
                />
            )}
        </div>
    );
};

export default Mercado;