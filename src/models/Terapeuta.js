export class Terapeuta {
  constructor({ id_terapeuta, nombres, apellidos, especialidad, id_especialidad, estado }) {
    this.id = id_terapeuta;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.especialidad = especialidad;
    this.id_especialidad = id_especialidad;
    this.estado = estado;
  }

  get nombreCompleto() {
    return `${this.nombres} ${this.apellidos}`;
  }

  get iniciales() {
    const n = (this.nombres || '').trim().charAt(0).toUpperCase();
    const a = (this.apellidos || '').trim().charAt(0).toUpperCase();
    return `${n}${a}`;
  }

  /* true → "Activo", false → "Retirado" */
  get estadoTexto() {
    return this.estado ? 'Activo' : 'Retirado';
  }
}