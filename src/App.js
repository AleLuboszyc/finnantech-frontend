import React from 'react';
// Importamos las herramientas de react-router-dom que necesitamos
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Importamos los componentes que acabamos de crear
import Login from './components/Login.js';
import Register from './components/Register.js';

// Creamos un componente simple para la página de inicio
const HomePage = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>Bienvenido a FinnanTech</h1>
    <p>Tu solución financiera de confianza.</p>
    <p>Usa los enlaces de arriba para registrarte o iniciar sesión.</p>
  </div>
);

function App() {
  return (
    // El componente Router envuelve toda nuestra aplicación para habilitar la navegación
    <Router>
      <div>
        {/* Aquí creamos una barra de navegación simple */}
        <nav style={{ padding: '15px', background: '#f8f8f8', borderBottom: '1px solid #ddd', textAlign: 'center', fontSize: '1.1em' }}>
          <Link to="/" style={{ margin: '0 15px', textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>FinnanTech</Link>
          <Link to="/login" style={{ margin: '0 15px', textDecoration: 'none', color: '#007bff' }}>Login</Link>
          <Link to="/register" style={{ margin: '0 15px', textDecoration: 'none', color: '#28a745' }}>Registro</Link>
        </nav>

        {/* El componente Routes es donde definimos qué componente se muestra para cada URL */}
        <Routes>
          {/* Cuando la URL sea "/", muestra el componente HomePage */}
          <Route path="/" element={<HomePage />} />
          
          {/* Cuando la URL sea "/login", muestra el componente Login */}
          <Route path="/login" element={<Login />} />

          {/* Cuando la URL sea "/register", muestra el componente Register */}
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
