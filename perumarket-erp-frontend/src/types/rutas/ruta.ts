// src/types/ruta.ts
export interface Ruta {
  id?: number; 
  nombre: string;
  origen: string;
  destino: string;
  distancia_km?: number | null;
  tiempo_estimado_horas?: number | null;
  costo_base?: number | null;
}
export interface CrearRutaDTO {
  nombre?: string;
  origen?: string;
  destino?: string;
  distancia_km?: number | null;
  tiempo_estimado_horas?: number | null;
  costo_base?: number | null;
}
