import { BloqueDisponibilidad } from '../models/Disponibilidad';

const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:8000';

/* Convierte "08:00" en "08:00:00" para enviar al backend */
function conSegundos(hora) {
  if (!hora) return hora;
  return hora.length === 5 ? `${hora}:00` : hora;
}

/* ============ Consultar ============ */
export async function consultarDisponibilidad(idTerapeuta) {
  const response = await fetch(`${API_URL}/disponibilidad/${idTerapeuta}`);

  if (!response.ok) {
    let detalle = 'Error al consultar la disponibilidad';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo obtener la disponibilidad');
  }

  return data.data.map((b) => new BloqueDisponibilidad(b));
}

/* ============ Registrar (POST) ============ */
export async function registrarDisponibilidad(idTerapeuta, bloques) {
  console.log('🔍 [SERVICE] idTerapeuta:', idTerapeuta);
  console.log('🔍 [SERVICE] bloques:', bloques);
  console.log('🔍 [SERVICE] bloques.length:', bloques?.length);

  const body = {
    id_terapeuta: idTerapeuta,
    bloques: bloques.map((b) => ({
      dia_semana: b.dia_semana,
      hora_inicio: conSegundos(b.hora_inicio),
      hora_fin: conSegundos(b.hora_fin),
    })),
  };

  console.log('🔍 [SERVICE] body:', JSON.stringify(body));

  const response = await fetch(`${API_URL}/disponibilidad/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let detalle = 'Error al registrar la disponibilidad';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo registrar');
  }

  return data;
}

/* ============ Actualizar (PUT) ============ */
export async function actualizarDisponibilidad(idTerapeuta, bloques) {
  const response = await fetch(`${API_URL}/disponibilidad/actualizar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_terapeuta: idTerapeuta,
      bloques: bloques.map((b) => ({
        dia_semana: b.dia_semana,
        hora_inicio: conSegundos(b.hora_inicio),
        hora_fin: conSegundos(b.hora_fin),
      })),
    }),
  });

  if (!response.ok) {
    let detalle = 'Error al actualizar la disponibilidad';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo actualizar');
  }

  return data;
}