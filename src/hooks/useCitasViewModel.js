import { useState, useCallback } from 'react';
import {
  obtenerDisponibilidadTerapeuta,
  agendarCita,
  liberarCita,
} from '../services/citaService';

export function useCitasViewModel() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const cargarCitas = useCallback(async (idTerapeuta, fecha) => {
    if (!idTerapeuta || !fecha) {
      setCitas([]);
      setError(null);
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerDisponibilidadTerapeuta(idTerapeuta, fecha);
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

  const crearCita = async (datos) => {
    setGuardando(true);
    setError(null);
    try {
      const resultado = await agendarCita(datos);
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setGuardando(false);
    }
  };

  /* 👇 Nuevo */
  const liberarCitaVM = async (idCita) => {
    setGuardando(true);
    setError(null);
    try {
      const resultado = await liberarCita(idCita);
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
    cargarCitas,
    limpiar,
    crearCita,
    liberarCita: liberarCitaVM,
  };
}