import { useState, useMemo, useEffect } from 'react';
import './PagosPacientesContent.css';
import { usePagosPacientesViewModel } from '../../hooks/usePagosPacientesViewModel';
import { usePacientesViewModel } from '../../hooks/usePacientesViewModel';
import { PagoPacienteModal } from './PagoPacienteModal';

/* Formatear fecha yyyy-mm-dd → dd/mm/yyyy */
function formatearFecha(fecha) {
  if (!fecha) return '—';
  const s = String(fecha).substring(0, 10);
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
}

/* Clase de badge para el estado del PAGO */
function claseEstado(estado) {
  const e = String(estado || '').toLowerCase();
  if (e.includes('pagado')) return 'pagado';
  if (e.includes('pendien')) return 'pendiente';
  if (e.includes('anulad') || e.includes('cancel')) return 'anulado';
  return 'default';
}

/* Clase de badge para el estado de la CITA */
function claseEstadoCita(estado) {
  const e = String(estado || '').toLowerCase();
  if (e.includes('atendida') || e.includes('completada')) return 'atendida';
  if (e.includes('reservada')) return 'reservada';
  if (e.includes('pendien')) return 'pendiente';
  if (e.includes('cancel')) return 'cancelada';
  if (e.includes('confirm')) return 'confirmada';
  return 'default';
}

/* Clase de badge para el MÉTODO de pago */
function claseFormaPago(forma) {
  const f = String(forma || '').toLowerCase();
  if (f.includes('tarjeta')) return 'tarjeta';
  if (f.includes('transferencia')) return 'transferencia';
  if (f.includes('efectivo')) return 'efectivo';
  if (f.includes('yape')) return 'yape';
  if (f.includes('plin')) return 'plin';
  return 'default';
}

const REGISTROS_POR_PAGINA = 8;

