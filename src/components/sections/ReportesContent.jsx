import { useState } from 'react';
import './ReportesContent.css';

export function ReportesContent() {
  const [filtroPaciente, setFiltroPaciente] = useState('');
  const [filtroTerapeuta, setFiltroTerapeuta] = useState('');
  const [rangoFechas, setRangoFechas] = useState('01/09/2025 - 30/09/2025');

  /* Sin data por ahora */
  const registrosPaciente = [];
  const registrosTerapeuta = [];

  /* Determina el tipo de selección */
  const tipoSeleccion = filtroPaciente
    ? 'paciente'
    : filtroTerapeuta
    ? 'terapeuta'
    : null;

  const registros = tipoSeleccion === 'paciente' ? registrosPaciente : registrosTerapeuta;
  const totalRegistros = registros.length;

  /* Info del resumen (placeholder) */
  const resumen = {
    nombre: 'Sin selección',
    rol: '—',
    metrica1: { label: 'Total de pagos', value: 'S/ 0.00' },
    metrica2: { label: 'Pagos realizados', value: '0' },
    metrica3: { label: 'Pagos pendientes', value: '0' },
  };

  /* Cambia etiquetas según el tipo */
  if (tipoSeleccion === 'terapeuta') {
    resumen.rol = 'Terapeuta';
    resumen.metrica2 = { label: 'Pacientes atendidos', value: '0' };
    resumen.metrica3 = { label: 'Pagos realizados', value: '0' };
  } else if (tipoSeleccion === 'paciente') {
    resumen.rol = 'Paciente';
    resumen.metrica2 = { label: 'Pacientes atendidos', value: '0' };
    resumen.metrica3 = { label: 'Pagos realizados', value: '0' };
  }

  return (
    <div className="reportes-content">

      {/* ============ BANNER ============ */}
      <section className="rep-banner">
        <div className="rep-banner-icon">
          <svg viewBox="0 0 24 24" width="38" height="38" fill="#fff">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        </div>

        <div className="rep-banner-text">
          <h1>Reporte de Pagos</h1>
          <p>
            Visualiza el historial de pagos de pacientes y terapeutas, filtra por paciente
            o terapeuta y consulta el detalle de cada registro.
          </p>
        </div>

        <span className="rep-deco rep-deco-confetti">🎉</span>
        <span className="rep-deco rep-deco-heart">♥</span>
        <span className="rep-deco rep-deco-star">★</span>

        <div className="rep-banner-image"></div>
      </section>

      {/* ============ FILTROS ============ */}
      <section className="rep-filters">
        <div className="rep-filter">
          <div className="rep-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
            </svg>
          </div>
          <div className="rep-filter-fields">
            <label>Paciente</label>
            <select
              value={filtroPaciente}
              onChange={(e) => {
                setFiltroPaciente(e.target.value);
                if (e.target.value) setFiltroTerapeuta('');
              }}
              className="rep-filter-input"
            >
              <option value="">Selecciona un paciente</option>
            </select>
          </div>
        </div>

        <div className="rep-filter">
          <div className="rep-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
            </svg>
          </div>
          <div className="rep-filter-fields">
            <label>Terapeuta</label>
            <select
              value={filtroTerapeuta}
              onChange={(e) => {
                setFiltroTerapeuta(e.target.value);
                if (e.target.value) setFiltroPaciente('');
              }}
              className="rep-filter-input"
            >
              <option value="">Selecciona un terapeuta</option>
            </select>
          </div>
        </div>

        <button className="rep-generate-btn">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.3-4.3"/>
          </svg>
          Generar reporte
        </button>
      </section>

      {/* ============ CARD DE RESUMEN ============ */}
      <section className="rep-summary-card">
        <div className="rep-summary-left">
          <div className="rep-summary-avatar">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
            </svg>
          </div>
          <div className="rep-summary-info">
            <h2>{resumen.nombre}</h2>
            <span className="rep-summary-role">{resumen.rol}</span>
          </div>
        </div>

        <div className="rep-summary-metrics">
          <div className="rep-metric">
            <div className="rep-metric-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#a855f7">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
              </svg>
            </div>
            <div className="rep-metric-info">
              <span className="rep-metric-label">{resumen.metrica1.label}</span>
              <span className="rep-metric-value">{resumen.metrica1.value}</span>
            </div>
          </div>

          <div className="rep-metric">
            <div className="rep-metric-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#a855f7">
                <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 1.9 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z"/>
              </svg>
            </div>
            <div className="rep-metric-info">
              <span className="rep-metric-label">{resumen.metrica2.label}</span>
              <span className="rep-metric-value">{resumen.metrica2.value}</span>
            </div>
          </div>

          <div className="rep-metric">
            <div className="rep-metric-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#a855f7">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.4 13.6L6.6 11.6 8 10.2l2.6 2.6L17 6.4l1.4 1.4z"/>
              </svg>
            </div>
            <div className="rep-metric-info">
              <span className="rep-metric-label">{resumen.metrica3.label}</span>
              <span className="rep-metric-value">{resumen.metrica3.value}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TABLA ============ */}
      <section className="rep-table-card">
        <div className="rep-table-wrapper">
          <table className="rep-table">
            <thead>
              <tr>
                <th className="col-check"><input type="checkbox" /></th>
                <th className="col-num">#</th>
                <th>
                  <span className="th-flex">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#a855f7">
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
                    </svg>
                    Fecha
                  </span>
                </th>

                {/* Columna dinámica */}
                {tipoSeleccion === 'terapeuta' && (
                  <>
                    <th>
                      <span className="th-flex">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="#a855f7">
                          <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
                        </svg>
                        Terapeuta
                      </span>
                    </th>
                    <th>
                      <span className="th-flex">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="#a855f7">
                          <path d="M12 17.3l-6.2 3.7 1.6-7.1L2 9.2l7.2-.6L12 2l2.8 6.6 7.2.6-5.4 4.7 1.6 7.1z"/>
                        </svg>
                        Especialidad
                      </span>
                    </th>
                  </>
                )}

                {tipoSeleccion === 'paciente' && (
                  <th>
                    <span className="th-flex">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="#a855f7">
                        <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
                      </svg>
                      Pacientes atendidos
                    </span>
                  </th>
                )}

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
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.4 13.6L6.6 11.6 8 10.2l2.6 2.6L17 6.4l1.4 1.4z"/>
                    </svg>
                    Estado
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {!tipoSeleccion ? (
                <tr className="rep-empty-row">
                  <td colSpan="7">
                    <div className="rep-empty-msg">
                      <p>Selecciona un paciente o terapeuta para ver el reporte</p>
                    </div>
                  </td>
                </tr>
              ) : registros.length === 0 ? (
                <tr className="rep-empty-row">
                  <td colSpan="7">
                    <div className="rep-empty-msg">
                      <p>No hay registros para mostrar</p>
                    </div>
                  </td>
                </tr>
              ) : (
                registros.map((r, i) => (
                  <tr key={i}>...</tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="rep-table-footer">
          <span className="rep-footer-text">
            Mostrando 0 de {totalRegistros} registros
          </span>

          <div className="rep-pagination">
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