// src/services/rutas/rutaService.ts
import type { CrearRutaDTO, Ruta } from "../../types/rutas/ruta";
import { api } from "../api";

export const RutaService = {
  listarRutas: async (): Promise<Ruta[]> => {
    try {
      const response = await api.get<Ruta[]>("/rutas");
      return response.data;
    } catch (error: any) {
      console.error("Error listando rutas:", error);
      return [];
    }
  },

crearRuta: async (data: CrearRutaDTO): Promise<Ruta> => {
  try {
    const response = await api.post<Ruta>("/rutas", {
      ...data,
      distancia_km: data.distancia_km ?? null,
      tiempo_estimado_horas: data.tiempo_estimado_horas ?? null,
      costo_base: data.costo_base ?? null
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creando ruta:", error);
    throw error;
  }
}

};
