import { useState, useEffect, useCallback } from 'react';
import { obtenerPrediccionDemanda } from '../services/prediccionService';
import { useEspecialidadesViewModel } from './useEspecialidadesViewModel';
import { useTerapeutasViewModel } from './useTerapeutasViewModel';

export function usePrediccionViewModel() {
  const { especialidades } = useEspecialidadesViewModel();
  const { terapeutas } = useTerapeutasViewModel();

  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Filtros por defecto: próximo lunes a sábado (o 7 días desde hoy)
  const hoy = new Date();
  const [fechaDesde, setFechaDesde] = useState(() => {
    const d = new Date(hoy);
    return d.toISOString().split('T')[0];
  });
  const [fechaHasta, setFechaHasta] = useState(() => {
    const d = new Date(hoy);
    d.setDate(d.getDate() + 6); // +6 días
    return d.toISOString().split('T')[0];
  });
  const [idEspecialidad, setIdEspecialidad] = useState('todas');
  const [idTerapeuta, setIdTerapeuta] = useState('todos');

  const cargarPrediccion = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerPrediccionDemanda(
        fechaDesde,
        fechaHasta,
        idEspecialidad,
        idTerapeuta
      );
      setDatos(data);
    } catch (err) {
      setError(err.message);
      setDatos(null);
    } finally {
      setCargando(false);
    }
  }, [fechaDesde, fechaHasta, idEspecialidad, idTerapeuta]);

  // Cargar al montar y cada vez que cambian los filtros
  useEffect(() => {
    cargarPrediccion();
  }, [cargarPrediccion]);

  return {
    datos,
    cargando,
    error,
    filtros: {
      fechaDesde,
      fechaHasta,
      idEspecialidad,
      idTerapeuta,
    },
    setFiltros: {
      setFechaDesde,
      setFechaHasta,
      setIdEspecialidad,
      setIdTerapeuta,
    },
    especialidades,
    terapeutas,
    recargar: cargarPrediccion,
  };
}