export interface Envio {
  id: number;

  pedido: {
    id: number;
    cliente: {
      id: number;
      nombre: string;
    };
  };

  vehiculo?: {
    id: number;
    placa: string;
    marca: string;
    modelo: string;
  };

  conductor?: {
    id: number;
    licencia: string;
    nombre: string;
  };

  ruta?: {
    id: number;
    nombre: string;
  };

  direccionEnvio: string;
  fechaRegistro: string;
  fechaEnvio?: string;
  fechaEntrega?: string;
  costoTransporte?: number;

  estado: 'PENDIENTE' | 'EN_RUTA' | 'ENTREGADO' | 'CANCELADO';
  observaciones?: string;
}

export interface ActualizarEnvioDTO {
  idVehiculo?: number;
  idConductor?: number;
  idRuta?: number;

  direccionEnvio?: string;
  fechaEnvio?: string;
  fechaEntrega?: string;
  costoTransporte?: number;

  estado?: 'PENDIENTE' | 'EN_RUTA' | 'ENTREGADO' | 'CANCELADO';
  observaciones?: string;
}


export interface FormDataEnvio extends ActualizarEnvioDTO {
  idVehiculo?: number;
  idConductor?: number;
  idRuta?: number;
  idVenta?:number;
  direccionEnvio?: string;
  fechaEnvio?: string;
  fechaEntrega?: string;
  costoTransporte?: number;
  observaciones?: string;
}

export interface PedidoDTO {
  id: number;
  codigo: string;
  nombreCliente: string;
  total: number;
}

