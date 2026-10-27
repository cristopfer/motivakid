const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:8000';

/* ============ Consultar asistencia de hoy para un terapeuta ============ */
export async function obtenerAsistenciaHoy(idTerapeuta) {
  const response = await fetch(`${API_URL}/asistencia/hoy/${idTerapeuta}`);

  if (!response.ok) {
    let detalle = 'Error al obtener la agenda del día';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo obtener la agenda');
  }

  return data.data;
}

/* ============ Registrar asistencia (POST) ============ */
/* Nota: el backend espera id_terapeuta y estado */
export async function controlAsistencia(idTerapeuta, estado) {
  const response = await fetch(`${API_URL}/asistencia/control`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_terapeuta: idTerapeuta,
      estado: estado, // 'Asistió' | 'No Asistió' (el SP lo normaliza)
    }),
  });

  if (!response.ok) {
    let detalle = 'Error al registrar la asistencia';
    try {
      const err = await response.json();
      if (Array.isArray(err.detail)) {
        detalle = err.detail.map((d) => `${d.loc.join('.')}: ${d.msg}`).join(' | ');
      } else {
        detalle = err.detail || detalle;
      }
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo registrar la asistencia');
  }

  return data;
}