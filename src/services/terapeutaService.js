import { Terapeuta } from '../models/Terapeuta';

const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:8000';

/* ============ Listar terapeutas ============ */
export async function listarTerapeutas() {
  const response = await fetch(`${API_URL}/terapeutas`);

  if (!response.ok) {
    throw new Error('Error al obtener los terapeutas');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'No se pudo obtener los terapeutas');
  }

  return data.data.map((t) => new Terapeuta(t));
}

/* ============ Registrar terapeuta ============ */
export async function registrarTerapeuta(datos) {
  const response = await fetch(`${API_URL}/terapeutas/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombres: datos.nombre,           // ⚠️ rename: nombre → nombres
      apellidos: datos.apellido,       // ⚠️ rename: apellido → apellidos
      id_especialidad: datos.id_especialidad,
    }),
  });

  if (!response.ok) {
    let detalle = 'Error al registrar el terapeuta';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo registrar el terapeuta');
  }

  return data;
}

/* ============ Eliminar terapeuta (DELETE) ============ */
export async function eliminarTerapeuta(id) {
  const response = await fetch(`${API_URL}/terapeutas/eliminar/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    let detalle = 'Error al eliminar el terapeuta';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo eliminar');
  }
  return data;
}

/* ============ Activar terapeuta (PUT) ============ */
export async function activarTerapeuta(id) {
  const response = await fetch(`${API_URL}/terapeutas/activar/${id}`, {
    method: 'PUT',
  });

  if (!response.ok) {
    let detalle = 'Error al activar el terapeuta';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo activar');
  }
  return data;
}

/* ============ Consultar terapeuta por ID ============ */
export async function consultarTerapeuta(id) {
  const response = await fetch(`${API_URL}/terapeutas/${id}`);

  if (!response.ok) {
    let detalle = 'Error al consultar el terapeuta';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo obtener el terapeuta');
  }

  /* data.data = { id_terapeuta, nombres, apellidos, id_especialidad, estado?, ... } */
  return data.data;
}

/* ============ Actualizar terapeuta (PUT) ============ */
export async function actualizarTerapeuta(datos) {
  const response = await fetch(`${API_URL}/terapeutas/actualizar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_terapeuta: datos.id_terapeuta,
      nombres: datos.nombre,        // ⚠️ rename: nombre → nombres
      apellidos: datos.apellido,    // ⚠️ rename: apellido → apellidos
      id_especialidad: datos.id_especialidad,
    }),
  });

  if (!response.ok) {
    let detalle = 'Error al actualizar el terapeuta';
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