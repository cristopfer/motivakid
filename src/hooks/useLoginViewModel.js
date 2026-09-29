import { useState } from 'react';
import { login } from '../services/authService';

export function useLoginViewModel(onSuccess) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    /* Validación local mínima */
    if (!email.trim() || !password.trim()) {
      setError('Ingresa tu usuario y contraseña');
      return;
    }

    setCargando(true);
    try {
      const usuario = await login(email.trim(), password);
      setCargando(false);
      onSuccess(usuario);
    } catch (err) {
      setCargando(false);
      setError(err.message || 'Error inesperado');
    }
  };

  return {
    email,
    password,
    error,
    cargando,
    setEmail,
    setPassword,
    handleSubmit,
  };
}