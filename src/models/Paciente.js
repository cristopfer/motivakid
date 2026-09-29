export class Paciente {
  constructor({ id_paciente, nombre, apellido, diagnostico, fecha, apoderado, estado }) {
    this.id = id_paciente;
    this.nombre = nombre;
    this.apellido = apellido;
    this.diagnostico = diagnostico;
    this.fecha = fecha;
    this.apoderado = apoderado;
    this.estado = estado;
  }

  /* Nombre completo */
  get nombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  /* Iniciales para el avatar (ej: "Juan Pérez" → "JP") */
  get iniciales() {
    const n = (this.nombre || '').trim().charAt(0).toUpperCase();
    const a = (this.apellido || '').trim().charAt(0).toUpperCase();
    return `${n}${a}`;
  }

  /* Estado legible: true → "Activo", false → "Inactivo" */
  get estadoTexto() {
    return this.estado ? 'Activo' : 'Inactivo';
  }

  /* Formato de fecha: yyyy-mm-dd → dd/mm/yyyy */
  get fechaFormateada() {
    if (!this.fecha) return '—';
    const [y, m, d] = this.fecha.split('-');
    return `${d}/${m}/${y}`;
  }
}