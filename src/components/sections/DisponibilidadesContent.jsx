import { useState } from 'react';
import './DisponibilidadesContent.css';

export function DisponibilidadesContent() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  /* Sin datos por ahora */
  const terapeutas = [];
  const terapeutaSeleccionado = null;

  /* Encabezados de la tabla semanal (fijos visualmente) */
  const dias = [
    { nombre: 'Lunes', fecha: '' },
    { nombre: 'Martes', fecha: '' },
    { nombre: 'Miércoles', fecha: '' },
    { nombre: 'Jueves', fecha: '' },
    { nombre: 'Viernes', fecha: '' },
    { nombre: 'Sábado', fecha: '' },
  ];

  return (
    <div className="disponibilidades-content">

      {/* ============ BANNER ============ */}
      <section className="disp-banner">
        <div className="disp-banner-icon">
          <svg viewBox="0 0 24 24" width="38" height="38" fill="#fff">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM7 12h5v5H7z"/>
          </svg>
        </div>

        <div className="disp-banner-text">
          <h1>Disponibilidad de Terapeutas</h1>
          <p>
            Gestiona los horarios de atención de los terapeutas
            y mantén actualizada su disponibilidad semanal.
          </p>
        </div>

        <span className="disp-deco disp-deco-confetti">🎉</span>
        <span className="disp-deco disp-deco-heart">♥</span>
        <span className="disp-deco disp-deco-star">★</span>

        <div className="disp-banner-image">
          <div className="disp-banner-sticker">
            <span>Cada niño</span>
            <span>merece un gran</span>
            <span>acompañamiento</span>
          </div>
        </div>
      </section>

      {/* ============ BARRA DE FILTROS ============ */}
      <section className="disp-filters">
        <div className="disp-search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#a855f7" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar terapeuta..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <select
          className="disp-select"
          value={filtroEspecialidad}
          onChange={(e) => setFiltroEspecialidad(e.target.value)}
        >
          <option value="todas">Todas las especialidades</option>
          <option value="lenguaje">Lenguaje</option>
          <option value="fisioterapia">Fisioterapia</option>
          <option value="psicologia">Psicología</option>
          <option value="ocupacional">Terapia ocupacional</option>
        </select>

        <select
          className="disp-select"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <button className="disp-new-btn">
          <span className="plus">+</span>
          Registrar disponibilidad
        </button>
      </section>

      {/* ============ LAYOUT DOS COLUMNAS ============ */}
      <section className="disp-layout">

        {/* ---- Columna izquierda: lista de terapeutas ---- */}
        <aside className="disp-list-card">
          <div className="disp-list-header">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 1.9 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z"/>
            </svg>
            <h3>Terapeutas</h3>
          </div>

          <div className="disp-list-body">
            {terapeutas.length === 0 ? (
              <p className="disp-empty-list">No hay terapeutas</p>
            ) : (
              terapeutas.map((t, i) => (
                <button className="disp-item" key={i}>...</button>
              ))
            )}
          </div>
        </aside>

        {/* ---- Columna derecha: detalle de disponibilidad ---- */}
        <div className="disp-detail-card">

          {/* Cabecera del detalle */}
          <div className="disp-detail-header">
            <div className="disp-avatar">
              {terapeutaSeleccionado ? terapeutaSeleccionado.iniciales : '--'}
            </div>

            <div className="disp-detail-info">
              <h2>{terapeutaSeleccionado?.nombre || 'Sin terapeuta seleccionado'}</h2>
              <span className="disp-detail-sub">
                {terapeutaSeleccionado?.especialidad || '—'}
              </span>
            </div>

            <div className="disp-detail-block">
              <span className="block-label">Especialidad principal</span>
              <span className="block-value">
                {terapeutaSeleccionado?.especialidad || '—'}
              </span>
            </div>

            <div className="disp-detail-block">
              <span className="block-label">Estado</span>
              <span className="block-value">—</span>
            </div>

            <button className="disp-edit-btn">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75zM20.7 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75z"/>
              </svg>
              Editar disponibilidad
            </button>
          </div>

          {/* Encabezado de horarios */}
          <div className="disp-hours-header">
            <div className="disp-hours-title">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
              </svg>
              <h3>Horarios de atención</h3>
            </div>

            <div className="disp-week-nav">
              <span className="week-label">Semana del — al —</span>
              <button className="week-btn" disabled>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M15.4 7.4L14 6l-6 6 6 6 1.4-1.4L10.8 12z"/>
                </svg>
              </button>
              <button className="week-btn" disabled>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M8.6 16.6L10 18l6-6-6-6-1.4 1.4L13.2 12z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Tabla de horarios (estructura visible, sin data) */}
          <div className="disp-table-wrapper">
            <table className="disp-table">
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
                <tr>
                  <td colSpan={7} className="disp-table-empty">
                    No hay disponibilidad registrada para este terapeuta
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mensaje informativo */}
          <div className="disp-note">
            <span className="note-icon">ℹ️</span>
            <p>
              Los horarios disponibles se utilizan para la programación de citas.
              Puedes actualizar la disponibilidad en cualquier momento.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}