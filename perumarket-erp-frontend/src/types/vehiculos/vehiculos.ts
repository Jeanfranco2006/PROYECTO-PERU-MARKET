export type EstadoVehiculo =
  | "DISPONIBLE"
  | "EN_RUTA"
  | "MANTENIMIENTO"
  | "INACTIVO";

export interface VehiculoDTO {
  placa: string;
  marca: string;
  modelo: string;
  capacidadKg: number;
  estado: EstadoVehiculo;
}