export function PagosPacientesContent() {
  const [filtroPaciente, setFiltroPaciente] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroForma, setFiltroForma] = useState('todos');
  const [paginaActual, setPaginaActual] = useState(1);

  /* Modal editar */
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pagoEditando, setPagoEditando] = useState(null);
  const [errorModal, setErrorModal] = useState('');

  const { pacientes } = usePacientesViewModel();

  const {
    cargando,
    actualizando,
    guardando,
    error,
    actualizarPagos,
    editarPago,
    filtrar,
  } = usePagosPacientesViewModel(filtroPaciente);

  const pagosFiltrados = useMemo(
    () => filtrar(filtroEstado, filtroForma),
    [filtroEstado, filtroForma, filtrar]
  );

  /* Paginación */
  const totalPaginas = Math.ceil(pagosFiltrados.length / REGISTROS_POR_PAGINA);
  const indiceUltimo = paginaActual * REGISTROS_POR_PAGINA;
  const indicePrimero = indiceUltimo - REGISTROS_POR_PAGINA;
  const pagosPaginados = pagosFiltrados.slice(indicePrimero, indiceUltimo);

  /* Reset de página al cambiar filtros */
  useEffect(() => {
    setPaginaActual(1);
  }, [filtroPaciente, filtroEstado, filtroForma]);

  /* Botón Actualizar Pagos */
  const handleActualizar = async () => {
    try {
      const res = await actualizarPagos();
      alert(res.message || 'Pagos actualizados correctamente');
    } catch (err) {
      alert(err.message || 'Error al actualizar pagos');
    }
  };

  /* Handlers del modal */
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
        <div className="ppac-select-wrapper">
          <select
            className="ppac-select"
            style={{ width: '100%', minWidth: '220px' }}
            value={filtroPaciente}
            onChange={(e) => setFiltroPaciente(e.target.value)}
          >
            <option value="todos">Todos los pacientes</option>
            {pacientes.filter((p) => p.estado).map((p) => (
              <option key={p.id} value={p.id}>{p.nombreCompleto}</option>
            ))}
          </select>
        </div>

        <select
          className="ppac-select"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          <option value="Pagado">Pagado</option>
          <option value="Pendiente">Pendiente</option>
        </select>

        <select
          className="ppac-select"
          value={filtroForma}
          onChange={(e) => setFiltroForma(e.target.value)}
        >
          <option value="todos">Todos los métodos de pago</option>
          <option value="Tarjeta">Tarjeta</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Yape">Yape</option>
          <option value="Plin">Plin</option>
        </select>

        <button
          className="ppac-new-btn"
          onClick={handleActualizar}
          disabled={actualizando}
        >
          <span className="plus">+</span>
          {actualizando ? 'Actualizando...' : 'Actualizar Pagos'}
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
                <th>Paciente</th>
                <th>Especialidad</th>
                <th>Terapeuta</th>
                <th>Fecha de la cita</th>
                <th>Fecha de pago</th>
                <th>Monto</th>
                <th>Método de pago</th>
                <th>Estado</th>
                <th>Estado de la cita</th>
                <th className="col-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr className="ppac-empty-row">
                  <td colSpan="12"><div className="ppac-empty-msg"><p>Cargando pagos...</p></div></td>
                </tr>
              ) : error ? (
                <tr className="ppac-empty-row">
                  <td colSpan="12"><div className="ppac-empty-msg"><p style={{ color: '#e91e63' }}>{error}</p></div></td>
                </tr>
              ) : pagosPaginados.length === 0 ? (
                <tr className="ppac-empty-row">
                  <td colSpan="12"><div className="ppac-empty-msg"><p>No hay pagos registrados</p></div></td>
                </tr>
              ) : (
                pagosPaginados.map((p, index) => {
                  /* 👇 Regla: solo editar si el pago está Pendiente Y la cita está Atendida */
                  const esEditable =
                    String(p.estado || '').toLowerCase() === 'pendiente' &&
                    String(p.estado_cita || '').toLowerCase() === 'atendida';

                  return (
                    <tr key={p.id_pago_paciente}>
                      <td className="col-check"><input type="checkbox" /></td>
                      <td className="col-num">{indicePrimero + index + 1}</td>
                      <td>
                        <div className="ppac-cell-paciente">
                          <div className="ppac-avatar">
                            {String(p.paciente || '?').charAt(0).toUpperCase()}
                          </div>
                          <span>{p.paciente || '—'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="ppac-badge especialidad">
                          {p.especialidad || '—'}
                        </span>
                      </td>
                      <td>{p.terapeuta || '—'}</td>
                      <td>{formatearFecha(p.fecha_cita)}</td>
                      <td>{formatearFecha(p.fecha_pago)}</td>
                      <td>S/ {Number(p.monto || 0).toFixed(2)}</td>
                      <td>
                        <span className={`ppac-badge ${claseFormaPago(p.forma_pago)}`}>
                          {p.forma_pago || '—'}
                        </span>
                      </td>
                      <td>
                        <span className={`ppac-badge estado ${claseEstado(p.estado)}`}>
                          <span className="badge-dot"></span>
                          {p.estado}
                        </span>
                      </td>
                      <td>
                        <span className={`ppac-badge cita ${claseEstadoCita(p.estado_cita)}`}>
                          {p.estado_cita || '—'}
                        </span>
                      </td>
                      <td className="col-acciones">
                        <button
                          className="ppac-action-btn edit"
                          title={
                            esEditable
                              ? 'Editar'
                              : 'Solo se puede editar si la cita fue atendida y el pago está pendiente'
                          }
                          onClick={() => abrirEditar(p)}
                          disabled={!esEditable}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75zM20.7 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75z"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer con paginación */}
        <div className="ppac-table-footer">
          <span className="ppac-footer-text">
            Mostrando {pagosFiltrados.length === 0 ? 0 : indicePrimero + 1} - {Math.min(indiceUltimo, pagosFiltrados.length)} de {pagosFiltrados.length} pagos
          </span>

          <div className="ppac-pagination">
            <button className="page-btn" onClick={irPaginaAnterior} disabled={paginaActual === 1}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M15.4 7.4L14 6l-6 6 6 6 1.4-1.4L10.8 12z"/>
              </svg>
            </button>
            <span className="page-info">
              Página {paginaActual} de {totalPaginas || 1}
            </span>
            <button className="page-btn" onClick={irPaginaSiguiente} disabled={paginaActual >= totalPaginas}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M8.6 16.6L10 18l6-6-6-6-1.4 1.4L13.2 12z"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ============ MODAL EDITAR PAGO ============ */}
      <PagoPacienteModal
        abierto={modalAbierto}
        pago={pagoEditando}
        onCerrar={cerrarModal}
        onGuardar={guardarEdicion}
        guardando={guardando}
        error={errorModal}
      />
    </div>
  );
}