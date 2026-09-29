import { useState } from 'react';
import './PrediccionContent.css';

export function PrediccionContent() {
  const [rangoFechas, setRangoFechas] = useState('01/09/2025 - 30/09/2025');
  const [especialidad, setEspecialidad] = useState('todas');
  const [terapeuta, setTerapeuta] = useState('todos');

  /* Sin data: todo en 0 */
  const kpis = {
    totalPacientes: 0,
    sesionesPronosticadas: 0,
    demandaPromedio: 0,
    diasMayorDemanda: '—',
  };

  /* Gráfico: series vacías (mantengo el eje para estructura visual) */
  const serieRequeridas = [];
  const serieRealizadas = [];

  /* Detalle por especialidad (sin valores) */
  const detalleEspecialidades = [
    { nombre: 'Psicología',              color: '#a855f7' },
    { nombre: 'Lenguaje',                color: '#14b8a6' },
    { nombre: 'Terapia de Aprendizaje',  color: '#f97316' },
    { nombre: 'Fisioterapia',            color: '#ec4899' },
    { nombre: 'Otros',                   color: '#22c55e' },
  ];

  return (
    <div className="pred-content">

      {/* ============ BANNER ============ */}
      <section className="pred-banner">
        <div className="pred-banner-icon">
          <svg viewBox="0 0 24 24" width="38" height="38" fill="#fff">
            <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
          </svg>
        </div>

        <div className="pred-banner-text">
          <h1>Predicción de Demanda</h1>
          <p>
            Analiza la tendencia de pacientes y la demanda de sesiones
            para una mejor planificación de recursos.
          </p>
        </div>

        <span className="pred-deco pred-deco-confetti">🎉</span>
        <span className="pred-deco pred-deco-heart">♥</span>
        <span className="pred-deco pred-deco-star">★</span>

        <div className="pred-banner-image"></div>
      </section>

      {/* ============ FILTROS ============ */}
      <section className="pred-filters">
        <div className="pred-filter">
          <div className="pred-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
            </svg>
          </div>
          <div className="pred-filter-fields">
            <label>Rango de fechas</label>
            <input
              type="text"
              value={rangoFechas}
              onChange={(e) => setRangoFechas(e.target.value)}
              className="pred-filter-input"
            />
          </div>
        </div>

        <div className="pred-filter">
          <div className="pred-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M12 17.3l-6.2 3.7 1.6-7.1L2 9.2l7.2-.6L12 2l2.8 6.6 7.2.6-5.4 4.7 1.6 7.1z"/>
            </svg>
          </div>
          <div className="pred-filter-fields">
            <label>Especialidad</label>
            <select
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              className="pred-filter-input"
            >
              <option value="todas">Todas las especialidades</option>
              <option value="psicologia">Psicología</option>
              <option value="lenguaje">Lenguaje</option>
              <option value="fisioterapia">Fisioterapia</option>
              <option value="otros">Otros</option>
            </select>
          </div>
        </div>

        <div className="pred-filter">
          <div className="pred-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
            </svg>
          </div>
          <div className="pred-filter-fields">
            <label>Terapeuta</label>
            <select
              value={terapeuta}
              onChange={(e) => setTerapeuta(e.target.value)}
              className="pred-filter-input"
            >
              <option value="todos">Todos los terapeutas</option>
            </select>
          </div>
        </div>

        <button className="pred-update-btn">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M21 12a9 9 0 11-3-6.7"/>
            <path d="M21 3v6h-6"/>
          </svg>
          Actualizar
        </button>
      </section>

      {/* ============ KPI CARDS ============ */}
      <section className="pred-kpi-grid">
        <div className="pred-kpi pink">
          <div className="pred-kpi-icon">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff">
              <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 1.9 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z"/>
            </svg>
          </div>
          <div className="pred-kpi-info">
            <span className="pred-kpi-label">Total de pacientes</span>
            <span className="pred-kpi-value">{kpis.totalPacientes}</span>
            <span className="pred-kpi-trend">↑ 0% <em>vs. mes anterior</em></span>
          </div>
        </div>

        <div className="pred-kpi blue">
          <div className="pred-kpi-icon">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
            </svg>
          </div>
          <div className="pred-kpi-info">
            <span className="pred-kpi-label">Sesiones pronosticadas</span>
            <span className="pred-kpi-value">{kpis.sesionesPronosticadas}</span>
            <span className="pred-kpi-trend">↑ 0% <em>vs. mes anterior</em></span>
          </div>
        </div>

        <div className="pred-kpi green">
          <div className="pred-kpi-icon">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
            </svg>
          </div>
          <div className="pred-kpi-info">
            <span className="pred-kpi-label">Demanda promedio diaria</span>
            <span className="pred-kpi-value">
              {kpis.demandaPromedio} <small>sesiones/día</small>
            </span>
            <span className="pred-kpi-trend">↑ 0% <em>vs. mes anterior</em></span>
          </div>
        </div>

        <div className="pred-kpi yellow">
          <div className="pred-kpi-icon">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 11h-5v-2h3V6h2z"/>
            </svg>
          </div>
          <div className="pred-kpi-info">
            <span className="pred-kpi-label">Días de mayor demanda</span>
            <span className="pred-kpi-value pred-kpi-value-sm">{kpis.diasMayorDemanda}</span>
            <span className="pred-kpi-sub">(Sin datos disponibles)</span>
          </div>
          <div className="pred-kpi-chart-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#f5b400">
              <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ============ GRÁFICO EVOLUCIÓN ============ */}
      <section className="pred-chart-card">
        <div className="pred-chart-header">
          <div className="pred-chart-title">
            <div className="pred-chart-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#a855f7">
                <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
              </svg>
            </div>
            <div>
              <h3>Evolución de la demanda</h3>
              <span className="pred-chart-sub">
                Comparativa de sesiones requeridas vs. sesiones realizadas.
              </span>
            </div>
          </div>

          <div className="pred-chart-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#7c3aed' }}></span>
              Sesiones requeridas (predicción)
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#14b8a6' }}></span>
              Sesiones realizadas
            </div>
          </div>
        </div>

        {/* Gráfico con ejes y sin puntos por falta de data */}
        <div className="pred-chart-area">
          <div className="pred-y-axis">
            <span>25</span><span>20</span><span>15</span><span>10</span><span>5</span><span>0</span>
          </div>
          <div className="pred-chart-plot">
            <div className="pred-grid-lines">
              <span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <div className="pred-chart-empty">
              No hay datos disponibles
            </div>
          </div>
        </div>

        <div className="pred-x-axis">
          <span>01/09</span><span>04/09</span><span>07/09</span><span>10/09</span>
          <span>13/09</span><span>16/09</span><span>19/09</span><span>22/09</span>
          <span>25/09</span><span>28/09</span><span>30/09</span>
        </div>
      </section>

      {/* ============ TABLA DETALLE ============ */}
      <section className="pred-table-card">
        <div className="pred-table-header">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
          </svg>
          <h3>Detalle por especialidad</h3>
        </div>

        <div className="pred-table-wrapper">
          <table className="pred-table">
            <thead>
              <tr>
                <th>Especialidad</th>
                <th>Pacientes estimados</th>
                <th>Sesiones estimadas</th>
                <th>Sesiones realizadas</th>
                <th>% Cumplimiento</th>
              </tr>
            </thead>
            <tbody>
              {detalleEspecialidades.map((esp, i) => (
                <tr key={i}>
                  <td>
                    <span className="esp-dot" style={{ background: esp.color }}></span>
                    {esp.nombre}
                  </td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>
                    <div className="pred-progress-wrapper">
                      <div className="pred-progress-bar">
                        <div
                          className="pred-progress-fill"
                          style={{ width: '0%', background: esp.color }}
                        ></div>
                      </div>
                      <span className="pred-progress-text">0%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}