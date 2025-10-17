import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: '30px',
    },
    tableContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse', 
    },
    th: {
        textAlign: 'left',
        padding: '15px 10px',
        borderBottom: '2px solid #e2e8f0',
        color: '#64748b',
        fontSize: '14px',
        textTransform: 'uppercase',
    },
    td: {
        padding: '15px 10px',
        borderBottom: '1px solid #f1f5f9',
    },
    cryptoInfo: {
        display: 'flex',
        alignItems: 'center',
    },
    cryptoImage: {
        width: '32px',
        height: '32px',
        marginRight: '15px',
    },
    cryptoName: {
        fontWeight: 'bold',
        color: '#1e293b',
    },
    cryptoSymbol: {
        color: '#64748b',
        textTransform: 'uppercase',
    },
    price: {
        fontWeight: '600',
    },
    positiveChange: {
        color: '#10b981', // Verde
        fontWeight: '600',
    },
    negativeChange: {
        color: '#ef4444', // Rojo
        fontWeight: '600',
    },
};

const Mercado = () => {
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMarketData = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) return; 

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/crypto/markets', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setMarketData(response.data);
            } catch (err) {
                setError('No se pudo cargar la información del mercado.');
            } finally {
                setLoading(false);
            }
        };

        fetchMarketData();
    }, []);

    if (loading) return <div style={{ padding: '40px' }}>Cargando datos del mercado...</div>;
    if (error) return <div style={{ padding: '40px', color: 'red' }}>{error}</div>;

    return (
        <div>
            <h2 style={styles.title}>Mercado de Criptomonedas</h2>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>#</th>
                            <th style={styles.th}>Nombre</th>
                            <th style={styles.th}>Precio</th>
                            <th style={styles.th}>Cambio 24h</th>
                            <th style={styles.th}>Cap. de Mercado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marketData.map((crypto, index) => (
                            <tr key={crypto.id}>
                                <td style={styles.td}>{index + 1}</td>
                                <td style={styles.td}>
                                    <div style={styles.cryptoInfo}>
                                        <img src={crypto.image} alt={crypto.name} style={styles.cryptoImage} />
                                        <div>
                                            <div style={styles.cryptoName}>{crypto.name}</div>
                                            <div style={styles.cryptoSymbol}>{crypto.symbol}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{...styles.td, ...styles.price}}>
                                    ${crypto.current_price.toLocaleString('en-US')}
                                </td>
                                <td style={crypto.price_change_percentage_24h >= 0 ? styles.positiveChange : styles.negativeChange}>
                                    {crypto.price_change_percentage_24h.toFixed(2)}%
                                </td>
                                <td style={styles.td}>
                                    ${crypto.market_cap.toLocaleString('en-US')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Mercado;
