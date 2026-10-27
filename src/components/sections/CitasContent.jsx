import { useState, useMemo, useEffect } from 'react';
import './CitasContent.css';
import { useEspecialidadesViewModel } from '../../hooks/useEspecialidadesViewModel';
import { useTerapeutasViewModel } from '../../hooks/useTerapeutasViewModel';
import { usePacientesViewModel } from '../../hooks/usePacientesViewModel';
import { useCitasViewModel } from '../../hooks/useCitasViewModel';
import { ConfirmModal } from './ConfirmModal';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function generarGrilla(year, month) {
  const primerDia = new Date(year, month, 1);
  const ultimoDia = new Date(year, month + 1, 0);
  const inicioSemana = (primerDia.getDay() + 6) % 7;
  const totalDias = ultimoDia.getDate();
  const celdas = [];
  for (let i = 0; i < inicioSemana; i++) celdas.push(null);
  for (let d = 1; d <= totalDias; d++) celdas.push(d);
  while (celdas.length % 7 !== 0) celdas.push(null);
  return celdas;
}

function formatearFechaISO(anio, mes, dia) {
  const m = String(mes + 1).padStart(2, '0');
  const d = String(dia).padStart(2, '0');
  return `${anio}-${m}-${d}`;
}

function formatearFechaLegible(anio, mes, dia) {
  const d = String(dia).padStart(2, '0');
  return `${d} de ${MESES[mes]} de ${anio}`;
}

