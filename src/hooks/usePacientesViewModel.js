import { useState, useEffect } from 'react';
import { listarPacientes, registrarPaciente, eliminarPaciente, activarPaciente, consultarPaciente, actualizarPaciente,} from '../services/pacienteService';

export function usePacientesViewModel() {
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarPacientes = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await listarPacientes();
      setPacientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  /* 👇 Nuevo: registrar paciente */
  const crearPaciente = async (datos) => {
    const resultado = await registrarPaciente(datos);
    await cargarPacientes();  // recarga la tabla
    return resultado;
  };

  /* 👇 Nuevo */
  const eliminarPacienteVM = async (id) => {
    const resultado = await eliminarPaciente(id);
    await cargarPacientes();
    return resultado;
  };

  /* 👇 Nuevo */
  const activarPacienteVM = async (id) => {
    const resultado = await activarPaciente(id);
    await cargarPacientes();
    return resultado;
  };

  /* 👇 Nuevos */
  const obtenerPaciente = async (id) => {
    return await consultarPaciente(id);
  };

  const actualizarPacienteVM = async (datos) => {
    const resultado = await actualizarPaciente(datos);
    await cargarPacientes();
    return resultado;
  };

  const filtrar = (texto, estado) => {
    return pacientes.filter((p) => {
      const coincideTexto = p.nombreCompleto
        .toLowerCase()
        .includes(texto.toLowerCase());

      const coincideEstado =
        estado === 'todos' ||
        (estado === 'activo' && p.estado) ||
        (estado === 'inactivo' && !p.estado);

      return coincideTexto && coincideEstado;
    });
  };

  return {
    pacientes,
    cargando,
    error,
    recargar: cargarPacientes,
    crearPaciente,
    eliminarPaciente: eliminarPacienteVM,
    activarPaciente: activarPacienteVM,
    obtenerPaciente,                  
    actualizarPaciente: actualizarPacienteVM,
    filtrar,
  };
}