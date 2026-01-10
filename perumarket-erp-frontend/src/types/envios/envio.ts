export type EstadoEnvio = 'PENDIENTE' | 'EN_RUTA' | 'ENTREGADO' | 'CANCELADO';

export interface Envio {
  // === TUS CAMPOS ORIGINALES (Anidados) ===
  id: number; // Mantenemos 'id' para compatibilidad
  pedido?: {
    id: number;
    cliente: { id: number; nombre: string };
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

  // === NUEVOS CAMPOS (Planos del Backend) ===
  // Estos son los que faltaban y causaban el error "Property does not exist"
  idEnvio?: number;       // El backend manda este
  idPedido?: number;
  totalPedido?: number;
  
  idCliente?: number;
  nombreCliente?: string; // Para mostrar en la tabla sin anidamiento
  
  idVehiculo?: number;    // <--- SOLUCIÓN AL ERROR 1
  placaVehiculo?: string;
  
  idConductor?: number;   // <--- SOLUCIÓN AL ERROR 2
  nombreConductor?: string;
  
  idRuta?: number;        // <--- SOLUCIÓN AL ERROR 3
  nombreRuta?: string;

  // === CAMPOS COMUNES ===
  direccionEnvio: string;
  fechaRegistro?: string;
  fechaEnvio?: string | null;   // Aceptamos null del backend
  fechaEntrega?: string | null;
  costoTransporte?: number;
  estado: EstadoEnvio;
  observaciones?: string;
}

// ... Mantén el resto de tus interfaces (ActualizarEnvioDTO, FormDataEnvio, PedidoDTO)
export interface ActualizarEnvioDTO {
  idVehiculo?: number;
  idConductor?: number;
  idRuta?: number;
  direccionEnvio?: string;
  fechaEnvio?: string;
  fechaEntrega?: string;
  costoTransporte?: number;
  estado?: EstadoEnvio;
  observaciones?: string;
}

export interface FormDataEnvio extends ActualizarEnvioDTO {
  idVenta?: number;
}

export interface PedidoDTO {
  id: number;
  codigo: string;
  idVenta: number; // Agregado necesario
  nombreCliente: string;
  clienteNombre?: string; // Alias
  dniCliente?: string;
  total: number;
  fechaPedido: string;
  tieneEnvio?: boolean;
}