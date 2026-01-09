export type EstadoConductor = "DISPONIBLE" | "EN_RUTA" | "INACTIVO";

export interface PersonaForm {
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
}

export interface ConductorForm {
  persona: PersonaForm;
  licencia: string;
  categoriaLicencia: string;
  estado: EstadoConductor;
}
