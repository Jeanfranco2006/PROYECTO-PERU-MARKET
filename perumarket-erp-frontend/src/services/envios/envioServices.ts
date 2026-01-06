import { api } from "../api";
import { type ActualizarEnvioDTO, type Envio, type PedidoDTO } from "../../types/envios/envio";

export const enviosService = {
  listar: async (): Promise<Envio[]> => {
    const { data } = await api.get('/envios');
    return Array.isArray(data) ? data : [];
  },

  crear: async (payload: any): Promise<Envio> => {
    // IMPORTANTE: El backend espera idVenta, no id_pedido
    const body = {
      idVenta: payload.idVenta,  // ← CAMBIADO: idVenta en lugar de id_pedido
      idVehiculo: payload.idVehiculo,
      idConductor: payload.idConductor,
      idRuta: payload.idRuta,
      direccionEnvio: payload.direccionEnvio,
      fechaEnvio: payload.fechaEnvio,
      fechaEntrega: payload.fechaEntrega,
      costoTransporte: payload.costoTransporte,
      estado: payload.estado || 'PENDIENTE',
      observaciones: payload.observaciones
    };

    console.log('🚀 Body para crear envío:', body);

    const { data } = await api.post('/envios', body);
    return data;
  },

  actualizar: async (id: number, payload: any): Promise<Envio> => {
    const body = {
      idVehiculo: payload.idVehiculo,
      idConductor: payload.idConductor,
      idRuta: payload.idRuta,
      direccionEnvio: payload.direccionEnvio,
      fechaEnvio: payload.fechaEnvio,
      fechaEntrega: payload.fechaEntrega,
      costoTransporte: payload.costoTransporte,
      estado: payload.estado,
      observaciones: payload.observaciones
    };

    console.log('🔄 Body para actualizar envío:', body);

    const { data } = await api.put(`/envios/${id}`, body);
    return data;
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/envios/${id}`);
  },

  // ✅ CORREGIDO: Usa el endpoint correcto
  listarPedidosDisponibles: async (): Promise<any[]> => {
    try {
      console.log('🔄 Solicitando pedidos disponibles...');
      const { data } = await api.get('/envios/pedidos-disponibles');
      console.log('✅ Pedidos recibidos:', data?.length || 0);
      
      // Debug: mostrar estructura
      if (data && data.length > 0) {
        console.log('Estructura del primer pedido:', data[0]);
      }
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('❌ Error al obtener pedidos disponibles:', error);
      return [];
    }
  },

  // Si necesitas mantener el otro endpoint también
  listarPedidosPendientes: async (): Promise<any[]> => {
    try {
      const { data } = await api.get('/pedidos/pedidos-pendientes');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error al obtener pedidos pendientes:', error);
      return [];
    }
  }
};