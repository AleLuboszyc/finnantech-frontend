import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = {
    content: {
        padding: '30px',
        width: '100%',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1e293b',
        margin: 0,
    },

    card: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
    cardTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#64748b', 
        marginTop: 0,
        marginBottom: '20px',
        borderBottom: '1px solid #e2e8f0', 
        paddingBottom: '15px',
    },
    saldosList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
    saldoItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 5px', 
        borderBottom: '1px solid #f1f5f9', 
    },
    moneda: {
        fontWeight: '600',
        fontSize: '18px',
        color: '#334155',
    },
    cantidad: {
        fontSize: '18px',
        color: '#1e293b',
        fontVariantNumeric: 'tabular-nums', 
    }
};

function Saldos() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                setError('No estás autenticado.');
                setTimeout(() => navigate('/login'), 1500);
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (err) {
                setError('Hubo un error al cargar tu perfil.');
                localStorage.removeItem('auth_token');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    if (loading) return <div style={{padding: '40px'}}>Cargando perfil...</div>;
    if (error) return <div style={{padding: '40px', color: 'red' }}>{error}</div>;

    return (
        <div style={styles.content}>
            <header style={styles.header}>
                <h2 style={styles.title}>¡Hola, {user?.name}!</h2>
            </header>

            <div style={styles.card}>
                <h3 style={styles.cardTitle}>Resumen de Saldos</h3>
                {user?.saldos && user.saldos.length > 0 ? (
                    <ul style={styles.saldosList}>
                        {user.saldos.map((saldo, index) => (
                            <li key={saldo.id} style={{...styles.saldoItem, borderBottom: index === user.saldos.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                                <span style={styles.moneda}>{saldo.moneda}</span>
                                <span style={styles.cantidad}>{parseFloat(saldo.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aún no tienes saldos registrados.</p>
                )}
            </div>
        </div>
    );
}

export default Saldos;