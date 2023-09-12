import { Moment } from "moment";

export class Vendedor {
  checked?: boolean;
  idUsuarioVendedor: number;
  correoUsuario: string;
  nombreVendedor: string;
  apellidoVendedor: string;
  iniciales: string;
  telefonoVendedor: string;
  idZonaVendedor: string;
  zona: string;
  ubicacionUsuario: {
    latitud: number;
    longitud: number
  }
}
export class Cliente {
  id: number;
  correoElectronico: string;
  nombreCliente: string;
  contrasena: string;
  nombreUsuario: string;
  identificacion: string;
  idZonaCliente: number;
  nombreZona: string;
} 
export class Zona {
  idZona: number;
  nombreZona: string
}
export class Visita {
  id: number;
  fechaHoraInicio: Moment;
  fechaHoraFin: Moment;
  duracion: number;
  id_usuario: number;
  id_cliente: number;
  observacion: string;
  firma: string;
  latitudV: string;
  longitudV: string;
  nombreVendedor: string;
  apellidoVendedor: string;
}
export class Pedido {
  checked?: boolean;
  idpedido: number;
  createdAt: Date;
  idClientePedido: number;
  idVendedorPedido: number;
  observacionesPedido: string;
  totalPedido: string;
  modoPago: string;
  descripcion: string;
  nombreVendedor: string;
  apellidoVendedor: string;
  nombreCliente: string;
  firma: string
}

export class UbicacionVendedor {
  id: number;
  latitud: number;
  longitud: number;
}