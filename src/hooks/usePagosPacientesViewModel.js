import { useState, useEffect, useCallback } from 'react';
import {
  listarPagosPacientes,
  actualizarPagosPacientes,
  guardarPago,
} from '../services/pagoPacienteService';

export function usePagosPacientesViewModel(idPaciente) {
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [actualizando, setActualizando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const cargarPagos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const filtroId = idPaciente === 'todos' ? null : idPaciente;
      const data = await listarPagosPacientes(filtroId);
      setPagos(data);
    } catch (err) {
      setError(err.message);
      setPagos([]);
    } finally {
      setCargando(false);
    }
  }, [idPaciente]);

  useEffect(() => {
    cargarPagos();
  }, [cargarPagos]);

  const actualizarPagos = async () => {
    setActualizando(true);
    setError(null);
    try {
      const resultado = await actualizarPagosPacientes();
      await cargarPagos();
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActualizando(false);
    }
  };

  /* 👇 Nuevo */
  const editarPago = async (datos) => {
    setGuardando(true);
    setError(null);
    try {
      const resultado = await guardarPago(datos);
      await cargarPagos();
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setGuardando(false);
    }
  };

  const filtrar = (estado, formaPago) => {
    return pagos.filter((p) => {
      const coincideEstado =
        estado === 'todos' || (p.estado || '').toLowerCase() === estado.toLowerCase();
      const coincideForma =
        formaPago === 'todos' || (p.forma_pago || '').toLowerCase() === formaPago.toLowerCase();
      return coincideEstado && coincideForma;
    });
  };

  return {
    pagos,
    cargando,
    actualizando,
    guardando,
    error,
    cargarPagos,
    actualizarPagos,
    editarPago,
    filtrar,
  };
}