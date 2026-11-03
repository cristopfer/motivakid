import { useState, useEffect, useCallback } from 'react';
import { obtenerEstadisticas } from '../services/estadisticaService';

/* Paleta de 4 colores para especialidades */
const PALETA = ['#ec4899', '#14b8a6', '#f5b400', '#a855f7'];

export function useEstadisticasViewModel() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerEstadisticas();
      setDatos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  /* Calcular variación porcentual */
  const calcularVariacion = (actual, anterior) => {
    const a = Number(actual || 0);
    const b = Number(anterior || 0);
    if (b === 0) return a > 0 ? 100 : 0;
    return Math.round(((a - b) / b) * 100);
  };

  /* Formatear KPIs para el render */
  const kpis = {
    pacientes: {
      actual: datos?.tot_pac_actual || 0,
      anterior: datos?.tot_pac_anterior || 0,
    },
    terapeutas: {
      actual: datos?.tot_ter_actual || 0,
      anterior: datos?.tot_ter_anterior || 0,
    },
    citas: {
      actual: datos?.tot_cit_actual || 0,
      anterior: datos?.tot_cit_anterior || 0,
    },
    pagos: {
      actual: datos?.tot_pag_actual || 0,
      anterior: datos?.tot_pag_anterior || 0,
    },
  };

  /* Especialidades con colores y variaciones */
  const especialidades = Object.entries(datos?.citas_por_especialidad || {}).map(
    ([nombre, valores], idx) => ({
      nombre,
      color: PALETA[idx % PALETA.length],
      mesActual: Number(valores.mes_actual || 0),
      mesAnterior: Number(valores.mes_anterior || 0),
    })
  );

  const maxValor = Math.max(
    ...especialidades.flatMap((e) => [e.mesActual, e.mesAnterior]),
    1
  );

  return {
    datos,
    kpis,
    especialidades,
    maxValor,
    cargando,
    error,
    calcularVariacion,
    recargar: cargar,
  };
}