import React from 'react';

const styles = {
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1e293b',
        margin: 0,
    }
};

const Noticias = () => {
    return (
        <div>
            <h2 style={styles.title}>Noticias</h2>
            <p>Las últimas noticias del mundo financiero estarán aquí.</p>
        </div>
    );
};

export default Noticias;
