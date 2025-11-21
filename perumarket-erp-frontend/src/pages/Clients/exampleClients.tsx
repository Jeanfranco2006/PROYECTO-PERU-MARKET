import type { Cliente } from "../../types/Employee";

export const sampleClientes: Cliente[] = [
  {
    clienteId: "c1",
    persona: {
      id: "p1",
      tipoDocumento: "DNI",
      numeroDocumento: "12345678",
      nombres: "Ana",
      apellidoPaterno: "Martinez",
      apellidoMaterno: "Lopez",
      correo: "ana.martinez@example.com",
      telefono: "987654321",
      direccion: "Av. Lima 123",
    },
    fechaRegistro: "2023-01-10",

  },
  {
    clienteId: "c2",
    persona: {
      id: "p2",
      tipoDocumento: "DNI",
      numeroDocumento: "87654321",
      nombres: "Luis",
      apellidoPaterno: "Gonzales",
      apellidoMaterno: "Perez",
      correo: "luis.gonzales@example.com",
      telefono: "987123456",
      direccion: "Jr. Arequipa 456",
    },
    fechaRegistro: "2022-06-15",
  
  },
];
