import { useState } from 'react';
import './AgendaDiariaContent.css';

export function AgendaDiariaContent() {
  const [fecha, setFecha] = useState('2025-09-25');
  const [especialidad, setEspecialidad] = useState('todas');
  const [terapeuta, setTerapeuta] = useState('todos');

  /* Sin data por ahora */
  const citas = [];
  const totalCitas = 0;

  return (
    <div className="agenda-content">

      {/* ============ BANNER ============ */}
      <section className="agd-banner">
        <div className="agd-banner-icon">
          <svg viewBox="0 0 24 24" width="38" height="38" fill="#fff">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM7 12h5v5H7z"/>
          </svg>
        </div>

        <div className="agd-banner-text">
          <h1>Agenda Diaria</h1>
          <p>
            Visualiza las citas programadas para el día de hoy y registra la asistencia
            de cada paciente.
          </p>
        </div>

        <span className="agd-deco agd-deco-confetti">🎉</span>
        <span className="agd-deco agd-deco-star">★</span>

        <div className="agd-banner-image">
          <div className="agd-banner-sticker">
            <span>Pequeños avances,</span>
            <span>grandes logros</span>
          </div>
        </div>
      </section>

      {/* ============ FILTROS ============ */}
      <section className="agd-filters">
        <div className="agd-filter">
          <div className="agd-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
            </svg>
          </div>
          <div className="agd-filter-fields">
            <label>Fecha de la programación</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="agd-filter-input"
            />
          </div>
        </div>

        <div className="agd-filter">
          <div className="agd-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M12 17.3l-6.2 3.7 1.6-7.1L2 9.2l7.2-.6L12 2l2.8 6.6 7.2.6-5.4 4.7 1.6 7.1z"/>
            </svg>
          </div>
          <div className="agd-filter-fields">
            <label>Especialidad</label>
            <select
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              className="agd-filter-input"
            >
              <option value="todas">Todas las especialidades</option>
              <option value="fisioterapia">Fisioterapia</option>
              <option value="lenguaje">Lenguaje</option>
              <option value="psicologia">Psicología</option>
              <option value="ocupacional">Terapia ocupacional</option>
            </select>
          </div>
        </div>

        <div className="agd-filter">
          <div className="agd-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
            </svg>
          </div>
          <div className="agd-filter-fields">
            <label>Terapeuta</label>
            <select
              value={terapeuta}
              onChange={(e) => setTerapeuta(e.target.value)}
              className="agd-filter-input"
            >
              <option value="todos">Todos los terapeutas</option>
            </select>
          </div>
        </div>

        <button className="agd-view-btn">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
          </svg>
          Ver agenda
        </button>
      </section>

      {/* ============ CARD PRINCIPAL ============ */}
      <section className="agd-card">

        {/* Header morado */}
        <div className="agd-card-header">
          <div className="agd-header-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#a855f7">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
            </svg>
          </div>
          <h2 className="agd-header-title">Sin especialidad</h2>
          <span className="agd-header-sep">—</span>
          <span className="agd-header-subtitle">Sin terapeuta asignado</span>
        </div>

        {/* Tabla */}
        <div className="agd-table-wrapper">
          <table className="agd-table">
            <thead>
              <tr>
                <th className="col-hora">
                  <span className="th-flex">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#a855f7">
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 11h-5v-2h3V6h2z"/>
                    </svg>
                    Hora
                  </span>
                </th>
                <th>
                  <span className="th-flex">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#a855f7">
                      <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
                    </svg>
                    Nombre paciente
                  </span>
                </th>
                <th className="col-control">
                  <span className="th-flex">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#a855f7">
                      <path d="M19.4 13a7.9 7.9 0 000-2l2.1-1.6-2-3.4-2.5 1a8 8 0 00-1.7-1L15 3.5h-4l-.3 2.5c-.6.3-1.2.6-1.7 1l-2.5-1-2 3.4L6.6 11a7.9 7.9 0 000 2l-2.1 1.6 2 3.4 2.5-1c.5.4 1.1.8 1.7 1l.3 2.5h4l.3-2.5c.6-.3 1.2-.6 1.7-1l2.5 1 2-3.4zM13 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/>
                    </svg>
                    Control
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {citas.length === 0 && (
                <tr className="agd-empty-row">
                  <td colSpan="3">
                    <div className="agd-empty-msg">
                      <p>No hay citas programadas para este día</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="agd-card-footer">
          <span className="agd-footer-text">
            Mostrando 0 de {totalCitas} citas
          </span>
        </div>

      </section>

    </div>
  );
}