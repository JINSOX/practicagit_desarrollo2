export class Pago {
  idPago: number;
  idMiembro: number;
  monto: number;
  fechaPago: Date;
  tipoPago: string;
  comprobanteUrl: string;
  estado: string;

  constructor(pago: any) {
    this.idPago = pago.idPgo || this.getRandomID();
    this.idMiembro = pago.idMiembro || '';
    this.monto = pago.monto || 0;
    this.fechaPago = pago.fechaPago ? new Date(pago.fechaPago) : new Date();
    this.tipoPago = pago.tipoPago || '';
    this.comprobanteUrl = pago.comprobanteUrl || '';
    this.estado = pago.estado || '';
  }

  private getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