export function CitasContent() {
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('todas');
  const [filtroTerapeuta, setFiltroTerapeuta] = useState('todos');
  const [filtroPaciente, setFiltroPaciente] = useState('todos');

  const hoy = new Date();
  const [mesActual, setMesActual] = useState(hoy.getMonth());
  const [anioActual, setAnioActual] = useState(hoy.getFullYear());
  const [diaSeleccionado, setDiaSeleccionado] = useState(hoy.getDate());

  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  /* Modales */
  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [modalNoDisponible, setModalNoDisponible] = useState(false);
  const [modalReprogramar, setModalReprogramar] = useState(false);

  /* Estados de proceso */
  const [guardandoMsg, setGuardandoMsg] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState('');

  const [procesandoReprog, setProcesandoReprog] = useState(false);
  const [errorReprog, setErrorReprog] = useState('');

  const { especialidades } = useEspecialidadesViewModel();
  const { terapeutas } = useTerapeutasViewModel();
  const { pacientes } = usePacientesViewModel();
  const {
    citas,
    cargando: cargandoCitas,
    error: errorCitas,
    cargarCitas,
    limpiar,
    crearCita,
    liberarCita,   // 👈 nuevo
  } = useCitasViewModel();

  /* Terapeutas filtrados */
  const terapeutasFiltrados = useMemo(() => {
    if (filtroEspecialidad === 'todas') return terapeutas.filter((t) => t.estado);
    return terapeutas.filter(
      (t) => t.estado && String(t.id_especialidad) === String(filtroEspecialidad)
    );
  }, [terapeutas, filtroEspecialidad]);

  useEffect(() => {
    if (filtroTerapeuta === 'todos') return;
    const existe = terapeutasFiltrados.some((t) => String(t.id) === String(filtroTerapeuta));
    if (!existe) setFiltroTerapeuta('todos');
  }, [filtroEspecialidad, terapeutasFiltrados, filtroTerapeuta]);

  const fechaSeleccionadaISO = useMemo(
    () => formatearFechaISO(anioActual, mesActual, diaSeleccionado),
    [anioActual, mesActual, diaSeleccionado]
  );

  useEffect(() => {
    if (filtroEspecialidad === 'todas' || filtroTerapeuta === 'todos') {
      limpiar();
      setCitaSeleccionada(null);
      return;
    }
    cargarCitas(Number(filtroTerapeuta), fechaSeleccionadaISO);
    setCitaSeleccionada(null);
  }, [filtroEspecialidad, filtroTerapeuta, fechaSeleccionadaISO, cargarCitas, limpiar]);

  /* Calendario */
  const celdas = useMemo(() => generarGrilla(anioActual, mesActual), [anioActual, mesActual]);

  const esHoy = (dia) =>
    dia === hoy.getDate() && mesActual === hoy.getMonth() && anioActual === hoy.getFullYear();

  const irMesAnterior = () => {
    if (mesActual === 0) { setMesActual(11); setAnioActual(anioActual - 1); }
    else setMesActual(mesActual - 1);
  };
  const irMesSiguiente = () => {
    if (mesActual === 11) { setMesActual(0); setAnioActual(anioActual + 1); }
    else setMesActual(mesActual + 1);
  };

  const terapeutaActual = useMemo(
    () => terapeutas.find((t) => String(t.id) === String(filtroTerapeuta)),
    [terapeutas, filtroTerapeuta]
  );
  const especialidadActual = useMemo(
    () => especialidades.find((e) => String(e.id) === String(filtroEspecialidad)),
    [especialidades, filtroEspecialidad]
  );

  const pacienteSeleccionadoNombre = useMemo(() => {
    if (!citaSeleccionada) return '';
    if (citaSeleccionada.paciente && citaSeleccionada.paciente.trim() !== '') {
      return citaSeleccionada.paciente;
    }
    const p = pacientes.find((x) => String(x.id) === String(filtroPaciente));
    return p ? p.nombreCompleto : 'Sin asignar';
  }, [citaSeleccionada, pacientes, filtroPaciente]);

  /* Agendar */
  const handleAgendarDetalle = () => {
    if (!citaSeleccionada) return;
    const esLibre =
      !citaSeleccionada.estado ||
      String(citaSeleccionada.estado).toLowerCase() === 'libre' ||
      (!citaSeleccionada.paciente || citaSeleccionada.paciente.trim() === '');

    if (esLibre) setModalConfirmar(true);
    else setModalNoDisponible(true);
  };

  const confirmarAgendar = async () => {
    if (!citaSeleccionada) return;
    if (filtroPaciente === 'todos') {
      setErrorGuardar('Selecciona un paciente antes de agendar');
      return;
    }

    try {
      setGuardandoMsg(true);
      setErrorGuardar('');
      await crearCita({
        id_paciente: Number(filtroPaciente),
        id_terapeuta: Number(filtroTerapeuta),
        fecha: fechaSeleccionadaISO,
        hora_inicio: String(citaSeleccionada.hora_inicio).substring(0, 5),
        hora_fin: String(citaSeleccionada.hora_fin).substring(0, 5),
      });
      setGuardandoMsg(false);
      setModalConfirmar(false);
      setCitaSeleccionada(null);
      cargarCitas(Number(filtroTerapeuta), fechaSeleccionadaISO);
    } catch (err) {
      setGuardandoMsg(false);
      setErrorGuardar(err.message || 'Error al agendar');
    }
  };

  /* Reprogramar (liberar) */
  const handleReprogramar = () => {
    if (!citaSeleccionada?.id_cita) return;
    setErrorReprog('');
    setModalReprogramar(true);
  };

  const confirmarReprogramar = async () => {
    if (!citaSeleccionada?.id_cita) return;
    try {
      setProcesandoReprog(true);
      setErrorReprog('');
      await liberarCita(citaSeleccionada.id_cita);
      setProcesandoReprog(false);
      setModalReprogramar(false);
      setCitaSeleccionada(null);
      cargarCitas(Number(filtroTerapeuta), fechaSeleccionadaISO);
    } catch (err) {
      setProcesandoReprog(false);
      setErrorReprog(err.message || 'Error al liberar la cita');
    }
  };

  return (
    <div className="citas-content">

      {/* Banner */}
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

      {/* Filtros */}
      <section className="cit-filters">
        <div className="cit-filter">
          <div className="cit-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M12 17.3l-6.2 3.7 1.6-7.1L2 9.2l7.2-.6L12 2l2.8 6.6 7.2.6-5.4 4.7 1.6 7.1z"/>
            </svg>
          </div>
          <div className="cit-filter-fields">
            <label>Especialidad</label>
            <select value={filtroEspecialidad} onChange={(e) => setFiltroEspecialidad(e.target.value)} className="cit-filter-input">
              <option value="todas">Todas las especialidades</option>
              {especialidades.filter((e) => e.estado).map((e) => (
                <option key={e.id} value={String(e.id)}>{e.nombre}</option>
              ))}
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
            <select value={filtroTerapeuta} onChange={(e) => setFiltroTerapeuta(e.target.value)} className="cit-filter-input">
              <option value="todos">Todos los terapeutas</option>
              {terapeutasFiltrados.map((t) => (
                <option key={t.id} value={String(t.id)}>{t.nombreCompleto}</option>
              ))}
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
            <label>Paciente</label>
            <select value={filtroPaciente} onChange={(e) => setFiltroPaciente(e.target.value)} className="cit-filter-input">
              <option value="todos">Todos los pacientes</option>
              {pacientes.filter((p) => p.estado).map((p) => (
                <option key={p.id} value={String(p.id)}>{p.nombreCompleto}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Layout */}
      <section className="cit-layout">

        {/* Calendario */}
        <div className="cit-col-calendar">
          <div className="cit-card">
            <div className="cit-card-header">
              <div className="cit-card-title">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
                </svg>
                <h3>Calendario</h3>
              </div>
              <div className="cit-month-nav">
                <button type="button" className="nav-btn" onClick={irMesAnterior}>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                    <path d="M15.4 7.4L14 6l-6 6 6 6 1.4-1.4L10.8 12z"/>
                  </svg>
                </button>
                <span className="month-label">{MESES[mesActual]} {anioActual}</span>
                <button type="button" className="nav-btn" onClick={irMesSiguiente}>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                    <path d="M8.6 16.6L10 18l6-6-6-6-1.4 1.4L13.2 12z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="cit-calendar">
              <div className="cal-days-header">
                {DIAS_SEMANA.map((d) => <span key={d}>{d}</span>)}
              </div>
              <div className="cal-grid">
                {celdas.map((dia, i) => {
                  if (dia === null) return <span key={i} className="cal-cell empty"></span>;
                  const activo = diaSeleccionado === dia;
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`cal-cell ${activo ? 'selected' : ''} ${esHoy(dia) ? 'today' : ''}`}
                      onClick={() => setDiaSeleccionado(dia)}
                    >
                      {dia}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Lista de citas */}
        <div className="cit-card cit-col-list">
          <div className="cit-card-header">
            <div className="cit-card-title">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#a855f7">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
              </svg>
              <h3>Citas del {diaSeleccionado} de {MESES[mesActual]}</h3>
            </div>
            <span className="cit-count-badge">{citas.length} citas</span>
          </div>
          <div className="cit-list">
            {cargandoCitas ? (
              <p className="cit-empty-msg">Cargando citas...</p>
            ) : errorCitas ? (
              <p className="cit-empty-msg" style={{ color: '#e91e63' }}>{errorCitas}</p>
            ) : citas.length === 0 ? (
              <p className="cit-empty-msg">No hay bloques para esta fecha</p>
            ) : (
              citas.map((c, i) => {
                let estado = 'Libre';
                if (c.estado) estado = c.estado;
                else if (c.paciente && c.paciente.trim() !== '') estado = 'Reservada';
                const estadoClase = String(estado).toLowerCase().replace(/\s+/g, '-');
                const activo =
                  citaSeleccionada &&
                  citaSeleccionada.hora_inicio === c.hora_inicio &&
                  citaSeleccionada.hora_fin === c.hora_fin;

                return (
                  <div
                    className={`cit-item ${activo ? 'selected' : ''}`}
                    key={i}
                    onClick={() => setCitaSeleccionada(c)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="cit-item-time">
                      {String(c.hora_inicio).substring(0, 5)} - {String(c.hora_fin).substring(0, 5)}
                    </div>
                    <div className="cit-item-body">
                      <div className="cit-item-row">
                        <span className="cit-item-label">Terapeuta:</span>
                        <span className="cit-item-value">{terapeutaActual?.nombreCompleto || '—'}</span>
                      </div>
                      <div className="cit-item-row">
                        <span className="cit-item-label">Especialidad:</span>
                        <span className="cit-item-value">{especialidadActual?.nombre || '—'}</span>
                      </div>
                      <div className="cit-item-row">
                        <span className="cit-item-label">Paciente:</span>
                        <span className="cit-item-value">
                          {c.paciente && c.paciente.trim() !== '' ? c.paciente : <em>Sin asignar</em>}
                        </span>
                      </div>
                    </div>
                    <div className={`cit-item-estado estado-${estadoClase}`}>{estado}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detalle */}
        <div className="cit-card cit-col-detail">
          <div className="cit-card-header">
            <div className="cit-card-title">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#a855f7">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
              </svg>
              <h3>Detalle de la cita</h3>
            </div>
          </div>

          {!citaSeleccionada ? (
            <p className="cit-detail-empty">Selecciona una cita de la lista para ver su detalle</p>
          ) : (
            <div className="cit-detail-body">
              <div className="cit-detail-top">
                <div className="cit-detail-hora">
                  {String(citaSeleccionada.hora_inicio).substring(0, 5)} - {String(citaSeleccionada.hora_fin).substring(0, 5)}
                </div>
                {(() => {
                  let estado = 'Libre';
                  if (citaSeleccionada.estado) estado = citaSeleccionada.estado;
                  else if (citaSeleccionada.paciente && citaSeleccionada.paciente.trim() !== '') estado = 'Reservada';
                  const clase = String(estado).toLowerCase().replace(/\s+/g, '-');
                  return <div className={`cit-item-estado estado-${clase}`}>{estado}</div>;
                })()}
              </div>

              <div className="cit-detail-row">
                <span className="cit-detail-label">Paciente:</span>
                <span className="cit-detail-value">{pacienteSeleccionadoNombre}</span>
              </div>
              <div className="cit-detail-row">
                <span className="cit-detail-label">Terapeuta:</span>
                <span className="cit-detail-value">{terapeutaActual?.nombreCompleto || '—'}</span>
              </div>
              <div className="cit-detail-row">
                <span className="cit-detail-label">Especialidad:</span>
                <span className="cit-detail-value">{especialidadActual?.nombre || '—'}</span>
              </div>
              <div className="cit-detail-row">
                <span className="cit-detail-label">Fecha:</span>
                <span className="cit-detail-value">
                  {formatearFechaLegible(anioActual, mesActual, diaSeleccionado)}
                </span>
              </div>

              {errorGuardar && <div className="cit-detail-error">{errorGuardar}</div>}

              <div className="cit-detail-actions">
                <button
                  type="button"
                  className="cit-detail-agendar-btn"
                  onClick={handleAgendarDetalle}
                  disabled={guardandoMsg}
                >
                  {guardandoMsg ? 'Agendando...' : 'Agendar cita'}
                </button>

                <button
                  type="button"
                  className="cit-detail-reprogramar-btn"
                  onClick={handleReprogramar}
                  disabled={!citaSeleccionada?.id_cita || procesandoReprog}
                >
                  Reprogramar
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal Confirmar Agendar */}
      <ConfirmModal
        abierto={modalConfirmar}
        tipo="success"
        titulo="¿Confirmar cita?"
        mensaje={
          <>
            ¿Estás seguro de agendar la cita para el paciente{' '}
            <strong>{pacienteSeleccionadoNombre}</strong> con{' '}
            <strong>{terapeutaActual?.nombreCompleto}</strong> el día{' '}
            <strong>{formatearFechaLegible(anioActual, mesActual, diaSeleccionado)}</strong>{' '}
            de {String(citaSeleccionada?.hora_inicio).substring(0, 5)} a{' '}
            {String(citaSeleccionada?.hora_fin).substring(0, 5)}?
          </>
        }
        textoConfirmar="Sí, agendar"
        textoCancelar="Cancelar"
        onConfirmar={confirmarAgendar}
        onCerrar={() => {
          if (guardandoMsg) return;
          setModalConfirmar(false);
          setErrorGuardar('');
        }}
        procesando={guardandoMsg}
        error={errorGuardar}
      />

      {/* Modal No Disponible */}
      <ConfirmModal
        abierto={modalNoDisponible}
        tipo="danger"
        titulo="Cita no disponible"
        mensaje={
          <>
            Esta cita ya está reservada para el día{' '}
            <strong>{formatearFechaLegible(anioActual, mesActual, diaSeleccionado)}</strong>.
          </>
        }
        textoConfirmar="Entendido"
        textoCancelar="Cerrar"
        onConfirmar={() => setModalNoDisponible(false)}
        onCerrar={() => setModalNoDisponible(false)}
      />

      {/* Modal Reprogramar */}
      <ConfirmModal
        abierto={modalReprogramar}
        tipo="danger"
        titulo="¿Liberar la cita?"
        mensaje={
          <>
            ¿Estás seguro de liberar la cita del paciente{' '}
            <strong>{pacienteSeleccionadoNombre}</strong> con{' '}
            <strong>{terapeutaActual?.nombreCompleto}</strong> el día{' '}
            <strong>{formatearFechaLegible(anioActual, mesActual, diaSeleccionado)}</strong>{' '}
            de {String(citaSeleccionada?.hora_inicio).substring(0, 5)} a{' '}
            {String(citaSeleccionada?.hora_fin).substring(0, 5)}?
            <br />
            El bloque quedará disponible nuevamente.
          </>
        }
        textoConfirmar="Sí, liberar"
        textoCancelar="Cancelar"
        onConfirmar={confirmarReprogramar}
        onCerrar={() => {
          if (procesandoReprog) return;
          setModalReprogramar(false);
          setErrorReprog('');
        }}
        procesando={procesandoReprog}
        error={errorReprog}
      />
    </div>
  );
}