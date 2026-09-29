import { useState } from 'react';
import './PacientesContent.css';
import { usePacientesViewModel } from '../../hooks/usePacientesViewModel';
import { PacienteModal } from './PacienteModal';
import { ConfirmModal } from './ConfirmModal';

export function PacientesContent() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  /* Modales de paciente (crear/editar) */
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState(null);

  /* Modales de confirmación */
  const [pacienteEliminar, setPacienteEliminar] = useState(null);
  const [pacienteActivar, setPacienteActivar] = useState(null);

  const [procesandoEliminar, setProcesandoEliminar] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState('');

  const [procesandoActivar, setProcesandoActivar] = useState(false);
  const [errorActivar, setErrorActivar] = useState('');

  const { cargando, error, filtrar, crearPaciente, eliminarPaciente, activarPaciente, obtenerPaciente, actualizarPaciente,} = usePacientesViewModel();

  const pacientesFiltrados = filtrar(busqueda, filtroEstado);
  const totalPacientes = pacientesFiltrados.length;

  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState('');

  const [cargandoPaciente, setCargandoPaciente] = useState(false);

  /* Handlers del modal crear/editar */
  const abrirCrear = () => {
    setPacienteEditando(null);
    setModalAbierto(true);
  };

  const abrirEditar = async (paciente) => {
    try {
      setCargandoPaciente(true);
      const detalle = await obtenerPaciente(paciente.id);
      /* detalle = { nombre, apellido, fecha_nacimiento, diagnostico,
                   motivo_consulta, telefono, nombre_apoderado, correo } */

      /* Lo normalizamos con el nombre de los campos que usa PacienteModal */
      setPacienteEditando({
        id: paciente.id,
        nombre: detalle.nombre || '',
        apellido: detalle.apellido || '',
        fecha: detalle.fecha_nacimiento || '',
        diagnostico: detalle.diagnostico || '',
        motivo: detalle.motivo_consulta || '',
        telefono: detalle.telefono || '',
        apoderado: detalle.nombre_apoderado || '',
        correo: detalle.correo || '',
      });
      setModalAbierto(true);
    } catch (err) {
      alert(err.message); // o podrías usar un toast
    } finally {
      setCargandoPaciente(false);
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPacienteEditando(null);
    setErrorModal('');
  };

  const guardar = async (datos) => {
    try {
      setGuardando(true);
      setErrorModal('');

      if (pacienteEditando) {
        /* Actualizar */
        await actualizarPaciente(datos);
      } else {
        /* Crear */
        await crearPaciente(datos);
      }

      setGuardando(false);
      cerrarModal();
    } catch (err) {
      setGuardando(false);
      setErrorModal(err.message || 'Error al guardar');
    }
  };

  const confirmarEliminar = async () => {
    if (!pacienteEliminar) return;
    try {
      setProcesandoEliminar(true);
      setErrorEliminar('');
      await eliminarPaciente(pacienteEliminar.id);
      setProcesandoEliminar(false);
      setPacienteEliminar(null);
    } catch (err) {
      setProcesandoEliminar(false);
      setErrorEliminar(err.message || 'Error al eliminar');
    }
  };

  const confirmarActivar = async () => {
    if (!pacienteActivar) return;
    try {
      setProcesandoActivar(true);
      setErrorActivar('');
      await activarPaciente(pacienteActivar.id);
      setProcesandoActivar(false);
      setPacienteActivar(null);
    } catch (err) {
      setProcesandoActivar(false);
      setErrorActivar(err.message || 'Error al activar');
    }
  };

  return (
    <div className="pacientes-content">

      {/* Banner */}
      <section className="pac-banner">
        <div className="pac-banner-icon">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="#fff">
            <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 1.9 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z"/>
          </svg>
        </div>

        <div className="pac-banner-text">
          <h1>Gestión de Pacientes</h1>
          <p>Registra, actualiza y elimina la información de los pacientes del centro terapéutico.</p>
        </div>

        <span className="pac-deco pac-deco-confetti">🎉</span>
        <span className="pac-deco pac-deco-heart">♥</span>
        <span className="pac-deco pac-deco-star">★</span>

        <div className="pac-banner-image"></div>
      </section>

      {/* Filtros */}
      <section className="pac-filters">
        <div className="pac-search">
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
          className="pac-select"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <button className="pac-new-btn" onClick={abrirCrear}>
          <span className="plus">+</span>
          Nuevo paciente
        </button>
      </section>

      {/* Tabla */}
      <section className="pac-table-card">
        <div className="pac-table-wrapper">
          <table className="pac-table">
            <thead>
              <tr>
                <th className="col-check"><input type="checkbox" /></th>
                <th className="col-num">N°</th>
                <th>Nombre completo</th>
                <th>Diagnóstico</th>
                <th>Fecha</th>
                <th>Apoderado</th>
                <th>Estado</th>
                <th className="col-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr className="pac-empty-row">
                  <td colSpan="8">
                    <div className="pac-empty-msg"><p>Cargando pacientes...</p></div>
                  </td>
                </tr>
              ) : error ? (
                <tr className="pac-empty-row">
                  <td colSpan="8">
                    <div className="pac-empty-msg">
                      <p style={{ color: '#e91e63' }}>{error}</p>
                    </div>
                  </td>
                </tr>
              ) : pacientesFiltrados.length === 0 ? (
                <tr className="pac-empty-row">
                  <td colSpan="8">
                    <div className="pac-empty-msg"><p>No hay pacientes registrados</p></div>
                  </td>
                </tr>
              ) : (
                pacientesFiltrados.map((p, index) => (
                  <tr key={p.id}>
                    <td className="col-check">
                      <input type="checkbox" />
                    </td>
                    <td className="col-num">{index + 1}</td>
                    <td>
                      <div className="pac-cell-name">
                        <div className="pac-avatar">{p.iniciales}</div>
                        <span>{p.nombreCompleto}</span>
                      </div>
                    </td>
                    <td>{p.diagnostico}</td>
                    <td>{p.fechaFormateada}</td>
                    <td>{p.apoderado}</td>
                    <td>
                      <span className={`pac-badge ${p.estado ? 'activo' : 'inactivo'}`}>
                        <span className="badge-dot"></span>
                        {p.estadoTexto}
                      </span>
                    </td>
                    <td className="col-acciones">
                      {/* Editar */}
                      <button
                        className="pac-action-btn edit"
                        title="Editar"
                        onClick={() => abrirEditar(p)}
                        disabled={!p.estado}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75zM20.7 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75z"/>
                        </svg>
                      </button>

                      {/* Eliminar */}
                      <button
                        className="pac-action-btn delete"
                        title="Eliminar"
                        onClick={() => setPacienteEliminar(p)}
                        disabled={!p.estado}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>

                      {/* Activar */}
                      <button
                        className="pac-action-btn activate"
                        title="Activar"
                        onClick={() => setPacienteActivar(p)}
                        disabled={p.estado}
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
        <div className="pac-table-footer">
          <span className="pac-footer-text">
            Mostrando {pacientesFiltrados.length} de {totalPacientes} pacientes
          </span>

          <div className="pac-pagination">
            <button className="page-btn" disabled>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M15.4 7.4L14 6l-6 6 6 6 1.4-1.4L10.8 12z"/>
              </svg>
            </button>
            <button className="page-btn active">1</button>
            <button className="page-btn" disabled>2</button>
            <button className="page-btn" disabled>3</button>
            <button className="page-btn" disabled>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M8.6 16.6L10 18l6-6-6-6-1.4 1.4L13.2 12z"/>
              </svg>
            </button>
          </div>
        </div>
      </section>
      
      {cargandoPaciente && (
        <div className="pac-overlay-loading">
          <div className="pac-spinner"></div>
          <p>Cargando datos del paciente...</p>
        </div>
      )}

      {/* Modal crear/editar */}
      <PacienteModal
        abierto={modalAbierto}
        modo={pacienteEditando ? 'editar' : 'crear'}
        paciente={pacienteEditando}
        onCerrar={cerrarModal}
        onGuardar={guardar}
        guardando={guardando}
        error={errorModal}
      />

      {/* Modal confirmar ELIMINAR */}
      <ConfirmModal
        abierto={!!pacienteEliminar}
        tipo="danger"
        titulo="¿Eliminar paciente?"
        mensaje={
          <>
            Estás a punto de eliminar a{' '}
            <strong>{pacienteEliminar?.nombreCompleto}</strong>.
            <br />
            El paciente quedará como inactivo en el sistema.
          </>
        }
        textoConfirmar="Sí, eliminar"
        textoCancelar="Cancelar"
        onConfirmar={confirmarEliminar}
        onCerrar={() => {
          if (procesandoEliminar) return; // no cerrar mientras procesa
          setPacienteEliminar(null);
          setErrorEliminar('');
        }}
        procesando={procesandoEliminar}
        error={errorEliminar}
      />

      {/* Modal confirmar ACTIVAR */}
      <ConfirmModal
        abierto={!!pacienteActivar}
        tipo="success"
        titulo="¿Activar paciente?"
        mensaje={
          <>
            ¿Deseas activar a{' '}
            <strong>{pacienteActivar?.nombreCompleto}</strong>?
            <br />
            Volverá a estar disponible en el sistema.
          </>
        }
        textoConfirmar="Sí, activar"
        textoCancelar="Cancelar"
        onConfirmar={confirmarActivar}
        onCerrar={() => {
          if (procesandoActivar) return;
            setPacienteActivar(null);
            setErrorActivar('');
        }}
        procesando={procesandoActivar}
        error={errorActivar}
      />
    </div>
  );
}