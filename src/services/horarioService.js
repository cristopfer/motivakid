const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:8000';

/* Convierte Date → 'YYYY-MM-DD' */
function toISODate(fecha) {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* Obtiene los horarios de un terapeuta en un rango de fechas */
export async function obtenerHorariosTerapeuta(idTerapeuta, fechaLunes, fechaDomingo) {
  const params = new URLSearchParams({
    fecha_lunes: toISODate(fechaLunes),
    fecha_domingo: toISODate(fechaDomingo),
  });

  const response = await fetch(
    `${API_URL}/horarios/terapeuta/${idTerapeuta}?${params.toString()}`
  );

  if (!response.ok) {
    let detalle = 'Error al obtener los horarios';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo obtener los horarios');
  }

  return data.data; // array de citas
}