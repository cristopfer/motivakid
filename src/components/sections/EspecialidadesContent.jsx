import { useState } from 'react';
import './EspecialidadesContent.css';
import { useEspecialidadesViewModel } from '../../hooks/useEspecialidadesViewModel';
import { EspecialidadModal } from './EspecialidadModal';
import { ConfirmModal } from './ConfirmModal';

export function EspecialidadesContent() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const {
    cargando,
    error,
    filtrar,
    crearEspecialidad,
    eliminarEspecialidad,
    activarEspecialidad,
    obtenerEspecialidad,        // 👈 nuevo
    actualizarEspecialidad,     // 👈 nuevo
  } = useEspecialidadesViewModel();

  const especialidadesFiltradas = filtrar(busqueda, filtroEstado);
  const totalEspecialidades = especialidadesFiltradas.length;

  /* Modal crear/editar */
  const [modalAbierto, setModalAbierto] = useState(false);
  const [especialidadEditando, setEspecialidadEditando] = useState(null);
  const [cargandoEspecialidad, setCargandoEspecialidad] = useState(false);

  /* Modales de confirmación */
  const [especialidadEliminar, setEspecialidadEliminar] = useState(null);
  const [especialidadActivar, setEspecialidadActivar] = useState(null);

  /* Estados de guardado */
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState('');

  /* Estados de eliminar */
  const [procesandoEliminar, setProcesandoEliminar] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState('');

  /* Estados de activar */
  const [procesandoActivar, setProcesandoActivar] = useState(false);
  const [errorActivar, setErrorActivar] = useState('');

  /* ========== Handlers crear/editar ========== */
  const abrirCrear = () => {
    setEspecialidadEditando(null);
    setErrorModal('');
    setModalAbierto(true);
  };

  const abrirEditar = async (esp) => {
    try {
      setCargandoEspecialidad(true);
      const detalle = await obtenerEspecialidad(esp.id);
      /* detalle = { id_especialidad, nombre, estado } */
      setEspecialidadEditando({
        id: detalle.id_especialidad ?? esp.id,
        nombre: detalle.nombre || '',
        estado: detalle.estado,
      });
      setErrorModal('');
      setModalAbierto(true);
    } catch (err) {
      alert(err.message || 'Error al obtener la especialidad');
    } finally {
      setCargandoEspecialidad(false);
    }
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalAbierto(false);
    setEspecialidadEditando(null);
    setErrorModal('');
  };

  const guardar = async (datos) => {
    try {
      setGuardando(true);
      setErrorModal('');

      if (especialidadEditando) {
        await actualizarEspecialidad(datos);
      } else {
        await crearEspecialidad(datos);
      }

      setGuardando(false);
      cerrarModal();
    } catch (err) {
      setGuardando(false);
      setErrorModal(err.message || 'Error al guardar');
    }
  };

  /* ========== Handlers eliminar / activar ============ */
  const confirmarEliminar = async () => {
    if (!especialidadEliminar) return;
    try {
      setProcesandoEliminar(true);
      setErrorEliminar('');
      await eliminarEspecialidad(especialidadEliminar.id);
      setProcesandoEliminar(false);
      setEspecialidadEliminar(null);
    } catch (err) {
      setProcesandoEliminar(false);
      setErrorEliminar(err.message || 'Error al eliminar');
    }
  };

  const confirmarActivar = async () => {
    if (!especialidadActivar) return;
    try {
      setProcesandoActivar(true);
      setErrorActivar('');
      await activarEspecialidad(especialidadActivar.id);
      setProcesandoActivar(false);
      setEspecialidadActivar(null);
    } catch (err) {
      setProcesandoActivar(false);
      setErrorActivar(err.message || 'Error al activar');
    }
  };

  return (
    <div className="especialidades-content">

      {/* Banner */}
      <section className="esp-banner">
        <div className="esp-banner-icon">
          <svg viewBox="0 0 24 24" width="38" height="38" fill="#fff">
            <path d="M12 17.3l-6.2 3.7 1.6-7.1L2 9.2l7.2-.6L12 2l2.8 6.6 7.2.6-5.4 4.7 1.6 7.1z"/>
          </svg>
        </div>
        <div className="esp-banner-text">
          <h1>Gestión de Especialidades</h1>
          <p>Registra, actualiza y elimina las especialidades, y asigna terapeutas a cada una.</p>
        </div>
        <span className="esp-deco esp-deco-confetti">🎉</span>
        <span className="esp-deco esp-deco-heart">♥</span>
        <span className="esp-deco esp-deco-star">★</span>
        <div className="esp-banner-image"></div>
      </section>

      {/* Filtros */}
      <section className="esp-filters">
        <div className="esp-search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#a855f7" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre de especialidad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <select
          className="esp-select"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <button className="esp-new-btn" onClick={abrirCrear}>
          <span className="plus">+</span>
          Nueva especialidad
        </button>
      </section>

      {/* Tabla */}
      <section className="esp-table-card">
        <div className="esp-table-wrapper">
          <table className="esp-table">
            <thead>
              <tr>
                <th className="col-check"><input type="checkbox" /></th>
                <th className="col-num">N°</th>
                <th>Especialidad</th>
                <th>Estado</th>
                <th className="col-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr className="esp-empty-row">
                  <td colSpan="5"><div className="esp-empty-msg"><p>Cargando especialidades...</p></div></td>
                </tr>
              ) : error ? (
                <tr className="esp-empty-row">
                  <td colSpan="5"><div className="esp-empty-msg"><p style={{ color: '#e91e63' }}>{error}</p></div></td>
                </tr>
              ) : especialidadesFiltradas.length === 0 ? (
                <tr className="esp-empty-row">
                  <td colSpan="5"><div className="esp-empty-msg"><p>No hay especialidades registradas</p></div></td>
                </tr>
              ) : (
                especialidadesFiltradas.map((esp, index) => (
                  <tr key={esp.id}>
                    <td className="col-check"><input type="checkbox" /></td>
                    <td className="col-num">{index + 1}</td>
                    <td>{esp.nombre}</td>
                    <td>
                      <span className={`esp-badge ${esp.estado ? 'activo' : 'inactivo'}`}>
                        <span className="badge-dot"></span>
                        {esp.estadoTexto}
                      </span>
                    </td>
                    <td className="col-acciones">
                      <button
                        className="esp-action-btn edit"
                        title="Editar"
                        onClick={() => abrirEditar(esp)}
                        disabled={!esp.estado}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75zM20.7 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75z"/>
                        </svg>
                      </button>

                      <button
                        className="esp-action-btn delete"
                        title="Eliminar"
                        onClick={() => setEspecialidadEliminar(esp)}
                        disabled={!esp.estado}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>

                      <button
                        className="esp-action-btn activate"
                        title="Activar"
                        onClick={() => setEspecialidadActivar(esp)}
                        disabled={esp.estado}
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
        <div className="esp-table-footer">
          <span className="esp-footer-text">
            Mostrando {especialidadesFiltradas.length} de {totalEspecialidades} especialidades
          </span>
          <div className="esp-pagination">
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
      {cargandoEspecialidad && (
        <div className="esp-overlay-loading">
          <div className="esp-spinner"></div>
          <p>Cargando datos de la especialidad...</p>
        </div>
      )}

      {/* Modal crear/editar */}
      <EspecialidadModal
        abierto={modalAbierto}
        modo={especialidadEditando ? 'editar' : 'crear'}
        especialidad={especialidadEditando}
        onCerrar={cerrarModal}
        onGuardar={guardar}
        guardando={guardando}
        error={errorModal}
      />

      {/* Modal confirmar ELIMINAR */}
      <ConfirmModal
        abierto={!!especialidadEliminar}
        tipo="danger"
        titulo="¿Eliminar especialidad?"
        mensaje={
          <>
            Estás a punto de eliminar{' '}
            <strong>{especialidadEliminar?.nombre}</strong>.
            <br />
            La especialidad quedará como inactiva en el sistema.
          </>
        }
        textoConfirmar="Sí, eliminar"
        textoCancelar="Cancelar"
        onConfirmar={confirmarEliminar}
        onCerrar={() => {
          if (procesandoEliminar) return;
          setEspecialidadEliminar(null);
          setErrorEliminar('');
        }}
        procesando={procesandoEliminar}
        error={errorEliminar}
      />

      {/* Modal confirmar ACTIVAR */}
      <ConfirmModal
        abierto={!!especialidadActivar}
        tipo="success"
        titulo="¿Activar especialidad?"
        mensaje={
          <>
            ¿Deseas activar{' '}
            <strong>{especialidadActivar?.nombre}</strong>?
            <br />
            Volverá a estar disponible en el sistema.
          </>
        }
        textoConfirmar="Sí, activar"
        textoCancelar="Cancelar"
        onConfirmar={confirmarActivar}
        onCerrar={() => {
          if (procesandoActivar) return;
          setEspecialidadActivar(null);
          setErrorActivar('');
        }}
        procesando={procesandoActivar}
        error={errorActivar}
      />
    </div>
  );
}