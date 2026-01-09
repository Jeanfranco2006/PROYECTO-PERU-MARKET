export interface VehiculoDTO {
  placa: string;
  marca?: string;
  modelo?: string;
  capacidadKg: number;
  estado?: 'DISPONIBLE' | 'EN_RUTA' | 'MANTENIMIENTO' | 'INACTIVO';
}
