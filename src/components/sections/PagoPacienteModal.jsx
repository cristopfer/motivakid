import { useEffect, useState } from 'react';
import './PagoPacienteModal.css';

export function PagoPacienteModal({
  abierto,
  pago = null,
  onCerrar,
  onGuardar,
  guardando = false,
  error = '',
}) {
  const [form, setForm] = useState({
    monto: '',
    formaPago: '',
    fechaPago: '',
  });

  /* Precargar datos del pago seleccionado */
  useEffect(() => {
    if (!abierto) return;
    if (pago) {
      setForm({
        monto: pago.monto ?? '',
        formaPago: pago.forma_pago ?? '',
        fechaPago: pago.fecha_pago
          ? String(pago.fecha_pago).substring(0, 10)
          : '',
      });
    } else {
      setForm({ monto: '', formaPago: '', fechaPago: '' });
    }
  }, [abierto, pago]);

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
    onGuardar?.({
      id_pago_paciente: pago.id_pago_paciente,
      monto: Number(form.monto),
      forma_pago: form.formaPago,
      fecha_pago: form.fechaPago,
    });
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
            <div className="modal-avatar">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
            </div>
            <div>
              <h2>Editar Pago</h2>
              <p>Actualiza los datos del pago del paciente</p>
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

            {/* Monto */}
            <div className="modal-field">
              <label>Monto <span>*</span></label>
              <input
                type="number"
                name="monto"
                step="0.01"
                min="0"
                placeholder="Ej. 150.00"
                value={form.monto}
                onChange={handleChange}
                required
                disabled={guardando}
              />
            </div>

            {/* Forma de pago */}
            <div className="modal-field">
              <label>Forma de pago <span>*</span></label>
              <select
                name="formaPago"
                value={form.formaPago}
                onChange={handleChange}
                required
                disabled={guardando}
                className="modal-select"
              >
                <option value="">Selecciona forma de pago</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Yape">Yape</option>
                <option value="Plin">Plin</option>
              </select>
            </div>

            {/* Fecha de pago */}
            <div className="modal-field modal-field-full">
              <label>Fecha de pago <span>*</span></label>
              <input
                type="date"
                name="fechaPago"
                value={form.fechaPago}
                onChange={handleChange}
                required
                disabled={guardando}
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
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff">
                    <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75zM20.7 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75z"/>
                  </svg>
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}