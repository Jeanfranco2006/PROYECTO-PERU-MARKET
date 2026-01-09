
import type { ConductorDTO } from "../../types/Conductor/conductor";
import { api } from "../api";


export const ConductorService = {
  listarTodos: async (): Promise<ConductorDTO[]> => {
    try {
      const response = await api.get("/conductores");
      return response.data;
    } catch (error: any) {
      console.error("Error listando todos los conductores:", error);
      throw error;
    }
  },

  listarDisponibles: async (): Promise<ConductorDTO[]> => {
    try {
      const response = await api.get("/conductores/disponibles");
      return response.data;
    } catch (error: any) {
      console.error("Error listando conductores disponibles:", error);
      throw error;
    }
  },

  crearConductor: async (conductor: ConductorDTO): Promise<ConductorDTO> => {
    try {
      const response = await api.post("/conductores", conductor);
      return response.data;
    } catch (error: any) {
      console.error("Error creando conductor:", error);
      throw error;
    }
  }
};
