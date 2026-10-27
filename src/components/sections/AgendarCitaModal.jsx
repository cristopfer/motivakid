import { useEffect, useMemo, useState } from 'react';
import './AgendarCitaModal.css';
import { useEspecialidadesViewModel } from '../../hooks/useEspecialidadesViewModel';
import { useTerapeutasViewModel } from '../../hooks/useTerapeutasViewModel';
import { useDisponibilidadViewModel } from '../../hooks/useDisponibilidadViewModel';

const NOMBRES_DIAS = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

export function AgendarCitaModal({ abierto, onCerrar, onAgendar }) {
  const { especialidades } = useEspecialidadesViewModel();
  const { terapeutas } = useTerapeutasViewModel();

  const {
    bloques,
    cargando: cargandoDisp,
    cargarDisponibilidad,
  } = useDisponibilidadViewModel();

  const [idPaciente, setIdPaciente] = useState('');
  const [idEspecialidad, setIdEspecialidad] = useState('');
  const [idTerapeuta, setIdTerapeuta] = useState('');
  const [fecha, setFecha] = useState('');
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);
  const [error, setError] = useState('');

  /* Resetear al abrir */
  useEffect(() => {
    if (!abierto) return;
    setIdPaciente('');
    setIdEspecialidad('');
    setIdTerapeuta('');
    setFecha('');
    setBloqueSeleccionado(null);
    setError('');
  }, [abierto]);

  /* Terapeutas filtrados por especialidad */
  const terapeutasFiltrados = useMemo(() => {
    if (!idEspecialidad) return [];
    return terapeutas.filter(
      (t) => t.estado && String(t.id_especialidad) === String(idEspecialidad)
    );
  }, [idEspecialidad, terapeutas]);

  /* Al cambiar terapeuta o fecha, cargar disponibilidad */
  useEffect(() => {
    setBloqueSeleccionado(null);
    if (!idTerapeuta || !fecha) {
      return;
    }
    cargarDisponibilidad(Number(idTerapeuta));
  }, [idTerapeuta, fecha, cargarDisponibilidad]);

  /* Bloques disponibles para el día de la semana de la fecha elegida */
  const bloquesDelDia = useMemo(() => {
    if (!fecha) return [];
    const d = new Date(fecha + 'T00:00:00');
    const nombreDia = NOMBRES_DIAS[d.getDay()];
    return bloques.filter((b) => b.dia_semana === nombreDia);
  }, [bloques, fecha]);

  if (!abierto) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!idPaciente) return setError('Selecciona un paciente');
    if (!idEspecialidad) return setError('Selecciona una especialidad');
    if (!idTerapeuta) return setError('Selecciona un terapeuta');
    if (!fecha) return setError('Selecciona una fecha');
    if (!bloqueSeleccionado) return setError('Selecciona un horario disponible');

    onAgendar?.({
      id_paciente: Number(idPaciente),
      id_terapeuta: Number(idTerapeuta),
      fecha,
      hora_inicio: bloqueSeleccionado.hora_inicio,
      hora_fin: bloqueSeleccionado.hora_fin,
    });
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-avatar">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
              </svg>
            </div>
            <div>
              <h2>Agendar Cita</h2>
              <p>Completa los datos para agendar una nueva cita</p>
            </div>
          </div>
          <button className="modal-close" onClick={onCerrar} aria-label="Cerrar">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-grid">

            {/* Paciente */}
            <div className="modal-field modal-field-full">
              <label>Paciente <span>*</span></label>
              <select
                value={idPaciente}
                onChange={(e) => setIdPaciente(e.target.value)}
                className="modal-select"
              >
                <option value="">Selecciona un paciente</option>
                {/* Cuando conectes pacientes, rellena aquí */}
              </select>
            </div>

            {/* Especialidad */}
            <div className="modal-field">
              <label>Especialidad <span>*</span></label>
              <select
                value={idEspecialidad}
                onChange={(e) => {
                  setIdEspecialidad(e.target.value);
                  setIdTerapeuta('');
                }}
                className="modal-select"
              >
                <option value="">Selecciona especialidad</option>
                {especialidades
                  .filter((e) => e.estado)
                  .map((e) => (
                    <option key={e.id} value={String(e.id)}>{e.nombre}</option>
                  ))}
              </select>
            </div>

            {/* Terapeuta */}
            <div className="modal-field">
              <label>Terapeuta <span>*</span></label>
              <select
                value={idTerapeuta}
                onChange={(e) => setIdTerapeuta(e.target.value)}
                disabled={!idEspecialidad}
                className="modal-select"
              >
                <option value="">
                  {idEspecialidad ? 'Selecciona terapeuta' : 'Elige especialidad primero'}
                </option>
                {terapeutasFiltrados.map((t) => (
                  <option key={t.id} value={String(t.id)}>{t.nombreCompleto}</option>
                ))}
              </select>
            </div>

            {/* Fecha */}
            <div className="modal-field modal-field-full">
              <label>Fecha <span>*</span></label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="modal-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Horarios disponibles */}
            {idTerapeuta && fecha && (
              <div className="modal-field modal-field-full">
                <label>Horarios disponibles <span>*</span></label>

                {cargandoDisp ? (
                  <p className="agenda-hint">Cargando disponibilidad...</p>
                ) : bloquesDelDia.length === 0 ? (
                  <p className="agenda-hint agenda-hint-error">
                    No hay horarios disponibles para este día
                  </p>
                ) : (
                  <div className="horarios-grid">
                    {bloquesDelDia.map((b) => {
                      const activo =
                        bloqueSeleccionado?.hora_inicio === b.hora_inicio &&
                        bloqueSeleccionado?.hora_fin === b.hora_fin;

                      return (
                        <button
                          type="button"
                          key={`${b.hora_inicio}-${b.hora_fin}`}
                          className={`horario-chip ${activo ? 'active' : ''}`}
                          onClick={() => setBloqueSeleccionado(b)}
                        >
                          {b.hora_inicio} - {b.hora_fin}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="modal-error">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#e91e63">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2zm0-4h-2V7h2z"/>
              </svg>
              {error}
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="modal-btn modal-btn-cancel" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="modal-btn modal-btn-primary">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
              </svg>
              Agendar cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}