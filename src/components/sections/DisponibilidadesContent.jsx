import { useState, useEffect } from 'react';
import './DisponibilidadesContent.css';
import { useTerapeutasViewModel } from '../../hooks/useTerapeutasViewModel';
import { useDisponibilidadViewModel } from '../../hooks/useDisponibilidadViewModel';
import { useEspecialidadesViewModel } from '../../hooks/useEspecialidadesViewModel';
import { DIAS, HORAS } from '../../models/Disponibilidad';

export function DisponibilidadesContent() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const [terapeutaSeleccionado, setTerapeutaSeleccionado] = useState(null);

  const { especialidades } = useEspecialidadesViewModel();
  /* Terapeutas */
  const {
    cargando: cargandoTerapeutas,
    error: errorTerapeutas,
    filtrar,
  } = useTerapeutasViewModel();

  const terapeutasFiltrados = filtrar(busqueda, filtroEspecialidad, filtroEstado);

  /* Disponibilidad */
  const {
    bloques,
    cargando: cargandoDisp,
    guardando,
    error: errorDisp,
    cargarDisponibilidad,
    toggleBloque,
    estaDisponible,
    guardarDisponibilidad,
  } = useDisponibilidadViewModel();

  /* Cuando se selecciona un terapeuta, cargamos su disponibilidad */
  useEffect(() => {
    if (terapeutaSeleccionado) {
      cargarDisponibilidad(terapeutaSeleccionado.id);
    }
  }, [terapeutaSeleccionado, cargarDisponibilidad]);

  /* ========== Guardar disponibilidad ========== */
  const handleGuardar = async () => {
    if (!terapeutaSeleccionado) return;
    if (cargandoDisp) return;
    if (bloques.length === 0) {
      alert('No hay bloques seleccionados para guardar');
      return;
    }

    try {
      const res = await guardarDisponibilidad(terapeutaSeleccionado.id);
      alert(res.message || 'Disponibilidad guardada');
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  return (
    <div className="disponibilidades-content">

      {/* ============ BANNER ============ */}
      <section className="disp-banner">
        <div className="disp-banner-icon">
          <svg viewBox="0 0 24 24" width="38" height="38" fill="#fff">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM7 12h5v5H7z"/>
          </svg>
        </div>
        <div className="disp-banner-text">
          <h1>Disponibilidad de Terapeutas</h1>
          <p>
            Gestiona los horarios de atención de los terapeutas
            y mantén actualizada su disponibilidad semanal.
          </p>
        </div>
        <span className="disp-deco disp-deco-confetti">🎉</span>
        <span className="disp-deco disp-deco-heart">♥</span>
        <span className="disp-deco disp-deco-star">★</span>
        <div className="disp-banner-image">
          <div className="disp-banner-sticker">
            <span>Cada niño</span>
            <span>merece un gran</span>
            <span>acompañamiento</span>
          </div>
        </div>
      </section>

      {/* ============ FILTROS ============ */}
      <section className="disp-filters">
        <div className="disp-search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#a855f7" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar terapeuta..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <select
          className="disp-select"
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
          className="disp-select"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="retirado">Retirado</option>
        </select>
      </section>

      {/* ============ LAYOUT DOS COLUMNAS ============ */}
      <section className="disp-layout">

        {/* ---- Lista de terapeutas ---- */}
        <aside className="disp-list-card">
          <div className="disp-list-header">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#a855f7">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
            </svg>
            <h3>Terapeutas</h3>
          </div>

          <div className="disp-list-body">
            {cargandoTerapeutas ? (
              <p className="disp-empty-list">Cargando terapeutas...</p>
            ) : errorTerapeutas ? (
              <p className="disp-empty-list" style={{ color: '#e91e63' }}>{errorTerapeutas}</p>
            ) : terapeutasFiltrados.length === 0 ? (
              <p className="disp-empty-list">No hay terapeutas</p>
            ) : (
              terapeutasFiltrados.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  className={`disp-item ${terapeutaSeleccionado?.id === t.id ? 'active' : ''}`}
                  onClick={() => setTerapeutaSeleccionado(t)}
                >
                  <div className="disp-item-avatar">{t.iniciales}</div>
                  <div className="disp-item-info">
                    <span className="disp-item-name">{t.nombreCompleto}</span>
                    <span className="disp-item-esp">{t.especialidad}</span>
                  </div>
                  <span className={`disp-item-badge ${t.estado ? 'activo' : 'retirado'}`}>
                    {t.estado ? 'Activo' : 'Retirado'}
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* ---- Detalle de disponibilidad ---- */}
        <div className="disp-detail-card">

          {/* Cabecera */}
          <div className="disp-detail-header">
            <div className="disp-avatar">
              {terapeutaSeleccionado ? terapeutaSeleccionado.iniciales : '--'}
            </div>
            <div className="disp-detail-info">
              <h2>{terapeutaSeleccionado?.nombreCompleto || 'Sin terapeuta seleccionado'}</h2>
              <span className="disp-detail-sub">
                {terapeutaSeleccionado?.especialidad || '—'}
              </span>
            </div>

            <button
              type="button"
              className="disp-edit-btn"
              onClick={handleGuardar}
              disabled={!terapeutaSeleccionado || guardando || cargandoDisp}
            >
              {guardando ? 'Guardando...' : 'Guardar disponibilidad'}
            </button>
          </div>

          {/* Grid de disponibilidad */}
          {!terapeutaSeleccionado ? (
            <p className="disp-empty-msg">
              Selecciona un terapeuta para ver y editar su disponibilidad.
            </p>
          ) : cargandoDisp ? (
            <p className="disp-empty-msg">Cargando disponibilidad...</p>
          ) : errorDisp ? (
            <p className="disp-empty-msg" style={{ color: '#e91e63' }}>{errorDisp}</p>
          ) : (
            <div className="disp-grid-wrapper">
              <table className="disp-grid">
                <thead>
                  <tr>
                    <th className="col-hora">Hora</th>
                    {DIAS.map((d) => (
                      <th key={d.id}>{d.nombre}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HORAS.map((h) => (
                    <tr key={h.label}>
                      <td className="col-hora">{h.label}</td>
                      {DIAS.map((d) => {
                        const activo = estaDisponible(d.valor, h.inicio, h.fin);
                        return (
                          <td key={d.id} className="disp-cell">
                            <button
                              type="button"
                              className={`disp-block ${activo ? 'on' : ''}`}
                              onClick={() => toggleBloque(d.valor, h.inicio, h.fin)}
                              title={`${d.nombre} ${h.label}`}
                            >
                              {activo ? '●' : '—'}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Nota informativa */}
          <div className="disp-note">
            <span className="note-icon">ℹ️</span>
            <p>
              Los horarios disponibles se utilizan para la programación de citas.
              Puedes actualizar la disponibilidad en cualquier momento.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}