const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:8000';

/* ============ Listar pagos de pacientes ============ */
export async function listarPagosPacientes(idPaciente = null, estado = null, formaPago = null) {
  const params = new URLSearchParams();
  if (idPaciente && idPaciente !== 'todos') params.append('id_paciente', idPaciente);
  if (estado && estado !== 'todos') params.append('estado', estado);
  if (formaPago && formaPago !== 'todos') params.append('forma_pago', formaPago);

  const url = `${API_URL}/pagos/pacientes${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Error al obtener los pagos de pacientes');
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo obtener la lista de pagos');
  }

  return data.data; // array de pagos
}

/* ============ Actualizar / generar pagos pendientes ============ */
export async function actualizarPagosPacientes() {
  const response = await fetch(`${API_URL}/pagos/pacientes/actualizar`, {
    method: 'POST',
  });

  if (!response.ok) {
    let detalle = 'Error al generar los pagos pendientes';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo actualizar los pagos');
  }

  return data; // { success, message, pagos_generados }
}

/* ============ Guardar / actualizar un pago ============ */
export async function guardarPago(datos) {
  const response = await fetch(`${API_URL}/pagos/pacientes/guardar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_pago_paciente: datos.id_pago_paciente,
      monto: Number(datos.monto),
      forma_pago: datos.forma_pago,
      fecha_pago: datos.fecha_pago, // 'YYYY-MM-DD'
    }),
  });

  if (!response.ok) {
    let detalle = 'Error al guardar el pago';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo guardar el pago');
  }

  return data;
}