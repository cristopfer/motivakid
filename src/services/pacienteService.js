import { Paciente } from '../models/Paciente';

const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:8000';

export async function listarPacientes() {
  const response = await fetch(`${API_URL}/pacientes`);

  if (!response.ok) {
    throw new Error('Error al obtener los pacientes');
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'No se pudo obtener los pacientes');
  }

  /* Mapear al Model */
  return data.data.map((p) => new Paciente(p));
}

export async function registrarPaciente(datos) {
  const response = await fetch(`${API_URL}/pacientes/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: datos.nombre,
      apellido: datos.apellido,
      fecha_nacimiento: datos.fechaNac,       // ⚠️ rename: fechaNac → fecha_nacimiento
      diagnostico: datos.diagnostico,
      motivo_consulta: datos.motivo,          // ⚠️ rename: motivo → motivo_consulta
      telefono: datos.telefono,
      nombre_apoderado: datos.apoderado,      // ⚠️ rename: apoderado → nombre_apoderado
      correo: datos.correo,
    }),
  });

  if (!response.ok) {
    /* Extrae el mensaje del detail de FastAPI si existe */
    let detalle = 'Error al registrar el paciente';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo registrar el paciente');
  }

  return data; // { success, id_paciente, message }
}

/* ============ Eliminar paciente (DELETE) ============ */
export async function eliminarPaciente(id) {
  const response = await fetch(`${API_URL}/pacientes/eliminar/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    let detalle = 'Error al eliminar el paciente';
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
  return data; // { success, message }
}

/* ============ Activar paciente (PUT) ============ */
export async function activarPaciente(id) {
  const response = await fetch(`${API_URL}/pacientes/activar/${id}`, {
    method: 'PUT',
  });

  if (!response.ok) {
    let detalle = 'Error al activar el paciente';
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
  return data; // { success, message }
}

/* ============ Consultar un paciente por ID ============ */
export async function consultarPaciente(id) {
  const response = await fetch(`${API_URL}/pacientes/${id}`);

  if (!response.ok) {
    let detalle = 'Error al consultar el paciente';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo obtener el paciente');
  }

  /* data.data contiene { nombre, apellido, fecha_nacimiento, ... } */
  return data.data;
}

/* ============ Actualizar paciente (PUT) ============ */
export async function actualizarPaciente(datos) {
  const response = await fetch(`${API_URL}/pacientes/actualizar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_paciente: datos.id_paciente,
      nombre: datos.nombre,
      apellido: datos.apellido,
      fecha_nacimiento: datos.fechaNac,
      diagnostico: datos.diagnostico,
      motivo_consulta: datos.motivo,
      telefono: datos.telefono,
      nombre_apoderado: datos.apoderado,
      correo: datos.correo,
    }),
  });

  if (!response.ok) {
    let detalle = 'Error al actualizar el paciente';
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