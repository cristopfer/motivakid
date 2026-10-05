import { Especialidad } from '../models/Especialidad';

const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:8000';

/* ============ Listar ============ */
export async function listarEspecialidades() {
  const response = await fetch(`${API_URL}/especialidades`);

  if (!response.ok) {
    throw new Error('Error al obtener las especialidades');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'No se pudo obtener las especialidades');
  }

  return data.data.map((e) => new Especialidad(e));
}

/* ============ Registrar ============ */
export async function registrarEspecialidad(datos) {
  const response = await fetch(`${API_URL}/especialidades/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: datos.nombre }),
  });

  if (!response.ok) {
    let detalle = 'Error al registrar la especialidad';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo registrar la especialidad');
  }

  return data; // { success, id_especialidad, message }
}

/* ============ Eliminar especialidad (DELETE) ============ */
export async function eliminarEspecialidad(id) {
  const response = await fetch(`${API_URL}/especialidades/eliminar/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    let detalle = 'Error al eliminar la especialidad';
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

/* ============ Activar especialidad (PUT) ============ */
export async function activarEspecialidad(id) {
  const response = await fetch(`${API_URL}/especialidades/activar/${id}`, {
    method: 'PUT',
  });

  if (!response.ok) {
    let detalle = 'Error al activar la especialidad';
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

/* ============ Consultar especialidad por ID ============ */
export async function consultarEspecialidad(id) {
  const response = await fetch(`${API_URL}/especialidades/${id}`);

  if (!response.ok) {
    let detalle = 'Error al consultar la especialidad';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo obtener la especialidad');
  }

  /* data.data = { id_especialidad, nombre, estado }  (según tu SP) */
  return data.data;
}

/* ============ Actualizar especialidad (PUT) ============ */
export async function actualizarEspecialidad(datos) {
  const response = await fetch(`${API_URL}/especialidades/actualizar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_especialidad: datos.id_especialidad,
      nombre: datos.nombre,
    }),
  });

  if (!response.ok) {
    let detalle = 'Error al actualizar la especialidad';
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

  return data; // { success, message }
}