const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:8000';

/* Obtiene las citas del día de hoy para un terapeuta */
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

  return data.data; // array de citas de hoy
}

/* ============ Registrar asistencia (POST) ============ */
export async function controlAsistencia(idCita, estado) {
  const response = await fetch(`${API_URL}/asistencia/control`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_cita: idCita,
      estado, // 'Asistió' | 'No asistió'
    }),
  });

  if (!response.ok) {
    let detalle = 'Error al registrar la asistencia';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo registrar la asistencia');
  }

  return data; // { success, id_asistencia, message }
}