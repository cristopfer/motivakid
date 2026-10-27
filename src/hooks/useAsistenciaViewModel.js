import { useState, useCallback } from 'react';
import {
  obtenerAsistenciaHoy,
  controlAsistencia,
} from '../services/asistenciaService';

export function useAsistenciaViewModel() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  /* Cargar agenda del día */
  const cargarAsistencia = useCallback(async (idTerapeuta) => {
    if (!idTerapeuta) {
      setCitas([]);
      setError(null);
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerAsistenciaHoy(idTerapeuta);
      setCitas(data);
    } catch (err) {
      setError(err.message);
      setCitas([]);
    } finally {
      setCargando(false);
    }
  }, []);

  const limpiar = useCallback(() => {
    setCitas([]);
    setError(null);
  }, []);

  /* Registrar asistencia
     👇 Firma: (idTerapeuta, estado) — NO recibe id_cita
     El backend resuelve el id_cita por sí mismo usando el terapeuta + hoy.
  */
  const registrarAsistencia = async (idTerapeuta, estado) => {
    setGuardando(true);
    setError(null);
    try {
      const resultado = await controlAsistencia(idTerapeuta, estado);
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setGuardando(false);
    }
  };

  return {
    citas,
    cargando,
    guardando,
    error,
    cargarAsistencia,
    limpiar,
    registrarAsistencia,
  };
}