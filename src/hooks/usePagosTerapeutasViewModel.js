import { useState, useEffect, useCallback } from 'react';
import {
  listarPagosTerapeutas,
  generarControlPagos,
  guardarPagoTerapeuta,
} from '../services/pagoTerapeutaService';

export function usePagosTerapeutasViewModel(periodo) {
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const cargarPagos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await listarPagosTerapeutas(periodo);
      setPagos(data);
    } catch (err) {
      setError(err.message);
      setPagos([]);
    } finally {
      setCargando(false);
    }
  }, [periodo]);

  useEffect(() => {
    cargarPagos();
  }, [cargarPagos]);

  const actualizarPagos = async () => {
    setGenerando(true);
    setError(null);
    try {
      const resultado = await generarControlPagos(periodo);
      await cargarPagos();
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setGenerando(false);
    }
  };

  const editarPago = async (datos) => {
    setGuardando(true);
    setError(null);
    try {
      const resultado = await guardarPagoTerapeuta(datos);
      await cargarPagos();
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setGuardando(false);
    }
  };

  const filtrar = (texto) => {
    return pagos.filter((p) => {
      return (p.terapeuta || '').toLowerCase().includes(texto.toLowerCase());
    });
  };

  return {
    pagos,
    cargando,
    generando,
    guardando,
    error,
    cargarPagos,
    actualizarPagos,
    editarPago,
    filtrar,
  };
}