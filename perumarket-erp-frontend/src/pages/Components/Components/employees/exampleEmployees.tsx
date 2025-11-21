import { Employee } from "../types/Employee";



export const sampleEmployees: Employee[] = [
  {
    empleadoId: "1",
    persona: {
      id: "p1",
      tipoDocumento: "DNI",
      numeroDocumento: "12345678",
      nombres: "Carlos",
      apellidoPaterno: "Ramirez",
      apellidoMaterno: "Lopez",
      correo: "carlos.ramirez@example.com",
      telefono: "987654321",
      direccion: "Av. Lima 123",
    },
    departamento: {
      id: "d1",
      nombre: "Recursos Humanos",
    },
    puesto: "Analista de RRHH",
    sueldo: 2500,
    fechaContratacion: "2023-05-10",
    estado: "activo",
    foto: "",
  },
  {
    empleadoId: "2",
    persona: {
      id: "p2",
      tipoDocumento: "DNI",
      numeroDocumento: "87654321",
      nombres: "María",
      apellidoPaterno: "Gonzales",
      apellidoMaterno: "Perez",
      correo: "maria.gonzales@example.com",
      telefono: "987123456",
      direccion: "Jr. Arequipa 456",
    },
    departamento: {
      id: "d2",
      nombre: "Ventas",
    },
    puesto: "Ejecutiva de Ventas",
    sueldo: 2800,
    fechaContratacion: "2022-11-15",
    estado: "activo",
  },
  {
    empleadoId: "3",
    persona: {
      id: "p3",
      tipoDocumento: "DNI",
      numeroDocumento: "11223344",
      nombres: "Juan",
      apellidoPaterno: "Lopez",
      apellidoMaterno: "Diaz",
      correo: "juan.lopez@example.com",
      telefono: "999888777",
      direccion: "Calle Los Robles 789",
    },
    departamento: null, // sin departamento
    puesto: "Desarrollador Frontend",
    sueldo: 3200,
    fechaContratacion: "2021-08-20",
    estado: "activo",
  },
];
