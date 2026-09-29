import { useState } from 'react';
import './EspecialidadesContent.css';

export function EspecialidadesContent() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  /* Sin datos por ahora */
  const especialidades = [];
  const totalEspecialidades = 0;

  return (
    <div className="especialidades-content">

      {/* ============ BANNER ============ */}
      <section className="esp-banner">
        <div className="esp-banner-icon">
          <svg viewBox="0 0 24 24" width="38" height="38" fill="#fff">
            <path d="M12 17.3l-6.2 3.7 1.6-7.1L2 9.2l7.2-.6L12 2l2.8 6.6 7.2.6-5.4 4.7 1.6 7.1z"/>
          </svg>
        </div>

        <div className="esp-banner-text">
          <h1>Gestión de Especialidades</h1>
          <p>Registra, actualiza y elimina las especialidades, y asigna terapeutas a cada una.</p>
        </div>

        {/* Decoraciones del banner */}
        <span className="esp-deco esp-deco-confetti">🎉</span>
        <span className="esp-deco esp-deco-heart">♥</span>
        <span className="esp-deco esp-deco-star">★</span>

        <div className="esp-banner-image"></div>
      </section>

      {/* ============ BARRA DE FILTROS ============ */}
      <section className="esp-filters">
        <div className="esp-search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#a855f7" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre de especialidad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <select
          className="esp-select"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="en-tratamiento">En tratamiento</option>
        </select>

        <button className="esp-new-btn">
          <span className="plus">+</span>
          Nueva especialidad
        </button>
      </section>

      {/* ============ TABLA ============ */}
      <section className="esp-table-card">
        <div className="esp-table-wrapper">
          <table className="esp-table">
            <thead>
              <tr>
                <th className="col-check"><input type="checkbox" /></th>
                <th className="col-num">N°</th>
                <th>Especialidad</th>
                <th>Estado</th>
                <th className="col-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {especialidades.length === 0 && (
                <tr className="esp-empty-row">
                  <td colSpan="5">
                    <div className="esp-empty-msg">
                      <p>No hay especialidades registradas</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ============ FOOTER DE TABLA ============ */}
        <div className="esp-table-footer">
          <span className="esp-footer-text">
            Mostrando 0 de {totalEspecialidades} especialidades
          </span>

          <div className="esp-pagination">
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