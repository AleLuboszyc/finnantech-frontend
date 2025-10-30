import React, { useState, useEffect } from 'react';
import authService from '../services/authService'; 
import './Noticias.css'; 

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const Noticias = () => {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        authService.getNoticias() 
            .then(response => {
                setNoticias(response.data); 
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar noticias:", err);
                setError("No se pudieron cargar las noticias. Verifique el endpoint /api/noticias y la autenticación.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="noticias-container">Cargando noticias...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="noticias-container">
            <h2>Noticias</h2>
            
            {noticias.length === 0 ? (
                <p>Las últimas noticias del mundo financiero estarán aquí.</p>
            ) : (
                <div className="noticias-list">
                    {noticias.map(noticia => (
                        <div key={noticia.id} className="noticia-card">
                            <img src={noticia.image_url} alt={noticia.title} className="noticia-imagen" />
                            <div className="noticia-contenido">
                                <h3>{noticia.title}</h3>
                                {}
                                <p className="noticia-resumen">{noticia.content}</p> 
                                <span className="noticia-meta">
                                    Fuente: {noticia.source} | Publicado: {formatDate(noticia.published_at)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Noticias;