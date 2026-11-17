const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:8000';

export async function obtenerPrediccionDemanda(fechaDesde, fechaHasta, idEspecialidad = null, idTerapeuta = null) {
  const params = new URLSearchParams({
    fecha_desde: fechaDesde,
    fecha_hasta: fechaHasta,
  });
  
  if (idEspecialidad && idEspecialidad !== 'todas') params.append('id_especialidad', idEspecialidad);
  if (idTerapeuta && idTerapeuta !== 'todos') params.append('id_terapeuta', idTerapeuta);

  const response = await fetch(`${API_URL}/prediccion/demanda?${params.toString()}`);

  if (!response.ok) {
    let detalle = 'Error al obtener la predicción de demanda';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo obtener la predicción');
  }

  return data.data;
}