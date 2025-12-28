export interface CrearVehiculoDTO {
  placa: string;
  marca?: string;
  modelo?: string;
  capacidad_kg?: number | null;
  estado?: string;
}