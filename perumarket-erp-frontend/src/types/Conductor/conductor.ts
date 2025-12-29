export interface Persona {
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

export type EstadoConductor = "DISPONIBLE" | "EN_RUTA" | "INACTIVO";

export interface Conductor {
    id?: number; // opcional, por si lo crea la BD
    persona: Persona;
    licencia: string;
    categoriaLicencia: string, // ✅ agregada
    estado: EstadoConductor;
}
