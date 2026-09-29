import { Usuario } from '../models/Usuario';

/* Detecta si es Vite o CRA */
const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:8000';

export async function login(correo, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password }),
  });

  /* Manejo de errores HTTP */
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Credenciales inválidas o usuario inactivo');
    }
    if (response.status === 422) {
      throw new Error('Datos inválidos. Revisa el formato del correo.');
    }
    throw new Error('Error al conectar con el servidor');
  }

  const data = await response.json();

  /* Esperamos algo como: { success: true, message: "Ingreso exitoso" } */
  if (!data.success) {
    throw new Error(data.message || 'Credenciales inválidas');
  }

  /* Devolvemos un Usuario (Model) */
  return new Usuario({ email: correo, rol: 'Administrador' });
}