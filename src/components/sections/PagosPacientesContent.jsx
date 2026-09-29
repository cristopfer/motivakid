import { useState } from 'react';
import './PagosPacientesContent.css';

export function PagosPacientesContent() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroMetodo, setFiltroMetodo] = useState('todos');

  /* Sin data por ahora */
  const pagos = [];
  const totalPagos = 0;

  return (
    <div className="pagos-pac-content">

      {/* ============ BANNER ============ */}
      <section className="ppac-banner">
        <div className="ppac-banner-icon">
          <svg viewBox="0 0 24 24" width="38" height="38" fill="#fff">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
          </svg>
        </div>

        <div className="ppac-banner-text">
          <h1>Pagos de Pacientes</h1>
          <p>Registra y consulta los pagos realizados por los pacientes del centro terapéutico.</p>
        </div>

        <span className="ppac-deco ppac-deco-confetti">🎉</span>
        <span className="ppac-deco ppac-deco-heart">♥</span>
        <span className="ppac-deco ppac-deco-star">★</span>

        <div className="ppac-banner-image"></div>
      </section>

      {/* ============ FILTROS ============ */}
      <section className="ppac-filters">
        <div className="ppac-search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#a855f7" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre de paciente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <select
          className="ppac-select"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          <option value="pagado">Pagado</option>
          <option value="pendiente">Pendiente</option>
        </select>

        <select
          className="ppac-select"
          value={filtroMetodo}
          onChange={(e) => setFiltroMetodo(e.target.value)}
        >
          <option value="todos">Todos los métodos de pago</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
          <option value="efectivo">Efectivo</option>
        </select>

        <button className="ppac-new-btn">
          <span className="plus">+</span>
          Registrar pago
        </button>
      </section>

      {/* ============ TABLA ============ */}
      <section className="ppac-table-card">
        <div className="ppac-table-wrapper">
          <table className="ppac-table">
            <thead>
              <tr>
                <th className="col-check"><input type="checkbox" /></th>
                <th className="col-num">N°</th>
                <th>
                  <span className="th-flex">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#a855f7">
                      <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
                    </svg>
                    Paciente
                  </span>
                </th>
                <th>
                  <span className="th-flex">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#a855f7">
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
                    </svg>
                    Fecha de pago
                  </span>
                </th>
                <th>
                  <span className="th-flex">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#a855f7">
                      <path d="M11.8 10.9c-2.3-.6-3-1.2-3-2.1 0-1 .9-1.8 2.5-1.8 1.6 0 2.2.8 2.3 1.9h2c-.1-1.6-1-3-2.9-3.5V3.5h-2.8v1.8c-1.8.4-3.2 1.5-3.2 3.4 0 2.2 1.8 3.3 4.5 4 2.4.6 2.9 1.4 2.9 2.3 0 .6-.5 1.7-2.5 1.7-1.9 0-2.6-.9-2.7-1.9h-2c.1 2 1.6 3.2 3.5 3.6v1.8h2.8v-1.8c1.8-.4 3.2-1.4 3.2-3.4 0-2.7-2.3-3.6-4.6-4.1z"/>
                    </svg>
                    Monto
                  </span>
                </th>
                <th>
                  <span className="th-flex">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#a855f7">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                    Método de pago
                  </span>
                </th>
                <th>
                  <span className="th-flex">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#a855f7">
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 11h-5v-2h3V6h2z"/>
                    </svg>
                    Estado
                  </span>
                </th>
                <th className="col-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagos.length === 0 && (
                <tr className="ppac-empty-row">
                  <td colSpan="8">
                    <div className="ppac-empty-msg">
                      <p>No hay pagos registrados</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="ppac-table-footer">
          <span className="ppac-footer-text">
            Mostrando 0 de {totalPagos} pagos
          </span>

          <div className="ppac-pagination">
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