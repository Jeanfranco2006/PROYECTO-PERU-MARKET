// Persona
export interface Persona {
  id: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  telefono?: string;
  direccion?: string;
}

// Departamento
export interface Departament {
  id: string;
  nombre: string;
  descripcion?: string;
}

// Empleado
export interface Employee {
  empleadoId: string;
  persona: Persona;
  departamento: Departament | null;
  puesto: string;
  sueldo: number;
  fechaContratacion: string;
  estado?: string;
  foto?: string;   // ← URL en BD
  cv?: string;     // ← URL en BD
}

export interface Cliente {
  clienteId: string;
  persona: {
    id: string;
    tipoDocumento: string;
    numeroDocumento: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    telefono: string;
    direccion: string;
  };
  fechaRegistro: string;
  estado: "activo" | "inactivo";
}
