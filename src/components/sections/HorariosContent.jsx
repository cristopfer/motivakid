import { useState } from 'react';
import './HorariosContent.css';

export function HorariosContent() {
  const [fecha, setFecha] = useState('2025-09-23');
  const [franja, setFranja] = useState('manana');
  const [especialidad, setEspecialidad] = useState('todas');

  /* Sin data por ahora */
  const horarios = []; // cada item: { hora, dia, terapeuta, paciente, especialidad }

  const dias = [
    { nombre: 'Lunes',     fecha: '' },
    { nombre: 'Martes',    fecha: '' },
    { nombre: 'Miércoles', fecha: '' },
    { nombre: 'Jueves',    fecha: '' },
    { nombre: 'Viernes',   fecha: '' },
    { nombre: 'Sábado',    fecha: '' },
    { nombre: 'Domingo',   fecha: '' },
  ];

  const horas = [
    '08:00 – 08:40',
    '09:00 – 09:40',
    '10:00 – 10:40',
    '11:00 – 11:40',
    '14:00 – 14:40',
    '15:00 – 15:40',
    '16:00 – 16:40',
  ];

  return (
    <div className="horarios-content">

      {/* ============ BANNER ============ */}
      <section className="hor-banner">
        <div className="hor-banner-icon">
          <svg viewBox="0 0 24 24" width="38" height="38" fill="#fff">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 11h-5v-2h3V6h2z"/>
          </svg>
        </div>

        <div className="hor-banner-text">
          <h1>Horarios de Atención</h1>
          <p>
            Visualiza la programación de los horarios de atención de cada terapeuta
            y paciente. Se generarán los horarios para el día siguiente.
          </p>
        </div>

        <span className="hor-deco hor-deco-confetti">🎉</span>
        <span className="hor-deco hor-deco-star">★</span>

        <div className="hor-banner-image">
          <div className="hor-banner-sticker">
            <span>Cada sesión</span>
            <span>cuenta</span>
            <span className="sticker-heart">♥</span>
          </div>
        </div>
      </section>

      {/* ============ FILTROS ============ */}
      <section className="hor-filters">
        <div className="hor-filter-group">
          <div className="hor-filter-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#a855f7">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM7 12h5v5H7z"/>
            </svg>
          </div>
          <div className="hor-filter-fields">
            <label>Fecha de la programación</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="hor-date-input"
            />
            <select
              value={franja}
              onChange={(e) => setFranja(e.target.value)}
              className="hor-franja-select"
            >
              <option value="manana">Mañana</option>
              <option value="tarde">Tarde</option>
            </select>
          </div>
        </div>

        <div className="hor-filter-group">
          <div className="hor-filter-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#a855f7">
              <path d="M12 17.3l-6.2 3.7 1.6-7.1L2 9.2l7.2-.6L12 2l2.8 6.6 7.2.6-5.4 4.7 1.6 7.1z"/>
            </svg>
          </div>
          <div className="hor-filter-fields">
            <label>Especialidad</label>
            <select
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              className="hor-esp-select"
            >
              <option value="todas">Todas las especialidades</option>
              <option value="fisioterapia">Fisioterapia</option>
              <option value="lenguaje">Lenguaje</option>
              <option value="psicologia">Psicología</option>
              <option value="otros">Otros</option>
            </select>
          </div>
        </div>

        <button className="hor-generate-btn">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
          </svg>
          Generar horarios para el día siguiente
          <span className="arrow">→</span>
        </button>
      </section>

      {/* ============ TABLA PRINCIPAL ============ */}
      <section className="hor-table-card">

        {/* Header de la tarjeta */}
        <div className="hor-card-header">
          <div className="hor-card-title">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#a855f7">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM7 12h5v5H7z"/>
            </svg>
            <div>
              <h3>Horario de atención</h3>
              <span className="hor-card-sub">Semana del — al —</span>
            </div>
          </div>

          <div className="hor-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#ec4899' }}></span>
              Fisioterapia
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#14b8a6' }}></span>
              Lenguaje
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#f5b400' }}></span>
              Psicología
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#a855f7' }}></span>
              Otros
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="hor-table-wrapper">
          <table className="hor-table">
            <thead>
              <tr>
                <th className="col-hora">Hora</th>
                {dias.map((d, i) => (
                  <th key={i}>
                    <span className="day-name">{d.nombre}</span>
                    <span className="day-date">{d.fecha}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horas.map((hora, hi) => (
                <tr key={hi}>
                  <td className="col-hora">{hora}</td>
                  {dias.map((_, di) => (
                    <td key={di} className="hor-cell-empty">—</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nota */}
        <div className="hor-note">
          <span className="note-icon">ℹ️</span>
          <p>
            Los horarios se generan automáticamente para el día siguiente,
            considerando la disponibilidad de cada terapeuta.
          </p>
        </div>

      </section>

    </div>
  );
}