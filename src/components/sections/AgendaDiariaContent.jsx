import { useState, useMemo, useEffect } from 'react';
import './AgendaDiariaContent.css';
import { useEspecialidadesViewModel } from '../../hooks/useEspecialidadesViewModel';
import { useTerapeutasViewModel } from '../../hooks/useTerapeutasViewModel';
import { useAsistenciaViewModel } from '../../hooks/useAsistenciaViewModel';
import { ConfirmModal } from './ConfirmModal';

function colorEstadoAsistencia(estado) {
  const e = String(estado || '').toLowerCase();
  if (e.includes('no asistio') || e.includes('falto')) return 'no-asistio';
  if (e.includes('asistio')) return 'asistio';
  if (e.includes('cancel')) return 'cancelada';
  if (e.includes('pendien') || e.includes('reserv')) return 'pendiente';
  return 'default';
}

export function AgendaDiariaContent() {
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('todas');
  const [filtroTerapeuta, setFiltroTerapeuta] = useState('todos');

  /* Modal de confirmación */
  const [citaAccion, setCitaAccion] = useState(null);   // { cita, tipo: 'asistio' | 'no-asistio' }
  const [procesando, setProcesando] = useState(false);
  const [errorAccion, setErrorAccion] = useState('');

  const { especialidades } = useEspecialidadesViewModel();
  const { terapeutas } = useTerapeutasViewModel();
  const {
    citas,
    cargando,
    error,
    cargarAsistencia,
    limpiar,
    registrarAsistencia,
  } = useAsistenciaViewModel();

  /* Terapeutas filtrados */
  const terapeutasFiltrados = useMemo(() => {
    if (filtroEspecialidad === 'todas') return terapeutas.filter((t) => t.estado);
    return terapeutas.filter(
      (t) => t.estado && String(t.id_especialidad) === String(filtroEspecialidad)
    );
  }, [terapeutas, filtroEspecialidad]);

  useEffect(() => {
    if (filtroTerapeuta === 'todos') return;
    const existe = terapeutasFiltrados.some(
      (t) => String(t.id) === String(filtroTerapeuta)
    );
    if (!existe) setFiltroTerapeuta('todos');
  }, [filtroEspecialidad, terapeutasFiltrados, filtroTerapeuta]);

  useEffect(() => {
    if (filtroTerapeuta === 'todos') {
      limpiar();
      return;
    }
    cargarAsistencia(Number(filtroTerapeuta));
  }, [filtroTerapeuta, cargarAsistencia, limpiar]);

  const terapeutaActual = useMemo(
    () => terapeutas.find((t) => String(t.id) === String(filtroTerapeuta)),
    [terapeutas, filtroTerapeuta]
  );

  const especialidadActual = useMemo(
    () => especialidades.find((e) => String(e.id) === String(filtroEspecialidad)),
    [especialidades, filtroEspecialidad]
  );

  const citasMostrar = citas;

  /* Abrir modal */
  const abrirConfirmacion = (cita, tipo) => {
    setCitaAccion({ cita, tipo });
    setErrorAccion('');
  };

  const cerrarConfirmacion = () => {
    if (procesando) return;
    setCitaAccion(null);
    setErrorAccion('');
  };

  /* Confirmar */
  const confirmarAccion = async () => {
    if (!citaAccion) return;
    const { cita, tipo } = citaAccion;
    const estado = tipo === 'asistio' ? 'Asistió' : 'No asistió';

    try {
      setProcesando(true);
      setErrorAccion('');
      await registrarAsistencia(cita.id_cita, estado);
      setProcesando(false);
      setCitaAccion(null);

      /* Recargar la agenda */
      cargarAsistencia(Number(filtroTerapeuta));
    } catch (err) {
      setProcesando(false);
      setErrorAccion(err.message || 'Error al registrar asistencia');
    }
  };

  return (
    <div className="agenda-content">

      {/* ============ BANNER ============ */}
      <section className="agd-banner">
        <div className="agd-banner-icon">
          <svg viewBox="0 0 24 24" width="38" height="38" fill="#fff">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
          </svg>
        </div>
        <div className="agd-banner-text">
          <h1>Agenda Diaria</h1>
          <p>
            Visualiza las citas programadas para el día de hoy y registra la asistencia
            de cada paciente.
          </p>
        </div>
        <span className="agd-deco agd-deco-confetti">🎉</span>
        <span className="agd-deco agd-deco-star">★</span>
        <div className="agd-banner-image">
          <div className="agd-banner-sticker">
            <span>Pequeños avances,</span>
            <span>grandes logros</span>
          </div>
        </div>
      </section>

      {/* ============ FILTROS ============ */}
      <section className="agd-filters">
        <div className="agd-filter">
          <div className="agd-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M12 17.3l-6.2 3.7 1.6-7.1L2 9.2l7.2-.6L12 2l2.8 6.6 7.2.6-5.4 4.7 1.6 7.1z"/>
            </svg>
          </div>
          <div className="agd-filter-fields">
            <label>Especialidad</label>
            <select
              value={filtroEspecialidad}
              onChange={(e) => setFiltroEspecialidad(e.target.value)}
              className="agd-filter-input"
            >
              <option value="todas">Todas las especialidades</option>
              {especialidades
                .filter((e) => e.estado)
                .map((e) => (
                  <option key={e.id} value={String(e.id)}>{e.nombre}</option>
                ))}
            </select>
          </div>
        </div>

        <div className="agd-filter">
          <div className="agd-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
            </svg>
          </div>
          <div className="agd-filter-fields">
            <label>Terapeuta</label>
            <select
              value={filtroTerapeuta}
              onChange={(e) => setFiltroTerapeuta(e.target.value)}
              className="agd-filter-input"
            >
              <option value="todos">Todos los terapeutas</option>
              {terapeutasFiltrados.map((t) => (
                <option key={t.id} value={String(t.id)}>{t.nombreCompleto}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ============ CARD PRINCIPAL ============ */}
      <section className="agd-card">
        <div className="agd-card-header">
          <div className="agd-header-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#a855f7">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
            </svg>
          </div>
          <h2 className="agd-header-title">
            {especialidadActual?.nombre || 'Sin especialidad'}
          </h2>
          <span className="agd-header-sep">—</span>
          <span className="agd-header-subtitle">
            {terapeutaActual?.nombreCompleto || 'Sin terapeuta asignado'}
          </span>
        </div>

        <div className="agd-table-wrapper">
          <table className="agd-table">
            <thead>
              <tr>
                <th className="col-hora">
                  <span className="th-flex">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#a855f7">
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 11h-5v-2h3V6h2z"/>
                    </svg>
                    Hora
                  </span>
                </th>
                <th>
                  <span className="th-flex">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#a855f7">
                      <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
                    </svg>
                    Nombre paciente
                  </span>
                </th>
                <th className="col-estado">Estado</th>
                <th className="col-control">
                  <span className="th-flex">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#a855f7">
                      <path d="M19.4 13a7.9 7.9 0 000-2l2.1-1.6-2-3.4-2.5 1a8 8 0 00-1.7-1L15 3.5h-4l-.3 2.5c-.6.3-1.2.6-1.7 1l-2.5-1-2 3.4L6.6 11a7.9 7.9 0 000 2l-2.1 1.6 2 3.4 2.5-1c.5.4 1.1.8 1.7 1l.3 2.5h4l.3-2.5c.6-.3 1.2-.6 1.7-1l2.5 1 2-3.4zM13 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/>
                    </svg>
                    Control
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtroTerapeuta === 'todos' ? (
                <tr className="agd-empty-row">
                  <td colSpan="4">
                    <div className="agd-empty-msg">
                      <p>Selecciona un terapeuta para ver su agenda</p>
                    </div>
                  </td>
                </tr>
              ) : cargando ? (
                <tr className="agd-empty-row">
                  <td colSpan="4">
                    <div className="agd-empty-msg"><p>Cargando agenda...</p></div>
                  </td>
                </tr>
              ) : error ? (
                <tr className="agd-empty-row">
                  <td colSpan="4">
                    <div className="agd-empty-msg">
                      <p style={{ color: '#e91e63' }}>{error}</p>
                    </div>
                  </td>
                </tr>
              ) : citasMostrar.length === 0 ? (
                <tr className="agd-empty-row">
                  <td colSpan="4">
                    <div className="agd-empty-msg">
                      <p>No hay citas programadas para hoy</p>
                    </div>
                  </td>
                </tr>
              ) : (
                citasMostrar.map((c, i) => {
                  let estado = c.estado_asistencia || 'Pendiente';
                  const estadoClase = colorEstadoAsistencia(estado);
                  const yaRegistrado = estadoClase === 'asistio' || estadoClase === 'no-asistio';

                return (
                  <tr key={i}>
                    <td className="col-hora">
                      {String(c.hora_inicio).substring(0, 5)} - {String(c.hora_fin).substring(0, 5)}
                    </td>
                    <td>
                      <div className="agd-cell-paciente">
                        <div className="agd-paciente-avatar">
                          {String(c.paciente || '?').charAt(0).toUpperCase()}
                        </div>
                        <span>{c.paciente || '—'}</span>
                      </div>
                    </td>
                    {/* Columna Estado */}
                    <td className="col-estado">
                      <span className={`agd-estado-badge ${estadoClase}`}>
                        {estado}
                      </span>
                    </td>
                    {/* Columna Control */}
                    <td className="col-control">
                      {yaRegistrado ? (
                        <span className="agd-control-done">✔ Registrado</span>
                      ) : (
                        <div className="agd-control-btns">
                          <button
                            type="button"
                            className="agd-btn-asistio"
                            onClick={() => abrirConfirmacion(c, 'asistio')}
                          >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
                            </svg>
                            Asistió
                          </button>
                          <button
                            type="button"
                            className="agd-btn-no-asistio"
                            onClick={() => abrirConfirmacion(c, 'no-asistio')}
                          >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                              <path d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/>
                            </svg>
                            No asistió
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>

        <div className="agd-card-footer">
          <span className="agd-footer-text">
            {filtroTerapeuta === 'todos'
              ? 'Mostrando 0 citas'
              : `Mostrando ${citasMostrar.length} de ${citas.length} citas`}
          </span>
        </div>
      </section>

      {/* ============ MODAL CONFIRMAR ASISTENCIA ============ */}
      <ConfirmModal
        abierto={!!citaAccion && citaAccion.tipo === 'asistio'}
        tipo="success"
        titulo="¿Confirmar asistencia?"
        mensaje={
          <>
            ¿Confirmas que el paciente{' '}
            <strong>{citaAccion?.cita?.paciente || '—'}</strong>{' '}
            <strong>asistió</strong> a la cita del día de hoy a las{' '}
            <strong>{String(citaAccion?.cita?.hora_inicio || '').substring(0, 5)}</strong>?
          </>
        }
        textoConfirmar="Sí, asistió"
        textoCancelar="Cancelar"
        onConfirmar={confirmarAccion}
        onCerrar={cerrarConfirmacion}
        procesando={procesando}
        error={errorAccion}
      />

      {/* ============ MODAL CONFIRMAR INASISTENCIA ============ */}
      <ConfirmModal
        abierto={!!citaAccion && citaAccion.tipo === 'no-asistio'}
        tipo="danger"
        titulo="¿Confirmar inasistencia?"
        mensaje={
          <>
            ¿Confirmas que el paciente{' '}
            <strong>{citaAccion?.cita?.paciente || '—'}</strong>{' '}
            <strong>no asistió</strong> a la cita del día de hoy a las{' '}
            <strong>{String(citaAccion?.cita?.hora_inicio || '').substring(0, 5)}</strong>?
          </>
        }
        textoConfirmar="Sí, no asistió"
        textoCancelar="Cancelar"
        onConfirmar={confirmarAccion}
        onCerrar={cerrarConfirmacion}
        procesando={procesando}
        error={errorAccion}
      />
    </div>
  );
}