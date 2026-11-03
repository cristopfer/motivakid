import { useState, useMemo, useEffect } from 'react';
import './PagosTerapeutasContent.css';
import { usePagosTerapeutasViewModel } from '../../hooks/usePagosTerapeutasViewModel';
import { PagoTerapeutaModal } from './PagoTerapeutaModal';

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

export function PagosTerapeutasContent() {
  const [filtroPeriodo, setFiltroPeriodo] = useState(() => {
    const hoy = new Date();
    const y = hoy.getFullYear();
    const m = String(hoy.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  });
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [pagoEditando, setPagoEditando] = useState(null);
  const [errorModal, setErrorModal] = useState('');

  const {
    cargando,
    generando,
    guardando,
    error,
    actualizarPagos,
    editarPago,
    filtrar,
  } = usePagosTerapeutasViewModel(filtroPeriodo);

  const pagosFiltrados = useMemo(() => filtrar(busqueda), [busqueda, filtrar]);

  const totalPaginas = Math.ceil(pagosFiltrados.length / REGISTROS_POR_PAGINA);
  const indiceUltimo = paginaActual * REGISTROS_POR_PAGINA;
  const indicePrimero = indiceUltimo - REGISTROS_POR_PAGINA;
  const pagosPaginados = pagosFiltrados.slice(indicePrimero, indiceUltimo);

  useEffect(() => {
    setPaginaActual(1);
  }, [filtroPeriodo, busqueda]);

  const handleActualizar = async () => {
    try {
      const res = await actualizarPagos();
      alert(res.message || 'Pagos actualizados correctamente');
    } catch (err) {
      alert(err.message || 'Error al actualizar pagos');
    }
  };

  const abrirEditar = (pago) => {
    setPagoEditando(pago);
    setErrorModal('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalAbierto(false);
    setPagoEditando(null);
    setErrorModal('');
  };

  const guardarEdicion = async (datos) => {
    try {
      setErrorModal('');
      await editarPago(datos);
      setModalAbierto(false);
      setPagoEditando(null);
    } catch (err) {
      setErrorModal(err.message || 'Error al guardar');
    }
  };

  const irPaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };
  const irPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  return (
    <div className="pagos-ter-content">
      <section className="pter-banner">
        <div className="pter-banner-icon">
          <svg viewBox="0 0 24 24" width="38" height="38" fill="#fff">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
          </svg>
        </div>
        <div className="pter-banner-text">
          <h1>Pagos de Terapeutas</h1>
          <p>Registra y consulta los pagos realizados a los terapeutas del centro terapéutico.</p>
        </div>
        <span className="pter-deco pter-deco-confetti">🎉</span>
        <span className="pter-deco pter-deco-heart">♥</span>
        <span className="pter-deco pter-deco-star">★</span>
        <div className="pter-banner-image"></div>
      </section>

      <section className="pter-filters">
        <div className="pter-filter">
          <div className="pter-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
            </svg>
          </div>
          <div className="pter-filter-fields">
            <label>Mes y año</label>
            <input
              type="month"
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              className="pter-filter-input"
            />
          </div>
        </div>

        <div className="pter-search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#a855f7" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por terapeuta..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="pter-new-btn"
          onClick={handleActualizar}
          disabled={generando}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
          </svg>
          {generando ? 'Actualizando...' : 'Actualizar Pagos'}
        </button>
      </section>

      <section className="pter-table-card">
        <div className="pter-table-wrapper">
          <table className="pter-table">
            <thead>
              <tr>
                <th className="col-check"><input type="checkbox" /></th>
                <th className="col-num">N°</th>
                <th>Terapeuta</th>
                <th>Especialidad</th>
                <th>Fecha de pago</th>
                <th>Monto Final</th>
                <th>Estado</th>
                <th className="col-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr className="pter-empty-row">
                  <td colSpan="8"><div className="pter-empty-msg"><p>Cargando pagos...</p></div></td>
                </tr>
              ) : error ? (
                <tr className="pter-empty-row">
                  <td colSpan="8"><div className="pter-empty-msg"><p style={{ color: '#e91e63' }}>{error}</p></div></td>
                </tr>
              ) : pagosPaginados.length === 0 ? (
                <tr className="pter-empty-row">
                  <td colSpan="8"><div className="pter-empty-msg"><p>No hay pagos registrados</p></div></td>
                </tr>
              ) : (
                pagosPaginados.map((p, index) => (
                  <tr key={p.id_pago_terapeuta}>
                    <td className="col-check"><input type="checkbox" /></td>
                    <td className="col-num">{indicePrimero + index + 1}</td>
                    <td>
                      <div className="pter-cell-terapeuta">
                        <div className="pter-avatar">
                          {String(p.terapeuta || '?').charAt(0).toUpperCase()}
                        </div>
                        <span>{p.terapeuta || '—'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="pter-badge especialidad">
                        {p.especialidad || '—'}
                      </span>
                    </td>
                    <td>{formatearFecha(p.fecha_pago)}</td>
                    <td>S/ {Number(p.monto_final || 0).toFixed(2)}</td>
                    <td>
                      <span className={`pter-badge estado ${claseEstado(p.estado)}`}>
                        <span className="badge-dot"></span>
                        {p.estado}
                      </span>
                    </td>
                    <td className="col-acciones">
                      <button
                        className="pter-action-btn edit"
                        title="Editar"
                        onClick={() => abrirEditar(p)}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75zM20.7 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pter-table-footer">
          <span className="pter-footer-text">
            {pagosFiltrados.length === 0
              ? 'Mostrando 0 pagos'
              : `Mostrando ${indicePrimero + 1} - ${Math.min(indiceUltimo, pagosFiltrados.length)} de ${pagosFiltrados.length} pagos`}
          </span>
          <div className="pter-pagination">
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

      <PagoTerapeutaModal
        abierto={modalAbierto}
        pago={pagoEditando}
        periodo={filtroPeriodo}
        onCerrar={cerrarModal}
        onGuardar={guardarEdicion}
        guardando={guardando}
        error={errorModal}
      />
    </div>
  );
}