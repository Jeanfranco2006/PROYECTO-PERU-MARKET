// Interfaces corregidas
export interface Envio {
  id: number;
  pedido: {
    id: number;
    idCliente: number;
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
    nombre: string; // <- agregar
  };
  ruta?: {
    id: number;
    nombre: string;
  };
  direccionEnvio: string;
  fechaEnvio?: string;
  fechaEntrega?: string;
  costoTransporte?: number;
  estado: 'PENDIENTE' | 'EN_RUTA' | 'ENTREGADO' | 'CANCELADO';
  observaciones?: string;
}

interface CrearEnvioDTO {
  idVenta?: number;
  idCliente?: number;
  estado: string;
  fechaRegistro: string;
  productos: { idProducto: number; cantidad: number }[];
}

export type ActualizarEnvioDTO = Partial<CrearEnvioDTO>;



export interface FormDataEnvio extends CrearEnvioDTO {

  idVehiculo?: number;
  idConductor?: number;
  idRuta?: number;
  direccionEnvio?: string;
    fechaEnvio?: string;  
  fechaEntrega?: string;
  costoTransporte?: number;
  observaciones?: string; // <-- agregado
}

export interface PedidoDTO {
  id: number;
  codigo: string;
  nombreCliente: string;
  total: number;
}


