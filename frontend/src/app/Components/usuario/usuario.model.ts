export class Usuario {
  idUsuario: number;
  idMiembro: number;
  username: string;
  passwordHash: string;
  rol: string;
  fechaCreacion: Date;
  ultimoAcceso: Date;

  constructor(usuario: any) {
    this.idUsuario = usuario.idUsuario || this.getRandomID();
    this.idMiembro = usuario.idMiembro || 0;
    this.username = usuario.username || '';
    this.passwordHash = usuario.passwordHash || '';
    this.rol = usuario.rol || '';
    this.fechaCreacion = usuario.fechaCreacion ? new Date(usuario.fechaCreacion) : new Date();
    this.ultimoAcceso = usuario.ultimoAcceso ? new Date(usuario.ultimoAcceso) : new Date();
  }

  private getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
