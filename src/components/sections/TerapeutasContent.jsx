import { useState } from 'react';
import './TerapeutasContent.css';

export function TerapeutasContent() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  /* Sin datos por ahora */
  const terapeutas = [];
  const totalTerapeutas = 0;

  return (
    <div className="terapeutas-content">

      {/* ============ BANNER ============ */}
      <section className="ter-banner">
        <div className="ter-banner-icon">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="#fff">
            <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
          </svg>
        </div>

        <div className="ter-banner-text">
          <h1>Gestión de Terapeutas</h1>
          <p>Registra, actualiza y elimina la información de los terapeutas del centro terapéutico.</p>
        </div>

        {/* Decoraciones del banner */}
        <span className="ter-deco ter-deco-confetti">🎉</span>
        <span className="ter-deco ter-deco-heart">♥</span>
        <span className="ter-deco ter-deco-star">★</span>

        <div className="ter-banner-image"></div>
      </section>

      {/* ============ BARRA DE FILTROS ============ */}
      <section className="ter-filters">
        <div className="ter-search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#a855f7" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <select
          className="ter-select"
          value={filtroEspecialidad}
          onChange={(e) => setFiltroEspecialidad(e.target.value)}
        >
          <option value="todas">Todas las especialidades</option>
          <option value="psicologia">Psicología</option>
          <option value="lenguaje">Lenguaje</option>
          <option value="fisioterapia">Fisioterapia</option>
          <option value="ocupacional">Terapia ocupacional</option>
          <option value="sensorial">Integración sensorial</option>
        </select>

        <select
          className="ter-select"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="en-tratamiento">En tratamiento</option>
        </select>

        <button className="ter-new-btn">
          <span className="plus">+</span>
          Nuevo terapeuta
        </button>
      </section>

      {/* ============ TABLA ============ */}
      <section className="ter-table-card">
        <div className="ter-table-wrapper">
          <table className="ter-table">
            <thead>
              <tr>
                <th className="col-check"><input type="checkbox" /></th>
                <th className="col-num">N°</th>
                <th>Nombre completo</th>
                <th>Especialidad</th>
                <th>Estado</th>
                <th className="col-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {terapeutas.length === 0 && (
                <tr className="ter-empty-row">
                  <td colSpan="6">
                    <div className="ter-empty-msg">
                      <p>No hay terapeutas registrados</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ============ FOOTER DE TABLA ============ */}
        <div className="ter-table-footer">
          <span className="ter-footer-text">
            Mostrando 0 de {totalTerapeutas} terapeutas
          </span>

          <div className="ter-pagination">
            <button className="page-btn" disabled>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M15.4 7.4L14 6l-6 6 6 6 1.4-1.4L10.8 12z"/>
              </svg>
            </button>
            <button className="page-btn active">1</button>
            <button className="page-btn" disabled>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M8.6 16.6L10 18l6-6-6-6-1.4 1.4L13.2 12z"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}