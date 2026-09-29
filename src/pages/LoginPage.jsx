import './LoginPage.css';
import imagenIzquierda from '../assets/login-left.png';
import { useLoginViewModel } from '../hooks/useLoginViewModel';

export function LoginPage({ onLoginSuccess }) {
  const {
    email,
    password,
    error,
    cargando,
    setEmail,
    setPassword,
    handleSubmit,
  } = useLoginViewModel(onLoginSuccess);

  return (
    <div className="login-page">

      {/* Formas decorativas */}
      <div className="shape shape-top-left"></div>
      <div className="shape shape-top-right"></div>
      <div className="shape shape-bottom-left"></div>
      <div className="shape shape-bottom-right"></div>

      {/* Lado izquierdo: imagen */}
      <section className="login-left">
        <img
          src={imagenIzquierda}
          alt="Bienvenido a MotivaKids"
          className="left-image"
        />
      </section>

      {/* Lado derecho: formulario */}
      <section className="login-right">
        <div className="login-card">

          <div className="avatar-circle">
            <svg viewBox="0 0 24 24" width="34" height="34" fill="white">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
            </svg>
          </div>

          <h2 className="form-title">Iniciar sesión</h2>
          <p className="form-subtitle">
            Ingresa tus credenciales para acceder al sistema.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Usuario */}
            <div className="input-group">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#7d7d7d">
                  <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Usuario o correo electrónico"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Contraseña */}
            <div className="input-group">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#7d7d7d">
                  <path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.7 1.3-3 3-3s3 1.3 3 3v2H9V6zm3 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
              </span>
              <input
                type="password"
                placeholder="Contraseña"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Error */}
            {error && <p className="login-error">{error}</p>}

            <div className="form-options">
              <label className="remember">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Recordar mi sesión
              </label>
              <a href="/recuperar" className="forgot-link">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={cargando}
            >
              {cargando ? 'Ingresando...' : 'Ingresar'}
              <span className="arrow">→</span>
            </button>
          </form>

          <div className="divider">
            <span>Solo personal autorizado</span>
          </div>

          <div className="card-footer">
            <span className="footer-heart">♥</span>
            <p>
              <span className="deco-line">—</span>
              Juntos por un mejor futuro
              <span className="deco-line">—</span>
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}