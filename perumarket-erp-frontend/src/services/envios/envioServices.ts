import { api } from "../api";
import { type ActualizarEnvioDTO, type Envio, type PedidoDTO } from "../../types/envios/envio";

export const enviosService = {
  listar: async (): Promise<Envio[]> => {
    const { data } = await api.get('/envios');
    return Array.isArray(data) ? data : [];
  },

  crear: async (payload: any): Promise<Envio> => {
    // Convertir camelCase a snake_case para la base de datos
    const body = {
      id_pedido: payload.idVenta ? Number(payload.idVenta) : undefined,
      id_vehiculo: payload.idVehiculo ? Number(payload.idVehiculo) : null,
      id_conductor: payload.idConductor ? Number(payload.idConductor) : null,
      id_ruta: payload.idRuta ? Number(payload.idRuta) : null,
      direccion_envio: payload.direccionEnvio || null,
      fecha_envio: payload.fechaEnvio || null,
      fecha_entrega: payload.fechaEntrega || null,
      costo_transporte: payload.costoTransporte ? Number(payload.costoTransporte) : 0,
      estado: payload.estado || 'PENDIENTE',
      observaciones: payload.observaciones || null,
      productos: payload.productos && payload.productos.length > 0
        ? payload.productos
        : []
    };

    console.log('🚀 Body enviado a la API:', body);

    const { data } = await api.post('/envios', body);
    return data;
  },

  actualizar: async (id: number, payload: any): Promise<Envio> => {
    // También convertir en actualización
    const body = {
      id_pedido: payload.idVenta ? Number(payload.idVenta) : undefined,
      id_vehiculo: payload.idVehiculo ? Number(payload.idVehiculo) : null,
      id_conductor: payload.idConductor ? Number(payload.idConductor) : null,
      id_ruta: payload.idRuta ? Number(payload.idRuta) : null,
      direccion_envio: payload.direccionEnvio || null,
      fecha_envio: payload.fechaEnvio || null,
      fecha_entrega: payload.fechaEntrega || null,
      costo_transporte: payload.costoTransporte ? Number(payload.costoTransporte) : 0,
      estado: payload.estado || 'PENDIENTE',
      observaciones: payload.observaciones || null,
      productos: payload.productos
    };

    console.log('🔄 Body actualizado a la API:', body);

    const { data } = await api.put(`/envios/${id}`, body);
    return data;
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/envios/${id}`);
  },

  listarPedidosPendientes: async (): Promise<PedidoDTO[]> => {
    const { data } = await api.get('/pedidos/pedidos-pendientes');
    return data;
  }
};