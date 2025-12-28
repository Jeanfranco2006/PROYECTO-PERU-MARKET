import { api } from "../api";


export const ConductorService = {
  listarTodos: async () => {
    try {
      const response = await api.get("/conductores");
      return response.data;
    } catch (error: any) {
      console.error("Error listando todos los conductores:", error);
      throw error;
    }
  },

  listarDisponibles: async () => {
    try {
      const response = await api.get("/conductores/disponibles");
      return response.data;
    } catch (error: any) {
      console.error("Error listando conductores disponibles:", error);
      throw error;
    }
  },

  crearConductor: async (data: {
    idPersona: number;
    licencia: string;
    categoriaLicencia: string;
  }) => {
    try {
      const response = await api.post("/conductores", data);
      return response.data;
    } catch (error: any) {
      console.error("Error creando conductor:", error);
      throw error;
    }
  }
};
