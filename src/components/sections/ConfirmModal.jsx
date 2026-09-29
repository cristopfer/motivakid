import { useEffect } from 'react';
import './ConfirmModal.css';

export function ConfirmModal({
  abierto,
  tipo = 'danger',
  titulo = '¿Estás seguro?',
  mensaje = '',
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  onConfirmar,
  onCerrar,
  procesando = false,   // 👈 nuevo
  error = '',           // 👈 nuevo
}) {
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e) => { if (e.key === 'Escape' && !procesando) onCerrar(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [abierto, onCerrar, procesando]);

  if (!abierto) return null;

  const iconDelete = (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="#fff">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  );

  const iconActivate = (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="#fff">
      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
    </svg>
  );

  return (
    <div
      className="confirm-overlay"
      onClick={() => !procesando && onCerrar()}
    >
      <div
        className={`confirm-card confirm-${tipo}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-icon">
          {tipo === 'danger' ? iconDelete : iconActivate}
        </div>

        <h3 className="confirm-title">{titulo}</h3>
        <p className="confirm-message">{mensaje}</p>

        {error && (
          <div className="confirm-error">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#e91e63">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2zm0-4h-2V7h2z"/>
            </svg>
            {error}
          </div>
        )}

        <div className="confirm-actions">
          <button
            type="button"
            className="confirm-btn confirm-btn-cancel"
            onClick={onCerrar}
            disabled={procesando}
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            className={`confirm-btn confirm-btn-${tipo}`}
            onClick={onConfirmar}
            disabled={procesando}
          >
            {procesando ? (
              <>
                <span className="spinner"></span>
                Procesando...
              </>
            ) : (
              textoConfirmar
            )}
          </button>
        </div>
      </div>
    </div>
  );
}