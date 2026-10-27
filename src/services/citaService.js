const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:8000';

function toISODate(fecha) {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* Obtiene la disponibilidad de un terapeuta en una fecha concreta (con citas) */
export async function obtenerDisponibilidadTerapeuta(idTerapeuta, fecha) {
  const fechaISO = typeof fecha === 'string' ? fecha : toISODate(fecha);

  const response = await fetch(
    `${API_URL}/citas/disponibilidad/${idTerapeuta}?fecha=${fechaISO}`
  );

  if (!response.ok) {
    let detalle = 'Error al obtener las citas';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo obtener las citas');
  }

  return data.data; // array de bloques con paciente, hora_inicio, hora_fin, etc.
}

/* ============ Agendar cita (POST) ============ */
export async function agendarCita(datos) {
  const response = await fetch(`${API_URL}/citas/agendar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_paciente: datos.id_paciente,
      id_terapeuta: datos.id_terapeuta,
      fecha: datos.fecha,               // 'YYYY-MM-DD'
      hora_inicio: datos.hora_inicio,   // 'HH:MM'
      hora_fin: datos.hora_fin,         // 'HH:MM'
    }),
  });

  if (!response.ok) {
    let detalle = 'No se pudo agendar la cita';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo agendar la cita');
  }

  return data; // { success, id_cita, message }
}

/* ============ Liberar / reprogramar cita (DELETE) ============ */
export async function liberarCita(idCita) {
  const response = await fetch(`${API_URL}/citas/reservar/${idCita}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    let detalle = 'Error al liberar la cita';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo liberar la cita');
  }

  return data; // { success, message }
}