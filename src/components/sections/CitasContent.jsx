import { useState } from 'react';
import './CitasContent.css';

export function CitasContent() {
  const [filtroFecha, setFiltroFecha] = useState('22/09/2025 - 28/09/2025');
  const [filtroPaciente, setFiltroPaciente] = useState('');
  const [filtroTerapeuta, setFiltroTerapeuta] = useState('todos');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('todas');

  /* Sin data por ahora */
  const citasDelDia = [];
  const totalCitas = 0;

  /* Resumen semanal (todo en 0) */
  const resumen = {
    total: 0,
    confirmadas: 0,
    pendientes: 0,
    canceladas: 0,
  };

  /* Septiembre 2025: arranca en lunes (1) y termina en martes (30) */
  const diasMes = Array.from({ length: 30 }, (_, i) => i + 1);
  const primerDiaSemana = 1; // lunes = 0
  const diasVaciosInicio = primerDiaSemana;

  const nombresDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="citas-content">

      {/* ============ BANNER ============ */}
      <section className="cit-banner">
        <div className="cit-banner-icon">
          <svg viewBox="0 0 24 24" width="38" height="38" fill="#fff">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM7 12h5v5H7z"/>
          </svg>
        </div>

        <div className="cit-banner-text">
          <h1>Gestión de Citas</h1>
          <p>Programa, visualiza y administra las citas de los pacientes con sus terapeutas.</p>
        </div>

        <span className="cit-deco cit-deco-confetti">🎉</span>
        <span className="cit-deco cit-deco-star">★</span>

        <div className="cit-banner-image">
          <div className="cit-banner-sticker">
            <span>Pequeños avances,</span>
            <span>grandes logros</span>
          </div>
        </div>
      </section>

      {/* ============ FILTROS HORIZONTALES ============ */}
      <section className="cit-filters">
        <div className="cit-filter">
          <div className="cit-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
            </svg>
          </div>
          <div className="cit-filter-fields">
            <label>Rango de fechas</label>
            <input
              type="text"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="cit-filter-input"
            />
          </div>
        </div>

        <div className="cit-filter">
          <div className="cit-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
            </svg>
          </div>
          <div className="cit-filter-fields">
            <label>Paciente</label>
            <select
              value={filtroPaciente}
              onChange={(e) => setFiltroPaciente(e.target.value)}
              className="cit-filter-input"
            >
              <option value="">Buscar paciente...</option>
            </select>
          </div>
        </div>

        <div className="cit-filter">
          <div className="cit-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
            </svg>
          </div>
          <div className="cit-filter-fields">
            <label>Terapeuta</label>
            <select
              value={filtroTerapeuta}
              onChange={(e) => setFiltroTerapeuta(e.target.value)}
              className="cit-filter-input"
            >
              <option value="todos">Todos los terapeutas</option>
            </select>
          </div>
        </div>

        <div className="cit-filter">
          <div className="cit-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M12 17.3l-6.2 3.7 1.6-7.1L2 9.2l7.2-.6L12 2l2.8 6.6 7.2.6-5.4 4.7 1.6 7.1z"/>
            </svg>
          </div>
          <div className="cit-filter-fields">
            <label>Especialidad</label>
            <select
              value={filtroEspecialidad}
              onChange={(e) => setFiltroEspecialidad(e.target.value)}
              className="cit-filter-input"
            >
              <option value="todas">Todas las especialidades</option>
              <option value="fisioterapia">Fisioterapia</option>
              <option value="lenguaje">Lenguaje</option>
              <option value="psicologia">Psicología</option>
              <option value="ocupacional">Terapia ocupacional</option>
            </select>
          </div>
        </div>

        <button className="cit-agendar-btn">Agendar Cita</button>
      </section>

      {/* ============ LAYOUT TRES COLUMNAS ============ */}
      <section className="cit-layout">

        {/* ---- Columna 1: Calendario + Resumen ---- */}
        <div className="cit-col-calendar">

          {/* Calendario */}
          <div className="cit-card">
            <div className="cit-card-header">
              <div className="cit-card-title">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
                </svg>
                <h3>Calendario</h3>
              </div>
              <div className="cit-month-nav">
                <span className="month-label">Septiembre 2025</span>
                <button className="nav-btn" disabled>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                    <path d="M15.4 7.4L14 6l-6 6 6 6 1.4-1.4L10.8 12z"/>
                  </svg>
                </button>
                <button className="nav-btn" disabled>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                    <path d="M8.6 16.6L10 18l6-6-6-6-1.4 1.4L13.2 12z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="cit-calendar">
              <div className="cal-days-header">
                {nombresDias.map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
              </div>
              <div className="cal-grid">
                {Array.from({ length: diasVaciosInicio }).map((_, i) => (
                  <span key={`v-${i}`} className="cal-cell empty"></span>
                ))}
                {diasMes.map((d) => (
                  <span key={d} className="cal-cell">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="cit-legend">
              <div className="legend-item"><span className="legend-dot" style={{ background: '#ec4899' }}></span>Fisioterapia</div>
              <div className="legend-item"><span className="legend-dot" style={{ background: '#14b8a6' }}></span>Lenguaje</div>
              <div className="legend-item"><span className="legend-dot" style={{ background: '#f5b400' }}></span>Psicología</div>
              <div className="legend-item"><span className="legend-dot" style={{ background: '#a855f7' }}></span>Otros</div>
            </div>
          </div>

          {/* Resumen semanal */}
          <div className="cit-card">
            <div className="cit-card-header">
              <div className="cit-card-title">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
                </svg>
                <h3>Resumen de la semana</h3>
              </div>
            </div>

            <div className="cit-resumen-grid">
              <div className="resumen-item purple">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="#a855f7">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
                </svg>
                <span className="resumen-value">{resumen.total}</span>
                <span className="resumen-label">Total citas</span>
              </div>

              <div className="resumen-item green">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="#22c55e">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
                </svg>
                <span className="resumen-value">{resumen.confirmadas}</span>
                <span className="resumen-label">Confirmadas</span>
              </div>

              <div className="resumen-item yellow">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="#f5b400">
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2zm0-4h-2V7h2z"/>
                </svg>
                <span className="resumen-value">{resumen.pendientes}</span>
                <span className="resumen-label">Pendientes</span>
              </div>

              <div className="resumen-item pink">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="#e91e63">
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm5 13.6L15.6 17 12 13.4 8.4 17 7 15.6 10.6 12 7 8.4 8.4 7 12 10.6 15.6 7 17 8.4 13.4 12z"/>
                </svg>
                <span className="resumen-value">{resumen.canceladas}</span>
                <span className="resumen-label">Canceladas</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Columna 2: Lista de citas ---- */}
        <div className="cit-card cit-col-list">
          <div className="cit-card-header">
            <div className="cit-card-title">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#a855f7">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
              </svg>
              <h3>Citas del — de — de ——</h3>
            </div>
            <span className="cit-count-badge">{totalCitas} citas</span>
          </div>

          <div className="cit-list">
            {citasDelDia.length === 0 ? (
              <p className="cit-empty-msg">No hay citas para este día</p>
            ) : (
              citasDelDia.map((c, i) => (
                <div className="cit-item" key={i}>...</div>
              ))
            )}
          </div>
        </div>

        {/* ---- Columna 3: Detalle de la cita ---- */}
        <div className="cit-card cit-col-detail">
          <div className="cit-card-header">
            <div className="cit-card-title">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#a855f7">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
              </svg>
              <h3>Detalle de la cita</h3>
            </div>
          </div>

          <p className="cit-detail-empty">Selecciona una cita para ver su detalle</p>

          <div className="cit-detail-actions">
            <button className="action-btn" disabled>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
              </svg>
              Ver perfil
            </button>
            <button className="action-btn" disabled>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
              </svg>
              Reprogramar
            </button>
            <button className="action-btn danger" disabled>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              Cancelar
            </button>
          </div>
        </div>

      </section>
    </div>
  );
}