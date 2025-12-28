import { api } from "../api";

export interface CrearVehiculoDTO {
  placa: string;
  marca?: string;
  modelo?: string;
  capacidad_kg?: number | null;
  estado?: string;
}

export const vehiculoService = {
  crear: async (data: CrearVehiculoDTO) => {
    const response = await api.post("/vehiculos", data);
    return response.data;
  },

  listar: async () => {
    const { data } = await api.get("/vehiculos");
    return data;
  }
};
