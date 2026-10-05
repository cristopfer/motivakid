import { useState, useEffect } from 'react';
import {
  listarTerapeutas,
  registrarTerapeuta,
  eliminarTerapeuta,
  activarTerapeuta,
  consultarTerapeuta,
  actualizarTerapeuta,
} from '../services/terapeutaService';

export function useTerapeutasViewModel() {
  const [terapeutas, setTerapeutas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarTerapeutas = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await listarTerapeutas();
      setTerapeutas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTerapeutas();
  }, []);

  const crearTerapeuta = async (datos) => {
    const resultado = await registrarTerapeuta(datos);
    await cargarTerapeutas();
    return resultado;
  };

  const eliminarTerapeutaVM = async (id) => {
    const resultado = await eliminarTerapeuta(id);
    await cargarTerapeutas();
    return resultado;
  };

  const activarTerapeutaVM = async (id) => {
    const resultado = await activarTerapeuta(id);
    await cargarTerapeutas();
    return resultado;
  };

  /* 👇 Nuevos */
  const obtenerTerapeuta = async (id) => {
    return await consultarTerapeuta(id);
  };

  const actualizarTerapeutaVM = async (datos) => {
    const resultado = await actualizarTerapeuta(datos);
    await cargarTerapeutas();
    return resultado;
  };

  const filtrar = (texto, idEspecialidad, estado) => {
    return terapeutas.filter((t) => {
      const coincideTexto = t.nombreCompleto
        .toLowerCase()
        .includes(texto.toLowerCase());

      const coincideEspecialidad =
        idEspecialidad === 'todas' ||
        Number(t.id_especialidad) === Number(idEspecialidad);

      const coincideEstado =
        estado === 'todos' ||
        (estado === 'activo' && t.estado) ||
        (estado === 'retirado' && !t.estado);

      return coincideTexto && coincideEspecialidad && coincideEstado;
    });
  };

  return {
    terapeutas,
    cargando,
    error,
    recargar: cargarTerapeutas,
    crearTerapeuta,
    eliminarTerapeuta: eliminarTerapeutaVM,
    activarTerapeuta: activarTerapeutaVM,
    obtenerTerapeuta,                              
    actualizarTerapeuta: actualizarTerapeutaVM,    
    filtrar,
  };
}