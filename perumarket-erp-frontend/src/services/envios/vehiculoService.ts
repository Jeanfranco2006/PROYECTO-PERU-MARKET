import type { VehiculoDTO } from "../../types/vehiculos/vehiculos";
import { api } from "../api";



export const vehiculoService = {
  crear: async (data: VehiculoDTO) => {
    const response = await api.post("/vehiculos", data);
    return response.data;
  },

  listar: async () => {
    const { data } = await api.get("/vehiculos");
    return data;
  }
};
