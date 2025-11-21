// En types/Employee.ts
export interface Persona {
  id?: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  telefono: string;
  fechaNacimiento?: string;
  direccion: string;
}

export interface Departament {
  id?: number;
  nombre: string;
  descripcion: string;
}

export interface Employee {
  empleadoId?: number;
  persona: Persona;
  departamento: Departament | null;
  puesto: string;
  sueldo: number;
  fechaContratacion: string;
  estado: string;
  foto: string;
  cv: string;
}