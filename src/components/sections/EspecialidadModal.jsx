import { useEffect, useState } from 'react';
import './EspecialidadModal.css';

export function EspecialidadModal({
  abierto,
  modo = 'crear',              // 'crear' | 'editar'
  especialidad = null,         // { id, nombre }
  onCerrar,
  onGuardar,
  guardando = false,
  error = '',
}) {
  const esEditar = modo === 'editar';
  const [nombre, setNombre] = useState('');

  /* Precargar en edición / resetear en creación */
  useEffect(() => {
    if (!abierto) return;
    setNombre(esEditar && especialidad ? especialidad.nombre || '' : '');
  }, [abierto, esEditar, especialidad]);

  /* Cerrar con ESC */
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e) => { if (e.key === 'Escape' && !guardando) onCerrar(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [abierto, onCerrar, guardando]);

  if (!abierto) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const datos = {
      ...(esEditar && especialidad ? { id_especialidad: especialidad.id } : {}),
      nombre: nombre.trim(),
    };
    onGuardar?.(datos);
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => !guardando && onCerrar()}
    >
      <div
        className="modal-card modal-card-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-avatar modal-avatar-star">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff">
                <path d="M12 17.3l-6.2 3.7 1.6-7.1L2 9.2l7.2-.6L12 2l2.8 6.6 7.2.6-5.4 4.7 1.6 7.1z"/>
              </svg>
            </div>
            <div>
              <h2>{esEditar ? 'Editar Especialidad' : 'Nueva Especialidad'}</h2>
              <p>
                {esEditar
                  ? 'Actualiza el nombre de la especialidad'
                  : 'Registra el nombre de la nueva especialidad'}
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
            <div className="modal-field modal-field-full">
              <label>Nombre de la especialidad <span>*</span></label>
              <input
                type="text"
                placeholder="Ej. Lenguaje, Psicología, Terapia ocupacional..."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoComplete="off"
                autoFocus
                required
                disabled={guardando}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="modal-error">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#e91e63">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2zm0-4h-2V7h2z"/>
              </svg>
              {error}
            </div>
          )}

          {/* Footer */}
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
                  Registrar especialidad
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}