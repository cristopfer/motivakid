import { useEffect, useState } from 'react';
import './PacienteModal.css';

export function PacienteModal({ abierto, modo = 'crear', paciente = null, onCerrar, onGuardar, guardando = false, error = '', }) {
  const esEditar = modo === 'editar';

  /* Estado local del formulario */
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    fechaNac: '',
    diagnostico: '',
    motivo: '',
    telefono: '',
    apoderado: '',
    correo: '',
  });

  const OPCIONES_DIAGNOSTICO = [
    'Trastorno por Déficit de Atención e Hiperactividad (TDAH)',
    'Trastorno del Espectro Autista (TEA)',
    'Trastornos del Aprendizaje',
    'Trastornos de la Comunicación',
    'Discapacidad Intelectual',
    'Trastornos de Ansiedad',
    'Trastorno de Desregulación Disruptiva del Estado de Ánimo',
    'Depresión',
    'Trastorno Negativista Desafiante',
    'Trastorno de Conducta',
  ];

  /* Precargar datos cuando es edición */
  useEffect(() => {
    if (!abierto) return;

    if (esEditar && paciente) {
      setForm({
        nombre: paciente.nombre || '',
        apellido: paciente.apellido || '',
        fechaNac: paciente.fecha || '',        // ← aquí usamos paciente.fecha
        diagnostico: paciente.diagnostico || '',
        motivo: paciente.motivo || '',         // ← aquí usamos paciente.motivo
        telefono: paciente.telefono || '',
        apoderado: paciente.apoderado || '',   // ← aquí usamos paciente.apoderado
        correo: paciente.correo || '',
      });
    } else {
      setForm({ /* vacío */ });
    }
  }, [abierto, esEditar, paciente]);

  /* Cerrar con ESC */
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e) => { if (e.key === 'Escape') onCerrar(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const datos = {
      /* Al editar, incluimos el id */
      ...(esEditar && paciente ? { id_paciente: paciente.id } : {}),
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      fechaNac: form.fechaNac,
      diagnostico: form.diagnostico.trim(),
      motivo: form.motivo.trim(),
      telefono: form.telefono.trim(),
      apoderado: form.apoderado.trim(),
      correo: form.correo.trim(),
    };

    onGuardar?.(datos);
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-avatar">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff">
                <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 1.9 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z"/>
              </svg>
            </div>
            <div>
              <h2>{esEditar ? 'Editar Paciente' : 'Nuevo Paciente'}</h2>
              <p>
                {esEditar
                  ? 'Actualiza los datos del paciente'
                  : 'Registra los datos del nuevo paciente'}
              </p>
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
            <div className="modal-field">
              <label>Nombre del paciente <span>*</span></label>
              <input
                name="nombre"
                type="text"
                placeholder="Ej. Juan Pérez"
                value={form.nombre}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>

            <div className="modal-field">
              <label>Apellido del paciente <span>*</span></label>
              <input
                name="apellido"
                type="text"
                placeholder="Ej. García López"
                value={form.apellido}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>

            <div className="modal-field">
              <label>Fecha de nacimiento <span>*</span></label>
              <input
                name="fechaNac"
                type="date"
                value={form.fechaNac}
                onChange={handleChange}
                required
              />
            </div>

            <div className="modal-field">
              <label>Teléfono</label>
              <input
                name="telefono"
                type="tel"
                placeholder="Ej. 987654321"
                value={form.telefono}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            <div className="modal-field">
              <label>Diagnóstico <span>*</span></label>
                <select
                  name="diagnostico"
                  value={form.diagnostico}
                  onChange={handleChange}
                  required
                  disabled={guardando}
                  className="modal-select"
                >
                  <option value="">Selecciona un diagnóstico</option>
                  {OPCIONES_DIAGNOSTICO.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
            </div>

            <div className="modal-field">
              <label>Apoderado</label>
              <input
                name="apoderado"
                type="text"
                placeholder="Ej. María López"
                value={form.apoderado}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            <div className="modal-field modal-field-full">
              <label>Correo electrónico</label>
              <input
                name="correo"
                type="email"
                placeholder="Ej. correo@ejemplo.com"
                value={form.correo}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            <div className="modal-field modal-field-full">
              <label>Motivo de la consulta <span>*</span></label>
              <textarea
                name="motivo"
                rows="4"
                placeholder="Describe brevemente el motivo de la consulta..."
                value={form.motivo}
                onChange={handleChange}
                required
              />
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
          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={onCerrar}
            >
              Cancelar
            </button>
            <button type="submit" className="modal-btn modal-btn-primary" disabled={guardando}>
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
                  Registrar paciente
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}