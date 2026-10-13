import { useState, useMemo, useEffect } from 'react';
import './HorariosContent.css';
import { useTerapeutasViewModel } from '../../hooks/useTerapeutasViewModel';
import { useHorariosViewModel } from '../../hooks/useHorariosViewModel';
import { getColorPorIndice, getIndiceEspecialidad } from '../../utils/especialidadColors';
import { useEspecialidadesViewModel } from '../../hooks/useEspecialidadesViewModel';
import { HORAS_HORARIO } from '../../models/Disponibilidad';

/* ============ Utilidades de fecha ============ */
function formatearFechaCorta(fecha) {
  const d = fecha.getDate().toString().padStart(2, '0');
  const m = (fecha.getMonth() + 1).toString().padStart(2, '0');
  return `${d}/${m}`;
}

function esMismaFecha(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function obtenerLunes(fecha) {
  const d = new Date(fecha);
  const dia = d.getDay();
  const diff = dia === 0 ? -6 : 1 - dia;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function generarDiasSemana(lunes) {
  const nombres = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return nombres.map((nombre, i) => {
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + i);
    return { nombre, fecha };
  });
}

/* Color del badge según estado de la cita */
function colorEstado(estado) {
  const e = String(estado || '').toLowerCase();
  if (e.includes('confirm')) return 'confirmada';
  if (e.includes('pendien')) return 'pendiente';
  if (e.includes('cancel')) return 'cancelada';
  if (e.includes('asist')) return 'asistio';
  if (e.includes('no asist')) return 'no-asistio';
  return 'default';
}

export function HorariosContent() {
  const [filtroTerapeuta, setFiltroTerapeuta] = useState('todos');
  const [lunes, setLunes] = useState(() => obtenerLunes(new Date()));

  /* Terapeutas */
  const { terapeutas } = useTerapeutasViewModel();

  /* Especialidades para asignar colores */
  const { especialidades } = useEspecialidadesViewModel();

  /* Horarios */
  const { cargando, error, cargarHorarios, limpiar, obtenerCita } = useHorariosViewModel();

  /* Días de la semana */
  const dias = useMemo(() => generarDiasSemana(lunes), [lunes]);

  /* Fecha de hoy */
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  /* Terapeuta seleccionado (objeto completo) */
  const terapeutaActual = useMemo(() => {
    if (filtroTerapeuta === 'todos') return null;
    return terapeutas.find((t) => String(t.id) === String(filtroTerapeuta)) || null;
  }, [filtroTerapeuta, terapeutas]);

  /* Color según el índice de su especialidad en la lista */
  const colorEsp = useMemo(() => {
    if (!terapeutaActual) return null;

    /* Solo especialidades activas, para tener un orden consistente */
    const activas = especialidades.filter((e) => e.estado);
    const idx = getIndiceEspecialidad(terapeutaActual.id_especialidad, activas);
    return getColorPorIndice(idx);
  }, [terapeutaActual, especialidades]);

  /* Rango de fechas (lunes → sábado) */
  const fechaDomingo = useMemo(() => {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + 5); // sábado
    return d;
  }, [lunes]);

  /* Cargar horarios cuando cambia el terapeuta o la semana */
  useEffect(() => {
    if (filtroTerapeuta === 'todos') {
      limpiar();
    } else {
      cargarHorarios(Number(filtroTerapeuta), lunes, fechaDomingo);
    }
  }, [filtroTerapeuta, lunes, fechaDomingo, cargarHorarios, limpiar]);

  /* Navegación de semana */
  const irSemanaAnterior = () => {
    const nuevo = new Date(lunes);
    nuevo.setDate(lunes.getDate() - 7);
    setLunes(nuevo);
  };

  const irSemanaSiguiente = () => {
    const nuevo = new Date(lunes);
    nuevo.setDate(lunes.getDate() + 7);
    setLunes(nuevo);
  };

  const irSemanaActual = () => {
    setLunes(obtenerLunes(new Date()));
  };

  /* Etiqueta de rango */
  const etiquetaRango = useMemo(() => {
    const primero = dias[0].fecha;
    const ultimo = dias[dias.length - 1].fecha;
    const mes = primero.toLocaleDateString('es-PE', { month: 'long' });
    const anio = primero.getFullYear();
    return `Del ${primero.getDate()} al ${ultimo.getDate()} de ${mes} de ${anio}`;
  }, [dias]);

  return (
    <div className="horarios-content">

      {/* ============ BANNER ============ */}
      <section className="hor-banner">
        <div className="hor-banner-icon">
          <svg viewBox="0 0 24 24" width="38" height="38" fill="#fff">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 11h-5v-2h3V6h2z"/>
          </svg>
        </div>
        <div className="hor-banner-text">
          <h1>Horarios de Atención</h1>
          <p>
            Visualiza la programación de los horarios de atención de cada terapeuta
            y paciente. Se generarán los horarios para el día siguiente.
          </p>
        </div>
        <span className="hor-deco hor-deco-confetti">🎉</span>
        <span className="hor-deco hor-deco-star">★</span>
        <div className="hor-banner-image">
          <div className="hor-banner-sticker">
            <span>Cada sesión</span>
            <span>cuenta</span>
            <span className="sticker-heart">♥</span>
          </div>
        </div>
      </section>

      {/* ============ FILTROS ============ */}
      <section className="hor-filters">
        <div className="hor-filter">
          <div className="hor-filter-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
            </svg>
          </div>
          <div className="hor-filter-fields">
            <label>Terapeuta</label>
            <select
              value={filtroTerapeuta}
              onChange={(e) => setFiltroTerapeuta(e.target.value)}
              className="hor-filter-input"
            >
              <option value="todos">Todos los terapeutas</option>
              {terapeutas
                .filter((t) => t.estado)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombreCompleto}
                  </option>
                ))}
            </select>
          </div>
        </div>
        {terapeutaActual && colorEsp && (
          <div
            className="hor-esp-badge"
            style={{
              background: colorEsp.soft,
              color: colorEsp.text,
              borderColor: colorEsp.solid,
            }}
          >
            <span
              className="hor-esp-dot"
              style={{ background: colorEsp.solid }}
            ></span>
            {terapeutaActual.especialidad}
          </div>
        )}
        <button className="hor-generate-btn">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
          </svg>
          Generar horarios para el día siguiente
          <span className="arrow">→</span>
        </button>
      </section>

      {/* ============ TABLA PRINCIPAL ============ */}
      <section className="hor-table-card">

        {/* Header de la tarjeta */}
        <div className="hor-card-header">
          <div className="hor-card-title">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#a855f7">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM7 12h5v5H7z"/>
            </svg>
            <div>
              <h3>Horario de atención</h3>
              <span className="hor-card-sub">{etiquetaRango}</span>
            </div>
          </div>

          <div className="hor-week-nav">
            <button className="hor-week-btn" onClick={irSemanaAnterior} title="Semana anterior">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M15.4 7.4L14 6l-6 6 6 6 1.4-1.4L10.8 12z"/>
              </svg>
            </button>
            <button className="hor-week-today" onClick={irSemanaActual}>Hoy</button>
            <button className="hor-week-btn" onClick={irSemanaSiguiente} title="Semana siguiente">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M8.6 16.6L10 18l6-6-6-6-1.4 1.4L13.2 12z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="hor-table-wrapper">
          <table className="hor-table">
            <thead>
              <tr>
                <th className="col-hora">Hora</th>
                {dias.map((d) => {
                  const esHoy = esMismaFecha(d.fecha, hoy);
                  return (
                    <th key={d.nombre} className={esHoy ? 'dia-hoy' : ''}>
                      <span className="day-name">{d.nombre}</span>
                      <span className="day-date">{formatearFechaCorta(d.fecha)}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {HORAS_HORARIO.map((h) => (
                <tr key={h.label}>
                  <td className="col-hora">{h.label}</td>
                  {dias.map((d) => {
                    const cita = filtroTerapeuta === 'todos'
                      ? null
                      : obtenerCita(d.fecha, h.inicio, h.fin);

                    return (
                      <td key={d.nombre} className="hor-cell">
                        {cita && colorEsp ? (
                          <div
                            className="hor-cita"
                            style={{
                              background: colorEsp.soft,
                              borderLeftColor: colorEsp.solid,
                            }}
                          >
                            <span
                              className="hor-cita-terapeuta"
                              style={{ color: colorEsp.text }}
                            >
                              {cita.terapeuta}
                            </span>
                            <span className="hor-cita-paciente">{cita.paciente}</span>
                            <span className={`hor-cita-badge ${colorEstado(cita.estado)}`}>
                              {cita.estado}
                            </span>
                          </div>
                        ) : (
                          <span className="hor-cell-empty">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {cargando && (
            <div className="hor-loading">Cargando horarios...</div>
          )}
          {error && (
            <div className="hor-error">{error}</div>
          )}
        </div>

        {/* Nota */}
        <div className="hor-note">
          <span className="note-icon">ℹ️</span>
          <p>
            Los horarios se generan automáticamente para el día siguiente,
            considerando la disponibilidad de cada terapeuta.
          </p>
        </div>

      </section>

    </div>
  );
}