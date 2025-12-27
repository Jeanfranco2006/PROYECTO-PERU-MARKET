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

export interface CrearEnvioDTO {
  idVenta: number; // <- igual que el backend
  idCliente?: number;
  productos?: { idProducto: number; cantidad: number }[];
  estado?: 'PENDIENTE' | 'EN_RUTA' | 'ENTREGADO' | 'CANCELADO';
  fechaRegistro?: string;
  observaciones?: string;
}

export type ActualizarEnvioDTO = Partial<CrearEnvioDTO>;



 export interface FormDataEnvio extends CrearEnvioDTO {
  idVehiculo?: number;
  idConductor?: number;
  idRuta?: number;
  direccionEnvio?: string;
  fechaEntrega?: string;
  costoTransporte?: number;
}

export interface Pedido {
  id: number;
  id_cliente: number;
  fecha_pedido: string;
  estado: string;
  total: number;
  id_venta: number;
}
