import './PrediccionContent.css';
import { usePrediccionViewModel } from '../../hooks/usePrediccionViewModel';

/* Paleta de colores para las especialidades */
const PALETA = ['#ec4899', '#14b8a6', '#f5b400', '#a855f7'];

export function PrediccionContent() {
  const {
    datos,
    cargando,
    error,
    filtros,
    setFiltros,
    especialidades,
    terapeutas,
    recargar,
  } = usePrediccionViewModel();

  const kpis = datos?.kpis || {
    total_pacientes: 0,
    sesiones_pronosticadas: 0,
    demanda_promedio_diaria: 0,
    dias_mayor_demanda: [],
  };

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
          <p>Analiza la tendencia de pacientes y la demanda de sesiones para una mejor planificación de recursos.</p>
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
            <div className="pred-date-range">
              <input
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) => setFiltros.setFechaDesde(e.target.value)}
                className="pred-filter-input"
              />
              <span>a</span>
              <input
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) => setFiltros.setFechaHasta(e.target.value)}
                className="pred-filter-input"
              />
            </div>
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
              value={filtros.idEspecialidad}
              onChange={(e) => setFiltros.setIdEspecialidad(e.target.value)}
              className="pred-filter-input"
            >
              <option value="todas">Todas las especialidades</option>
              {especialidades.filter(e => e.estado).map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
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
              value={filtros.idTerapeuta}
              onChange={(e) => setFiltros.setIdTerapeuta(e.target.value)}
              className="pred-filter-input"
            >
              <option value="todos">Todos los terapeutas</option>
              {terapeutas.filter(t => t.estado).map((t) => (
                <option key={t.id} value={t.id}>{t.nombreCompleto}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="pred-update-btn" onClick={recargar} disabled={cargando}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M21 12a9 9 0 11-3-6.7M21 3v6h-6"/>
          </svg>
          {cargando ? 'Actualizando...' : 'Actualizar'}
        </button>
      </section>

      {error && <div className="pred-error-msg">⚠️ {error}</div>}

      {/* ============ KPIs ============ */}
      <section className="pred-kpi-grid">
        <div className="pred-kpi pink">
          <div className="pred-kpi-icon">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff">
              <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 1.9 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z"/>
            </svg>
          </div>
          <div className="pred-kpi-info">
            <span className="pred-kpi-label">Total de pacientes</span>
            <span className="pred-kpi-value">{cargando ? '...' : kpis.total_pacientes}</span>
            <span className="pred-kpi-trend pred-trend-info">En el rango seleccionado</span>
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
            <span className="pred-kpi-value">{cargando ? '...' : kpis.sesiones_pronosticadas}</span>
            <span className="pred-kpi-trend">↑ Según modelo ML</span>
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
              {cargando ? '...' : kpis.demanda_promedio_diaria} <small>sesiones/día</small>
            </span>
            <span className="pred-kpi-trend">↑ Según modelo ML</span>
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
            <span className="pred-kpi-value pred-kpi-value-sm">
              {cargando ? '...' : (kpis.dias_mayor_demanda.join(' - ') || 'Sin datos')}
            </span>
            <span className="pred-kpi-sub">Estimado para el rango</span>
          </div>
        </div>
      </section>

      {/* ============ GRÁFICO DE EVOLUCIÓN ============ */}
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
              <span className="pred-chart-sub">Comparativa de sesiones pronosticadas vs realizadas</span>
            </div>
          </div>
        </div>

        <div className="pred-chart-area">
          {/* Gráfico simplificado: dibujamos barras superpuestas para predicho vs real */}
          <div className="pred-chart-bars">
            {datos?.serie?.filter((v, i, a) => a.findIndex(t => t.fecha === v.fecha) === i).map((item, i) => {
              // Sumar predicciones y reales de todas las especialidades para ese día
              const predDia = datos.serie.filter(s => s.fecha === item.fecha).reduce((sum, s) => sum + s.pronosticadas, 0);
              const realDia = datos.serie.filter(s => s.fecha === item.fecha).reduce((sum, s) => sum + s.realizadas, 0);
              const maxVal = Math.max(...datos.serie.map(s => Math.max(s.pronosticadas, s.realizadas)), 10);
              
              return (
                <div className="pred-bar-group" key={i}>
                  <div className="pred-bar-wrapper">
                    <div className="pred-bar pred-bar-required" style={{ height: `${(predDia / maxVal) * 100}%` }}>
                      <span className="pred-bar-tooltip">{predDia.toFixed(1)}</span>
                    </div>
                    <div className="pred-bar pred-bar-real" style={{ height: `${(realDia / maxVal) * 100}%` }}>
                       <span className="pred-bar-tooltip">{realDia}</span>
                    </div>
                  </div>
                  <span className="pred-bar-label">{item.fecha.substring(5)}</span>
                </div>
              );
            })}
          </div>
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
              {cargando ? (
                <tr><td colSpan="5" className="text-center">Cargando datos...</td></tr>
              ) : !datos?.detalle_especialidad?.length ? (
                <tr><td colSpan="5" className="text-center">No hay datos disponibles</td></tr>
              ) : (
                datos.detalle_especialidad.map((esp, i) => (
                  <tr key={esp.id_especialidad}>
                    <td>
                      <span className="esp-dot" style={{ background: PALETA[i % PALETA.length] }}></span>
                      {esp.especialidad}
                    </td>
                    <td>{esp.pacientes_estimados}</td>
                    <td>{esp.sesiones_estimadas}</td>
                    <td>{esp.sesiones_realizadas}</td>
                    <td>
                      <div className="pred-progress-wrapper">
                        <div className="pred-progress-bar">
                          <div className="pred-progress-fill" style={{ width: `${Math.min(esp.cumplimiento, 100)}%`, background: PALETA[i % PALETA.length] }}></div>
                        </div>
                        <span className="pred-progress-text">{esp.cumplimiento}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}