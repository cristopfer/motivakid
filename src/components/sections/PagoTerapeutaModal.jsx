import { useEffect, useState } from 'react';
import './PagoTerapeutaModal.css';

export function PagoTerapeutaModal({
  abierto,
  pago = null,
  periodo = '',
  onCerrar,
  onGuardar,
  guardando = false,
  error = '',
}) {
  const [form, setForm] = useState({
    modalidadPago: 'Mensual',
    montoBase: '',
    descuento: '',
    fechaPago: '',
  });

  useEffect(() => {
    if (!abierto) return;
    if (pago) {
      setForm({
        modalidadPago: pago.modalidad_pago || 'Mensual',
        montoBase: pago.monto_base ?? '',
        descuento: pago.descuento ?? '',
        fechaPago: pago.fecha_pago
          ? String(pago.fecha_pago).substring(0, 10)
          : '',
      });
    } else {
      setForm({
        modalidadPago: 'Mensual',
        montoBase: '',
        descuento: '',
        fechaPago: '',
      });
    }
  }, [abierto, pago]);

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
      id_pago_terapeuta: pago.id_pago_terapeuta,
      id_terapeuta: pago.id_terapeuta,   // ✅ ahora el SP lo devuelve
      periodo,                            // del filtro mes/año
      modalidad_pago: form.modalidadPago,
      monto_base: Number(form.montoBase),
      descuento: Number(form.descuento || 0),
      fecha_pago: form.fechaPago,
    });
  };

  return (
    <div className="modal-overlay" onClick={() => !guardando && onCerrar()}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-avatar">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
            </div>
            <div>
              <h2>Editar Pago del Terapeuta</h2>
              <p>Actualiza los datos del pago de {pago?.terapeuta || '—'}</p>
            </div>
          </div>

          <button className="modal-close" onClick={() => !guardando && onCerrar()} aria-label="Cerrar">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/>
            </svg>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-grid">
            <div className="modal-field">
              <label>Modalidad de pago <span>*</span></label>
              <select
                name="modalidadPago"
                value={form.modalidadPago}
                onChange={handleChange}
                required
                disabled={guardando}
                className="modal-select"
              >
                <option value="">Selecciona modalidad</option>
                <option value="Mensual">Mensual</option>
                <option value="Horaria">Horaria</option>
              </select>
            </div>

            <div className="modal-field">
              <label>Monto base <span>*</span></label>
              <input
                type="number"
                name="montoBase"
                step="0.01"
                min="0"
                placeholder="Ej. 1500.00"
                value={form.montoBase}
                onChange={handleChange}
                required
                disabled={guardando}
              />
            </div>

            <div className="modal-field">
              <label>Descuento</label>
              <input
                type="number"
                name="descuento"
                step="0.01"
                min="0"
                placeholder="Ej. 50.00"
                value={form.descuento}
                onChange={handleChange}
                disabled={guardando}
              />
            </div>

            <div className="modal-field">
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