import { useState, useMemo, useEffect } from 'react';
import './ReportesContent.css';
import { usePacientesViewModel } from '../../hooks/usePacientesViewModel';
import { useTerapeutasViewModel } from '../../hooks/useTerapeutasViewModel';
import { useReportesViewModel } from '../../hooks/useReportesViewModel';
import { generarReportePDF } from '../../utils/reportePdf';

/* Helpers */
function formatearFecha(fecha) {
  if (!fecha) return '—';
  const s = String(fecha).substring(0, 10);
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
}

function claseEstado(estado) {
  const e = String(estado || '').toLowerCase();
  if (e.includes('pagado')) return 'pagado';
  if (e.includes('pendien')) return 'pendiente';
  if (e.includes('anulad') || e.includes('cancel')) return 'anulado';
  return 'default';
}

const REGISTROS_POR_PAGINA = 8;

export function ReportesContent() {
  const [filtroPaciente, setFiltroPaciente] = useState('');
  const [filtroTerapeuta, setFiltroTerapeuta] = useState('');

  const [paginaActual, setPaginaActual] = useState(1);

  const { pacientes } = usePacientesViewModel();
  const { terapeutas } = useTerapeutasViewModel();

  const {
    registros,
    cargando,
    error,
    tipo,
    cargarReportePaciente,
    cargarReporteTerapeuta,
    limpiar,
  } = useReportesViewModel();

  /* Cargar reporte cuando cambia la selección */
  useEffect(() => {
    if (filtroPaciente) {
      cargarReportePaciente(Number(filtroPaciente));
    } else if (filtroTerapeuta) {
      cargarReporteTerapeuta(Number(filtroTerapeuta));
    } else {
      limpiar();
    }
  }, [filtroPaciente, filtroTerapeuta, cargarReportePaciente, cargarReporteTerapeuta, limpiar]);

  /* Paginación */
  const totalPaginas = Math.ceil(registros.length / REGISTROS_POR_PAGINA);
  const indiceUltimo = paginaActual * REGISTROS_POR_PAGINA;
  const indicePrimero = indiceUltimo - REGISTROS_POR_PAGINA;
  const registrosPaginados = registros.slice(indicePrimero, indiceUltimo);

  useEffect(() => {
    setPaginaActual(1);
  }, [filtroPaciente, filtroTerapeuta]);

  /* Datos del resumen */
  const pacienteActual = useMemo(
    () => pacientes.find((p) => String(p.id) === String(filtroPaciente)),
    [pacientes, filtroPaciente]
  );

  const terapeutaActual = useMemo(
    () => terapeutas.find((t) => String(t.id) === String(filtroTerapeuta)),
    [terapeutas, filtroTerapeuta]
  );

  /* Estadísticas rápidas */
  //const totalRegistros = registros.length;
  const totalMonto = registros.reduce((sum, r) => sum + Number(r.monto || 0), 0);
  const pagados = registros.filter((r) => String(r.estado_pago).toLowerCase() === 'pagado').length;
  const pendientes = registros.filter((r) => String(r.estado_pago).toLowerCase() === 'pendiente').length;

  const haySeleccion = filtroPaciente || filtroTerapeuta;

  const irPaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };
  const irPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };
  
  const handleGenerarPDF = () => {
    if (!tipo) {
      alert('Selecciona un paciente o terapeuta primero');
      return;
    }
    if (registros.length === 0) {
      alert('No hay registros para generar el reporte');
      return;
    }

    const nombre =
      tipo === 'paciente'
        ? pacienteActual?.nombreCompleto
        : terapeutaActual?.nombreCompleto;

    generarReportePDF({
      tipo,
      nombre,
      registros,
      totales: {
        totalMonto,
        pagados,
        pendientes,
      },
    });
  };

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
              {pacientes.filter((p) => p.estado).map((p) => (
                <option key={p.id} value={String(p.id)}>{p.nombreCompleto}</option>
              ))}
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
              {terapeutas.filter((t) => t.estado).map((t) => (
                <option key={t.id} value={String(t.id)}>{t.nombreCompleto}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          className="rep-generate-btn"
          onClick={handleGenerarPDF}
          disabled={!tipo || registros.length === 0}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          Generar Reporte
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
            <h2>
              {tipo === 'paciente' && pacienteActual?.nombreCompleto}
              {tipo === 'terapeuta' && terapeutaActual?.nombreCompleto}
              {!tipo && 'Sin selección'}
            </h2>
            <span className="rep-summary-role">
              {tipo === 'paciente' && 'Paciente'}
              {tipo === 'terapeuta' && 'Terapeuta'}
              {!tipo && '—'}
            </span>
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
              <span className="rep-metric-label">Total de pagos</span>
              <span className="rep-metric-value">S/ {totalMonto.toFixed(2)}</span>
            </div>
          </div>

          <div className="rep-metric">
            <div className="rep-metric-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#a855f7">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.4 13.6L6.6 11.6 8 10.2l2.6 2.6L17 6.4l1.4 1.4z"/>
              </svg>
            </div>
            <div className="rep-metric-info">
              <span className="rep-metric-label">Pagos realizados</span>
              <span className="rep-metric-value">{pagados}</span>
            </div>
          </div>

          <div className="rep-metric">
            <div className="rep-metric-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#a855f7">
                <path d="M11 7h2v6h-2zm0 8h2v2h-2zm1-14C6.5 1 2 5.5 2 11s4.5 10 10 10 10-4.5 10-10S17.5 1 12 1z"/>
              </svg>
            </div>
            <div className="rep-metric-info">
              <span className="rep-metric-label">Pagos pendientes</span>
              <span className="rep-metric-value">{pendientes}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TABLA ============ */}
      <section className="rep-table-card">
        <div className="rep-table-wrapper">
          <table className="rep-table">
            {/* Cabecera dinámica */}
            {tipo === 'paciente' && (
              <thead>
                <tr>
                  <th>Fecha de la cita</th>
                  <th>Terapeuta</th>
                  <th>Especialidad</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
            )}

            {tipo === 'terapeuta' && (
              <thead>
                <tr>
                  <th>Fecha de la cita</th>
                  <th>Paciente</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
            )}

            {!tipo && (
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Detalle</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
            )}

            <tbody>
              {!haySeleccion ? (
                <tr className="rep-empty-row">
                  <td colSpan="5">
                    <div className="rep-empty-msg">
                      <p>Selecciona un paciente o terapeuta para ver el reporte</p>
                    </div>
                  </td>
                </tr>
              ) : cargando ? (
                <tr className="rep-empty-row">
                  <td colSpan="5">
                    <div className="rep-empty-msg"><p>Cargando reporte...</p></div>
                  </td>
                </tr>
              ) : error ? (
                <tr className="rep-empty-row">
                  <td colSpan="5">
                    <div className="rep-empty-msg"><p style={{ color: '#e91e63' }}>{error}</p></div>
                  </td>
                </tr>
              ) : registrosPaginados.length === 0 ? (
                <tr className="rep-empty-row">
                  <td colSpan="5">
                    <div className="rep-empty-msg"><p>No hay registros para mostrar</p></div>
                  </td>
                </tr>
              ) : (
                registrosPaginados.map((r, i) => (
                  <tr key={i}>
                    <td>{formatearFecha(r.fecha_cita)}</td>

                    {tipo === 'paciente' && (
                      <>
                        <td>{r.terapeuta || '—'}</td>
                        <td>
                          <span className="rep-badge especialidad">
                            {r.especialidad || '—'}
                          </span>
                        </td>
                        <td>S/ {Number(r.monto || 0).toFixed(2)}</td>
                        <td>
                          <span className={`rep-badge estado ${claseEstado(r.estado_pago)}`}>
                            {r.estado_pago || '—'}
                          </span>
                        </td>
                      </>
                    )}

                    {tipo === 'terapeuta' && (
                      <>
                        <td>{r.paciente || '—'}</td>
                        <td>S/ {Number(r.monto || 0).toFixed(2)}</td>
                        <td>
                          <span className={`rep-badge estado ${claseEstado(r.estado_pago)}`}>
                            {r.estado_pago || '—'}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer con paginación */}
        <div className="rep-table-footer">
          <span className="rep-footer-text">
            {registros.length === 0
              ? 'Mostrando 0 de 0 registros'
              : `Mostrando ${indicePrimero + 1} - ${Math.min(indiceUltimo, registros.length)} de ${registros.length} registros`}
          </span>
          <div className="rep-pagination">
            <button className="page-btn" onClick={irPaginaAnterior} disabled={paginaActual === 1}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M15.4 7.4L14 6l-6 6 6 6 1.4-1.4L10.8 12z"/>
              </svg>
            </button>
            <span className="page-info">Página {paginaActual} de {totalPaginas || 1}</span>
            <button className="page-btn" onClick={irPaginaSiguiente} disabled={paginaActual >= totalPaginas}>
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