/* 4 colores principales del sistema, coherentes con el diseño */
export const PALETA = [
  { solid: '#e91e63', soft: '#fce7f3', text: '#9d174d' }, // 1. Rosa (principal)
  { solid: '#a855f7', soft: '#f3e8ff', text: '#5a2d82' }, // 2. Morado
  { solid: '#14b8a6', soft: '#ccfbf1', text: '#0f766e' }, // 3. Teal
  { solid: '#f5b400', soft: '#fef3c7', text: '#92400e' }, // 4. Amarillo
];

/* Devuelve el color según el índice (0-based) */
export function getColorPorIndice(indice) {
  if (indice < 0 || Number.isNaN(indice)) return PALETA[0];
  return PALETA[indice % PALETA.length];
}

/* Dado el idEspecialidad, encuentra su índice en la lista de especialidades */
export function getIndiceEspecialidad(idEspecialidad, especialidades) {
  return especialidades.findIndex(
    (e) => String(e.id) === String(idEspecialidad)
  );
}