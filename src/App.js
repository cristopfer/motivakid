import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);

  const handleLoginSuccess = (usuarioLogueado) => {
    setUsuario(usuarioLogueado);
  };

  const handleLogout = () => {
    setUsuario(null);
  };

  return (
    <>
      {usuario ? (
        <DashboardPage usuario={usuario} onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;
