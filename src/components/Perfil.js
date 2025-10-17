import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: '30px',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        maxWidth: '700px', 
    },
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid #f1f5f9',
    },
    avatar: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#303f9f', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '36px',
        fontWeight: 'bold',
        marginRight: '20px',
    },
    userInfo: {
        lineHeight: '1.4',
    },
    userName: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#1e293b',
        margin: 0,
    },
    userEmail: {
        fontSize: '16px',
        color: '#64748b',
        margin: 0,
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#64748b',
        marginTop: '30px',
        marginBottom: '15px',
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '16px',
        padding: '10px 0',
    },
};

const Perfil = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) return; 

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (err) {
                setError('No se pudo cargar la información del perfil.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div style={{ padding: '40px' }}>Cargando perfil...</div>;
    if (error) return <div style={{ padding: '40px', color: 'red' }}>{error}</div>;

    // Obtenemos la inicial del nombre para mostrarla en el avatar
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

    return (
        <div>
            <h2 style={styles.title}>Mi Perfil</h2>
            <div style={styles.card}>
                <div style={styles.profileHeader}>
                    <div style={styles.avatar}>{userInitial}</div>
                    <div style={styles.userInfo}>
                        <p style={styles.userName}>{user?.name}</p>
                        <p style={styles.userEmail}>{user?.email}</p>
                    </div>
                </div>

                <div>
                    <h3 style={styles.sectionTitle}>Información de la Cuenta</h3>
                    <div style={styles.infoRow}>
                        <span>Nombre de usuario:</span>
                        <strong>{user?.name}</strong>
                    </div>
                    <div style={styles.infoRow}>
                        <span>Email verificado:</span>
                        {/* A futuro, esto puede venir del backend */}
                        <strong>{user?.email_verified_at ? 'Sí' : 'No'}</strong>
                    </div>
                    <div style={styles.infoRow}>
                        <span>Miembro desde:</span>
                        <strong>{new Date(user?.created_at).toLocaleDateString('es-ES')}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;

