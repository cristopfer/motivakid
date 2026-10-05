export class Especialidad {
  constructor({ id_especialidad, nombre, estado }) {
    this.id = id_especialidad;
    this.nombre = nombre;
    this.estado = estado;
  }

  get estadoTexto() {
    return this.estado ? 'Activo' : 'Inactivo';
  }
}