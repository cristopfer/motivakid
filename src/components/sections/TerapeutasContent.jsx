import { useState } from 'react';
import './TerapeutasContent.css';
import { useTerapeutasViewModel } from '../../hooks/useTerapeutasViewModel';
import { useEspecialidadesViewModel } from '../../hooks/useEspecialidadesViewModel';
import { TerapeutaModal } from './TerapeutaModal';
import { ConfirmModal } from './ConfirmModal';

export function TerapeutasContent() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const {
    cargando,
    error,
    filtrar,
    crearTerapeuta,
    eliminarTerapeuta,
    activarTerapeuta,
    obtenerTerapeuta,        // 👈 nuevo
    actualizarTerapeuta,     // 👈 nuevo
  } = useTerapeutasViewModel();

  const { especialidades } = useEspecialidadesViewModel();

  const terapeutasFiltrados = filtrar(busqueda, filtroEspecialidad, filtroEstado);
  const totalTerapeutas = terapeutasFiltrados.length;

  /* Modal crear/editar */
  const [modalAbierto, setModalAbierto] = useState(false);
  const [terapeutaEditando, setTerapeutaEditando] = useState(null);
  const [cargandoTerapeuta, setCargandoTerapeuta] = useState(false);

  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState('');

  /* Modales de confirmación */
  const [terapeutaEliminar, setTerapeutaEliminar] = useState(null);
  const [terapeutaActivar, setTerapeutaActivar] = useState(null);

  const [procesandoEliminar, setProcesandoEliminar] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState('');

  const [procesandoActivar, setProcesandoActivar] = useState(false);
  const [errorActivar, setErrorActivar] = useState('');

  /* ========== Crear / editar ========== */
  const abrirCrear = () => {
    setTerapeutaEditando(null);
    setErrorModal('');
    setModalAbierto(true);
  };

  const abrirEditar = async (t) => {
    try {
      setCargandoTerapeuta(true);
      const detalle = await obtenerTerapeuta(t.id);
      /* detalle = { id_terapeuta, nombres, apellidos, id_especialidad, ... } */

      /* Normalizamos al formato que usa TerapeutaModal */
      setTerapeutaEditando({
        id: detalle.id_terapeuta ?? t.id,
        nombre: detalle.nombres || '',
        apellido: detalle.apellidos || '',
        id_especialidad: detalle.id_especialidad ?? '',
        estado: detalle.estado ?? t.estado,
      });

      setErrorModal('');
      setModalAbierto(true);
    } catch (err) {
      alert(err.message || 'Error al obtener el terapeuta');
    } finally {
      setCargandoTerapeuta(false);
    }
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalAbierto(false);
    setTerapeutaEditando(null);
    setErrorModal('');
  };

  const guardar = async (datos) => {
    try {
      setGuardando(true);
      setErrorModal('');

      if (terapeutaEditando) {
        await actualizarTerapeuta(datos);
      } else {
        await crearTerapeuta(datos);
      }

      setGuardando(false);
      cerrarModal();
    } catch (err) {
      setGuardando(false);
      setErrorModal(err.message || 'Error al guardar');
    }
  };

  /* ========== Eliminar / activar ========== */
  const confirmarEliminar = async () => {
    if (!terapeutaEliminar) return;
    try {
      setProcesandoEliminar(true);
      setErrorEliminar('');
      await eliminarTerapeuta(terapeutaEliminar.id);
      setProcesandoEliminar(false);
      setTerapeutaEliminar(null);
    } catch (err) {
      setProcesandoEliminar(false);
      setErrorEliminar(err.message || 'Error al eliminar');
    }
  };

  const confirmarActivar = async () => {
    if (!terapeutaActivar) return;
    try {
      setProcesandoActivar(true);
      setErrorActivar('');
      await activarTerapeuta(terapeutaActivar.id);
      setProcesandoActivar(false);
      setTerapeutaActivar(null);
    } catch (err) {
      setProcesandoActivar(false);
      setErrorActivar(err.message || 'Error al activar');
    }
  };

  return (
    <div className="terapeutas-content">

      {/* ============ BANNER ============ */}
      <section className="ter-banner">
        <div className="ter-banner-icon">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="#fff">
            <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
          </svg>
        </div>
        <div className="ter-banner-text">
          <h1>Gestión de Terapeutas</h1>
          <p>Registra, actualiza y elimina la información de los terapeutas del centro terapéutico.</p>
        </div>
        <span className="ter-deco ter-deco-confetti">🎉</span>
        <span className="ter-deco ter-deco-heart">♥</span>
        <span className="ter-deco ter-deco-star">★</span>
        <div className="ter-banner-image"></div>
      </section>

      {/* ============ FILTROS ============ */}
      <section className="ter-filters">
        <div className="ter-search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#a855f7" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <select
          className="ter-select"
          value={filtroEspecialidad}
          onChange={(e) => setFiltroEspecialidad(e.target.value)}
        >
          <option value="todas">Todas las especialidades</option>
          {especialidades
            .filter((e) => e.estado)
            .map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
        </select>

        <select
          className="ter-select"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="retirado">Retirado</option>
        </select>

        <button className="ter-new-btn" onClick={abrirCrear}>
          <span className="plus">+</span>
          Nuevo terapeuta
        </button>
      </section>

      {/* ============ TABLA ============ */}
      <section className="ter-table-card">
        <div className="ter-table-wrapper">
          <table className="ter-table">
            <thead>
              <tr>
                <th className="col-check"><input type="checkbox" /></th>
                <th className="col-num">N°</th>
                <th>Nombre completo</th>
                <th>Especialidad</th>
                <th>Estado</th>
                <th className="col-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr className="ter-empty-row">
                  <td colSpan="6"><div className="ter-empty-msg"><p>Cargando terapeutas...</p></div></td>
                </tr>
              ) : error ? (
                <tr className="ter-empty-row">
                  <td colSpan="6"><div className="ter-empty-msg"><p style={{ color: '#e91e63' }}>{error}</p></div></td>
                </tr>
              ) : terapeutasFiltrados.length === 0 ? (
                <tr className="ter-empty-row">
                  <td colSpan="6"><div className="ter-empty-msg"><p>No hay terapeutas registrados</p></div></td>
                </tr>
              ) : (
                terapeutasFiltrados.map((t, index) => (
                  <tr key={t.id}>
                    <td className="col-check"><input type="checkbox" /></td>
                    <td className="col-num">{index + 1}</td>
                    <td>
                      <div className="ter-cell-name">
                        <div className="ter-avatar">{t.iniciales}</div>
                        <span>{t.nombreCompleto}</span>
                      </div>
                    </td>
                    <td>{t.especialidad}</td>
                    <td>
                      <span className={`ter-badge ${t.estado ? 'activo' : 'retirado'}`}>
                        <span className="badge-dot"></span>
                        {t.estadoTexto}
                      </span>
                    </td>
                    <td className="col-acciones">
                      <button
                        className="ter-action-btn edit"
                        title="Editar"
                        onClick={() => abrirEditar(t)}
                        disabled={!t.estado}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75zM20.7 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75z"/>
                        </svg>
                      </button>

                      <button
                        className="ter-action-btn delete"
                        title="Eliminar"
                        onClick={() => setTerapeutaEliminar(t)}
                        disabled={!t.estado}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>

                      <button
                        className="ter-action-btn activate"
                        title="Activar"
                        onClick={() => setTerapeutaActivar(t)}
                        disabled={t.estado}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="ter-table-footer">
          <span className="ter-footer-text">
            Mostrando {terapeutasFiltrados.length} de {totalTerapeutas} terapeutas
          </span>
          <div className="ter-pagination">
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

      {/* Overlay carga detalle */}
      {cargandoTerapeuta && (
        <div className="ter-overlay-loading">
          <div className="ter-spinner"></div>
          <p>Cargando datos del terapeuta...</p>
        </div>
      )}

      {/* Modal crear/editar */}
      <TerapeutaModal
        abierto={modalAbierto}
        modo={terapeutaEditando ? 'editar' : 'crear'}
        terapeuta={terapeutaEditando}
        onCerrar={cerrarModal}
        onGuardar={guardar}
        guardando={guardando}
        error={errorModal}
      />

      {/* Modal confirmar ELIMINAR */}
      <ConfirmModal
        abierto={!!terapeutaEliminar}
        tipo="danger"
        titulo="¿Eliminar terapeuta?"
        mensaje={
          <>
            Estás a punto de eliminar a{' '}
            <strong>{terapeutaEliminar?.nombreCompleto}</strong>.
            <br />
            El terapeuta quedará como retirado en el sistema.
          </>
        }
        textoConfirmar="Sí, eliminar"
        textoCancelar="Cancelar"
        onConfirmar={confirmarEliminar}
        onCerrar={() => {
          if (procesandoEliminar) return;
          setTerapeutaEliminar(null);
          setErrorEliminar('');
        }}
        procesando={procesandoEliminar}
        error={errorEliminar}
      />

      {/* Modal confirmar ACTIVAR */}
      <ConfirmModal
        abierto={!!terapeutaActivar}
        tipo="success"
        titulo="¿Activar terapeuta?"
        mensaje={
          <>
            ¿Deseas activar a{' '}
            <strong>{terapeutaActivar?.nombreCompleto}</strong>?
            <br />
            Volverá a estar disponible en el sistema.
          </>
        }
        textoConfirmar="Sí, activar"
        textoCancelar="Cancelar"
        onConfirmar={confirmarActivar}
        onCerrar={() => {
          if (procesandoActivar) return;
          setTerapeutaActivar(null);
          setErrorActivar('');
        }}
        procesando={procesandoActivar}
        error={errorActivar}
      />
    </div>
  );
}