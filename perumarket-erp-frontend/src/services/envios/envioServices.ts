import { api } from "../api";
import { type ActualizarEnvioDTO, type Envio, type PedidoDTO } from "../../types/envios/envio";


export const enviosService = {
listar: async (): Promise<Envio[]> => {
  const { data } = await api.get('/envios');
  return Array.isArray(data) ? data : [];
},

  crear: async (payload: any): Promise<Envio> => {
    const { data } = await api.post('/envios', payload);
    return data;
  },
  // Actualizar un envío (parcial)
  actualizar: async (id: number, payload: ActualizarEnvioDTO): Promise<Envio> => {
    const { data } = await api.put(`/envios/${id}`, payload);
    return data;
  },
    eliminar: async (id: number): Promise<void> => {
    await api.delete(`/envios/${id}`);
  },

  
/*Ojooo acaa */
listarPedidosPendientes: async (): Promise<PedidoDTO[]> => {
  const { data } = await api.get('/pedidos/pedidos-pendientes');
  return data;
}

};