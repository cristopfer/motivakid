import { useEffect, useState } from 'react';
import './TerapeutaModal.css';
import { useEspecialidadesViewModel } from '../../hooks/useEspecialidadesViewModel';

export function TerapeutaModal({
  abierto,
  modo = 'crear',
  terapeuta = null,             // { id, nombre, apellido, id_especialidad }
  onCerrar,
  onGuardar,
  guardando = false,
  error = '',
}) {
  const esEditar = modo === 'editar';

  /* Especialidades para el combo */
  const { especialidades } = useEspecialidadesViewModel();

  /* Form */
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    idEspecialidad: '',
  });

  /* Precargar al editar / resetear al crear */
  useEffect(() => {
    if (!abierto) return;
    if (esEditar && terapeuta) {
      setForm({
        nombre: terapeuta.nombre || '',
        apellido: terapeuta.apellido || '',
        idEspecialidad: terapeuta.id_especialidad ?? '',
      });
    } else {
      setForm({ nombre: '', apellido: '', idEspecialidad: '' });
    }
  }, [abierto, esEditar, terapeuta]);

  /* Cerrar con ESC */
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e) => { if (e.key === 'Escape' && !guardando) onCerrar(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [abierto, onCerrar, guardando]);

  if (!abierto) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const datos = {
      ...(esEditar && terapeuta ? { id_terapeuta: terapeuta.id } : {}),
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      id_especialidad: Number(form.idEspecialidad),
    };

    onGuardar?.(datos);
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => !guardando && onCerrar()}
    >
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-avatar modal-avatar-user">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff">
                <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.7-9.8 4.9v2.5h19.6v-2.5c0-3.2-6.5-4.9-9.8-4.9z"/>
              </svg>
            </div>
            <div>
              <h2>{esEditar ? 'Editar Terapeuta' : 'Nuevo Terapeuta'}</h2>
              <p>
                {esEditar
                  ? 'Actualiza los datos del terapeuta'
                  : 'Registra los datos del nuevo terapeuta'}
              </p>
            </div>
          </div>

          <button
            className="modal-close"
            onClick={() => !guardando && onCerrar()}
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-grid">
            <div className="modal-field">
              <label>Nombre del terapeuta <span>*</span></label>
              <input
                name="nombre"
                type="text"
                placeholder="Ej. María"
                value={form.nombre}
                onChange={handleChange}
                autoComplete="off"
                required
                disabled={guardando}
              />
            </div>

            <div className="modal-field">
              <label>Apellido del terapeuta <span>*</span></label>
              <input
                name="apellido"
                type="text"
                placeholder="Ej. Torres Castillo"
                value={form.apellido}
                onChange={handleChange}
                autoComplete="off"
                required
                disabled={guardando}
              />
            </div>

            <div className="modal-field modal-field-full">
              <label>Especialidad <span>*</span></label>
              <select
                name="idEspecialidad"
                value={form.idEspecialidad}
                onChange={handleChange}
                required
                disabled={guardando}
                className="modal-select"
              >
                <option value="">Selecciona una especialidad</option>
                {especialidades
                  .filter((e) => e.estado) // solo activas
                  .map((e) => (
                    <option key={e.id} value={String(e.id)}>
                      {e.nombre}
                    </option>
                  ))}
              </select>
            </div>
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
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={onCerrar}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-primary"
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <span className="spinner"></span>
                  Guardando...
                </>
              ) : esEditar ? (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff">
                    <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75zM20.7 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75z"/>
                  </svg>
                  Guardar cambios
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/>
                  </svg>
                  Registrar terapeuta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}