import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';

import Login from './components/Login.js';
import Registro from './components/Registro.js';
import Logo from './components/Logo.js';
import Saldos from './components/Saldos.js';
import Perfil from './components/Perfil.js';
import Mercado from './components/Mercado.js';
import Noticias from './components/Noticias.js';

const styles = {
    appContainer: { display: 'flex', minHeight: '100vh', fontFamily: 'Poppins, sans-serif', width: '100%' },
    sidebar: { width: '250px', backgroundColor: '#1a237e', color: 'white', display: 'flex', flexDirection: 'column', flexShrink: 0 },
    logoContainer: { padding: '20px', borderBottom: '1px solid #3949ab' },
    nav: { display: 'flex', flexDirection: 'column', padding: '20px 0', flexGrow: 1 },
    navLink: { padding: '15px 20px', color: '#e8eaf6', textDecoration: 'none', fontSize: '1.1em', transition: 'background-color 0.2s ease-in-out', display: 'block' },
    activeLink: { backgroundColor: '#303f9f', color: '#ffffff', fontWeight: 'bold' },
    logoutButton: { background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', marginTop: 'auto', borderTop: '1px solid #3949ab' },
    mainContent: { flexGrow: 1, padding: '40px', backgroundColor: '#f4f7f9' },
    
    mobileHeader: { display: 'flex', padding: '10px 15px', backgroundColor: '#1a237e', color: 'white', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1002, alignItems: 'center', justifyContent: 'space-between' },
    mobileLogoContainer: { height: '30px' },
    hamburgerButton: { background: 'none', border: 'none', color: 'white', fontSize: '28px', cursor: 'pointer' },
    mobileSidebar: { position: 'fixed', top: '50px', left: 0, bottom: 0, width: '100%', backgroundColor: '#1a237e', color: 'white', display: 'flex', flexDirection: 'column', transform: 'translateX(-100%)', transition: 'transform 0.3s ease-in-out', zIndex: 1003 },
    sidebarOpen: { transform: 'translateX(0)' },
    backdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1001, opacity: 0, transition: 'opacity 0.3s ease-in-out', pointerEvents: 'none' },
    backdropVisible: { opacity: 1, pointerEvents: 'auto' }
};

const GlobalStyle = () => {
    const css = `body.no-scroll { overflow: hidden; }`;
    return <style>{css}</style>;
};

const HomePage = () => ( <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', flexGrow: 1 }}><div style={{ width: '300px', marginBottom: '20px' }}><Logo color="#1a237e" /></div><h1 style={{ fontSize: '2.5em', color: '#1a237e' }}>Bienvenido a Finnantech</h1><p style={{ fontSize: '1.2em', color: '#555', maxWidth: '500px' }}>La plataforma moderna y segura para gestionar tus finanzas personales y criptomonedas.</p></div>);

const SidebarContent = ({ isLoggedIn, handleLogout, onLinkClick = () => {} }) => (
    <>
        <div style={styles.logoContainer}><Logo /></div>
        <nav style={styles.nav}>
            {isLoggedIn ? (
                <>
                    <NavLink to="/saldos" onClick={onLinkClick} style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink)}>Saldos</NavLink>
                    <NavLink to="/mercado" onClick={onLinkClick} style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink)}>Mercado</NavLink>
                    <NavLink to="/perfil" onClick={onLinkClick} style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink)}>Perfil</NavLink>
                    <NavLink to="/noticias" onClick={onLinkClick} style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink)}>Noticias</NavLink>
                </>
            ) : (
                <>
                    <NavLink to="/" onClick={onLinkClick} style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink)}>Inicio</NavLink>
                    <NavLink to="/login" onClick={onLinkClick} style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink)}>Login</NavLink>
                    <NavLink to="/register" onClick={onLinkClick} style={({ isActive }) => (isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink)}>Registro</NavLink>
                </>
            )}
            {isLoggedIn && (<button onClick={() => { handleLogout(); onLinkClick(); }} style={{...styles.navLink, ...styles.logoutButton}}>Cerrar Sesión</button>)}
        </nav>
    </>
);

function App() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('auth_token'));

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        document.body.classList.toggle('no-scroll', isSidebarOpen);
        return () => document.body.classList.remove('no-scroll');
    }, [isSidebarOpen]);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        setIsLoggedIn(false);
    };

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const mainContentDynamicStyle = { ...styles.mainContent, ...(isMobile && { paddingTop: '70px' }) };
    const backdropDynamicStyle = { ...styles.backdrop, ...(isSidebarOpen && styles.backdropVisible) };

    return (
        <Router>
            <GlobalStyle />
            <div style={styles.appContainer}>
                {isMobile ? (
                    <>
                        <header style={styles.mobileHeader}>
                            <button onClick={toggleSidebar} style={styles.hamburgerButton}>&#9776;</button>
                            <div style={styles.mobileLogoContainer}><Logo /></div>
                            <div style={{ width: '28px' }}></div>
                        </header>
                        <aside style={{...styles.mobileSidebar, ...(isSidebarOpen && styles.sidebarOpen)}}>
                            <SidebarContent isLoggedIn={isLoggedIn} handleLogout={handleLogout} onLinkClick={toggleSidebar} />
                        </aside>
                        <div style={backdropDynamicStyle} onClick={toggleSidebar}></div>
                    </>
                ) : (
                    <aside style={styles.sidebar}>
                        <SidebarContent isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                    </aside>
                )}
                
                <main style={mainContentDynamicStyle}>
                    <Routes>
                        <Route path="/" element={!isLoggedIn ? <HomePage /> : <Navigate to="/saldos" />} />
                        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/saldos" />} />
                        <Route path="/register" element={!isLoggedIn ? <Registro /> : <Navigate to="/saldos" />} />
                        <Route path="/saldos" element={isLoggedIn ? <Saldos /> : <Navigate to="/login" />} />
                        <Route path="/mercado" element={isLoggedIn ? <Mercado /> : <Navigate to="/login" />} />
                        <Route path="/perfil" element={isLoggedIn ? <Perfil /> : <Navigate to="/login" />} />
                        <Route path="/noticias" element={isLoggedIn ? <Noticias /> : <Navigate to="/login" />} />
                        <Route path="*" element={<Navigate to={isLoggedIn ? "/saldos" : "/login"} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
