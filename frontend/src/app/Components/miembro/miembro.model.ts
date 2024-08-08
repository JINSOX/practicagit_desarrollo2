export class Miembro {
  idMiembro: number;
  dni: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date;
  direccion: string;
  email: string;
  telefono: string;
  universidad: string;
  titulo: string;
  fechaGraduacion: Date;
  fotoUrl: string;
  estado: string;
  fechaRegistro: Date;

  constructor(miembro: any) {
    this.idMiembro = miembro.idMiembro || this.getRandomID();
    this.dni = miembro.dni || '';
    this.nombres = miembro.nombres || '';
    this.apellidos = miembro.apellidos || '';
    this.fechaNacimiento = miembro.fechaNacimiento ? new Date(miembro.fechaNacimiento) : new Date();
    this.direccion = miembro.direccion || '';
    this.email = miembro.email || '';
    this.telefono = miembro.telefono || '';
    this.universidad = miembro.universidad || '';
    this.titulo = miembro.titulo || '';
    this.fechaGraduacion = miembro.fechaGraduacion ? new Date(miembro.fechaGraduacion) : new Date();
    this.fotoUrl = miembro.fotoUrl || 'assets/images/user/user1.jpg';
    this.estado = miembro.estado || '';
    this.fechaRegistro = miembro.fechaRegistro ? new Date(miembro.fechaRegistro) : new Date();
  }

  private getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
