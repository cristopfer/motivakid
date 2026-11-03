import { useState, useCallback } from 'react';
import {
  obtenerReportePaciente,
  obtenerReporteTerapeuta,
} from '../services/reporteService';

export function useReportesViewModel() {
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [tipo, setTipo] = useState(null); // 'paciente' | 'terapeuta'

  const cargarReportePaciente = useCallback(async (idPaciente) => {
    if (!idPaciente) {
      setRegistros([]);
      setTipo(null);
      return;
    }
    setCargando(true);
    setError(null);
    setTipo('paciente');
    try {
      const data = await obtenerReportePaciente(idPaciente);
      setRegistros(data);
    } catch (err) {
      setError(err.message);
      setRegistros([]);
    } finally {
      setCargando(false);
    }
  }, []);

  const cargarReporteTerapeuta = useCallback(async (idTerapeuta) => {
    if (!idTerapeuta) {
      setRegistros([]);
      setTipo(null);
      return;
    }
    setCargando(true);
    setError(null);
    setTipo('terapeuta');
    try {
      const data = await obtenerReporteTerapeuta(idTerapeuta);
      setRegistros(data);
    } catch (err) {
      setError(err.message);
      setRegistros([]);
    } finally {
      setCargando(false);
    }
  }, []);

  const limpiar = useCallback(() => {
    setRegistros([]);
    setError(null);
    setTipo(null);
  }, []);

  return {
    registros,
    cargando,
    error,
    tipo,
    cargarReportePaciente,
    cargarReporteTerapeuta,
    limpiar,
  };
}