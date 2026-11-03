const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:8000';

/* ============ Reporte por paciente ============ */
export async function obtenerReportePaciente(idPaciente) {
  const response = await fetch(`${API_URL}/reportes/pacientes/${idPaciente}`);

  if (!response.ok) {
    let detalle = 'Error al obtener el reporte del paciente';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo obtener el reporte');
  }

  return data.data; // array de registros
}

/* ============ Reporte por terapeuta ============ */
export async function obtenerReporteTerapeuta(idTerapeuta) {
  const response = await fetch(`${API_URL}/reportes/terapeutas/${idTerapeuta}`);

  if (!response.ok) {
    let detalle = 'Error al obtener el reporte del terapeuta';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo obtener el reporte');
  }

  return data.data;
}