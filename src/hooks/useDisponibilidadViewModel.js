import { useState, useCallback } from 'react';
import {
  consultarDisponibilidad,
  registrarDisponibilidad,
  actualizarDisponibilidad,
} from '../services/disponibilidadService';
import { BloqueDisponibilidad } from '../models/Disponibilidad';

export function useDisponibilidadViewModel() {
  const [bloques, setBloques] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [yaExiste, setYaExiste] = useState(false);

  /* ========== Cargar bloques del terapeuta (solo GET) ========== */
  const cargarDisponibilidad = useCallback(async (idTerapeuta) => {
    setCargando(true);
    setError(null);
    try {
      const data = await consultarDisponibilidad(idTerapeuta);
      setBloques(data);
      setYaExiste(data.length > 0);
    } catch (err) {
      setError(err.message);
      setBloques([]);
      setYaExiste(false);
    } finally {
      setCargando(false);
    }
  }, []);

  /* ========== Alternar un bloque ========== */
  const toggleBloque = (diaSemana, horaInicio, horaFin) => {
    setBloques((prev) => {
      const idx = prev.findIndex(
        (b) =>
          b.dia_semana === diaSemana &&
          b.hora_inicio === horaInicio &&
          b.hora_fin === horaFin
      );

      if (idx >= 0) {
        const copia = [...prev];
        copia.splice(idx, 1);
        return copia;
      }

      return [
        ...prev,
        new BloqueDisponibilidad({
          dia_semana: diaSemana,
          hora_inicio: horaInicio,
          hora_fin: horaFin,
        }),
      ];
    });
  };

  /* ========== ¿Está marcado? ========== */
  const estaDisponible = (diaSemana, horaInicio, horaFin) => {
    return bloques.some(
      (b) =>
        b.dia_semana === diaSemana &&
        b.hora_inicio === horaInicio &&
        b.hora_fin === horaFin
    );
  };

  /* ========== Guardar (POST o PUT) ========== */
  const guardarDisponibilidad = async (idTerapeuta) => {
    if (bloques.length === 0) {
      throw new Error('No hay bloques seleccionados para guardar');
    }

    setGuardando(true);
    setError(null);
    try {
      const resultado = yaExiste
        ? await actualizarDisponibilidad(idTerapeuta, bloques)
        : await registrarDisponibilidad(idTerapeuta, bloques);

      setYaExiste(true);
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setGuardando(false);
    }
  };

  return {
    bloques,
    cargando,
    guardando,
    error,
    cargarDisponibilidad,
    toggleBloque,
    estaDisponible,
    guardarDisponibilidad,
  };
}