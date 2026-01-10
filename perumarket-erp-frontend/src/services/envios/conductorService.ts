import type { ConductorDTO } from "../../types/Conductor/conductor";
import { api } from "../api";

export const ConductorService = {

  listarTodos: async (): Promise<ConductorDTO[]> => {
    const { data } = await api.get("/conductores");
    return data;
  },

  listarDisponibles: async (): Promise<ConductorDTO[]> => {
    const { data } = await api.get("/conductores/disponibles");
    return data;
  },

  crearConductor: async (conductor: ConductorDTO): Promise<ConductorDTO> => {
    const { data } = await api.post("/conductores", conductor);
    return data;
  },

  // 🔥 VALIDAR DNI (PERSONA)
  validarDni: async (dni: string): Promise<boolean> => {
    const { data } = await api.get(`/personas/existe-dni/${dni}`);
    return data; // true = existe, false = libre
  }
};
