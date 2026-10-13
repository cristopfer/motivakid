import { useState, useCallback } from 'react';
import { obtenerHorariosTerapeuta } from '../services/horarioService';

export function useHorariosViewModel() {
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarHorarios = useCallback(async (idTerapeuta, fechaLunes, fechaDomingo) => {
    if (!idTerapeuta || idTerapeuta === 'todos') {
      setHorarios([]);
      setError(null);
      return;
    }

    setCargando(true);
    setError(null);
    try {
      const data = await obtenerHorariosTerapeuta(idTerapeuta, fechaLunes, fechaDomingo);
      setHorarios(data);
    } catch (err) {
      setError(err.message);
      setHorarios([]);
    } finally {
      setCargando(false);
    }
  }, []);

  /* 👇 Envuelto en useCallback para que su referencia sea estable */
  const limpiar = useCallback(() => {
    setHorarios([]);
    setError(null);
  }, []);

  const obtenerCita = (fecha, horaInicio, horaFin) => {
    const d = new Date(fecha);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const fechaISO = `${y}-${m}-${day}`;

    return horarios.find((h) => {
      const hFecha = String(h.fecha).substring(0, 10);
      const hIni = String(h.hora_inicio).substring(0, 5);
      const hFin = String(h.hora_fin).substring(0, 5);
      return hFecha === fechaISO && hIni === horaInicio && hFin === horaFin;
    });
  };

  return {
    horarios,
    cargando,
    error,
    cargarHorarios,
    limpiar,
    obtenerCita,
  };
}