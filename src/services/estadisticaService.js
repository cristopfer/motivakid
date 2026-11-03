const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:8000';

export async function obtenerEstadisticas() {
  const response = await fetch(`${API_URL}/reportes/estadisticas`);

  if (!response.ok) {
    let detalle = 'Error al obtener las estadísticas';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudieron obtener las estadísticas');
  }

  return data.data;
}