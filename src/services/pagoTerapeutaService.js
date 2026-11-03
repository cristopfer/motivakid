const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:8000';

/* ============ Listar pagos de terapeutas ============ */
export async function listarPagosTerapeutas(periodo = null, idTerapeuta = null) {
  const params = new URLSearchParams();
  if (periodo) params.append('periodo', periodo);
  if (idTerapeuta) params.append('id_terapeuta', idTerapeuta);

  const url = `${API_URL}/pagos/terapeutas${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Error al obtener los pagos de terapeutas');
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo obtener la lista de pagos');
  }

  return data.data;
}

/* ============ Generar / actualizar control de pagos ============ */
export async function generarControlPagos(periodo) {
  const response = await fetch(`${API_URL}/pagos/terapeutas/generar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ periodo }),
  });

  if (!response.ok) {
    let detalle = 'Error al generar los controles de pago';
    try {
      const err = await response.json();
      detalle = err.detail || detalle;
    } catch (_) { /* noop */ }
    throw new Error(detalle);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'No se pudo generar los pagos');
  }

  return data;
}

/* ============ Guardar / actualizar pago de terapeuta ============ */
export async function guardarPagoTerapeuta(datos) {
  const response = await fetch(`${API_URL}/pagos/terapeutas/guardar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_pago_terapeuta: datos.id_pago_terapeuta,
      id_terapeuta: datos.id_terapeuta,
      periodo: datos.periodo,
      modalidad_pago: datos.modalidad_pago,
      monto_base: Number(datos.monto_base),
      descuento: Number(datos.descuento || 0),
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