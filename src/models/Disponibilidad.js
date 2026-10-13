/* Días: 1=Lunes ... 6=Sábado (según tu backend) */
/* Días con el nombre EXACTO que espera el SP */
export const DIAS = [
  { id: 1, nombre: 'Lunes',     valor: 'Lunes' },
  { id: 2, nombre: 'Martes',    valor: 'Martes' },
  { id: 3, nombre: 'Miércoles', valor: 'Miércoles' },
  { id: 4, nombre: 'Jueves',    valor: 'Jueves' },
  { id: 5, nombre: 'Viernes',   valor: 'Viernes' },
  { id: 6, nombre: 'Sábado',    valor: 'Sábado' },
];

/* Bloques de hora con formato HH:MM (sin segundos) */
export const HORAS = [
  { label: '08:00 - 08:40', inicio: '08:00', fin: '08:40' },
  { label: '08:40 - 09:20', inicio: '08:40', fin: '09:20' },
  { label: '09:20 - 10:00', inicio: '09:20', fin: '10:00' },
  { label: '10:00 - 10:40', inicio: '10:00', fin: '10:40' },
  { label: '10:40 - 11:20', inicio: '10:40', fin: '11:20' },
  { label: '11:20 - 12:00', inicio: '11:20', fin: '12:00' },
  { label: '14:00 - 14:40', inicio: '14:00', fin: '14:40' },
  { label: '14:40 - 15:20', inicio: '14:40', fin: '15:20' },
  { label: '15:20 - 16:00', inicio: '15:20', fin: '16:00' },
  { label: '16:00 - 16:40', inicio: '16:00', fin: '16:40' },
  { label: '16:40 - 17:20', inicio: '16:40', fin: '17:20' },
  { label: '17:20 - 18:00', inicio: '17:20', fin: '18:00' },
];

/* Bloques de hora para HORARIOS (secuenciales, cada 40 min) */
export const HORAS_HORARIO = [
  { label: '08:00 - 08:40', inicio: '08:00', fin: '08:40' },
  { label: '08:40 - 09:20', inicio: '08:40', fin: '09:20' },
  { label: '09:20 - 10:00', inicio: '09:20', fin: '10:00' },
  { label: '10:00 - 10:40', inicio: '10:00', fin: '10:40' },
  { label: '10:40 - 11:20', inicio: '10:40', fin: '11:20' },
  { label: '11:20 - 12:00', inicio: '11:20', fin: '12:00' },
  { label: '14:00 - 14:40', inicio: '14:00', fin: '14:40' },
  { label: '14:40 - 15:20', inicio: '14:40', fin: '15:20' },
  { label: '15:20 - 16:00', inicio: '15:20', fin: '16:00' },
  { label: '16:00 - 16:40', inicio: '16:00', fin: '16:40' },
  { label: '16:40 - 17:20', inicio: '16:40', fin: '17:20' },
  { label: '17:20 - 18:00', inicio: '17:20', fin: '18:00' },
];

/* Helper para recortar "08:00:00" → "08:00" */
function recortarHora(hora) {
  if (!hora) return '';
  const s = String(hora);
  return s.length > 5 ? s.substring(0, 5) : s;
}

export class BloqueDisponibilidad {
  constructor({ dia_semana, hora_inicio, hora_fin }) {
    this.dia_semana = dia_semana;
    this.hora_inicio = recortarHora(hora_inicio);
    this.hora_fin = recortarHora(hora_fin);
  }

  get key() {
    return `${this.dia_semana}|${this.hora_inicio}|${this.hora_fin}`;
  }
}