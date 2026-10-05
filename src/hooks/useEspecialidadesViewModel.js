import { useState, useEffect } from 'react';
import {
  listarEspecialidades,
  registrarEspecialidad,
  eliminarEspecialidad,
  activarEspecialidad,
  consultarEspecialidad,
  actualizarEspecialidad,
} from '../services/especialidadService';

export function useEspecialidadesViewModel() {
  const [especialidades, setEspecialidades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarEspecialidades = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await listarEspecialidades();
      setEspecialidades(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  /* 👇 Registrar */
  const crearEspecialidad = async (datos) => {
    const resultado = await registrarEspecialidad(datos);
    await cargarEspecialidades();
    return resultado;
  };

    /* 👇 Nuevos */
  const eliminarEspecialidadVM = async (id) => {
    const resultado = await eliminarEspecialidad(id);
    await cargarEspecialidades();
    return resultado;
  };

  const activarEspecialidadVM = async (id) => {
    const resultado = await activarEspecialidad(id);
    await cargarEspecialidades();
    return resultado;
  };

    /* 👇 Nuevos */
  const obtenerEspecialidad = async (id) => {
    return await consultarEspecialidad(id);
  };

  const actualizarEspecialidadVM = async (datos) => {
    const resultado = await actualizarEspecialidad(datos);
    await cargarEspecialidades();
    return resultado;
  };

  /* Filtro en memoria */
  const filtrar = (texto, estado) => {
    return especialidades.filter((e) => {
      const coincideTexto = (e.nombre || '')
        .toLowerCase()
        .includes(texto.toLowerCase());

      const coincideEstado =
        estado === 'todos' ||
        (estado === 'activo' && e.estado) ||
        (estado === 'inactivo' && !e.estado);

      return coincideTexto && coincideEstado;
    });
  };

  return {
    especialidades,
    cargando,
    error,
    recargar: cargarEspecialidades,
    crearEspecialidad,
    eliminarEspecialidad: eliminarEspecialidadVM,
    activarEspecialidad: activarEspecialidadVM,
    obtenerEspecialidad,                         
    actualizarEspecialidad: actualizarEspecialidadVM,
    filtrar,
  };
}