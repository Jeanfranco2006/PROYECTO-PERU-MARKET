import { useState } from "react";
import ClienteCard from "./ClientCards";
import DeleteModal from "../employees/EmployeeDeleteModal";
import ClienteForm from "./ClientFrom";
import ClientsSearchBar from "./ClientSearchBar";

import { sampleClientes } from "./exampleClients";
import type { Cliente } from "../../types/Employee";

export default function AppClientes() {
  const [clientes, setClientes] = useState<Cliente[]>(sampleClientes);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [deletingCliente, setDeletingCliente] = useState<Cliente | null>(null);

  const [filters, setFilters] = useState({ texto: "", dni: "" });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formCliente, setFormCliente] = useState<Cliente | null>(null);

  // Función para actualizar cualquier campo usando path con "."
  const setFormField = (path: string, value: any) => {
    const keys = path.split(".");
    setFormCliente(prev => {
      if (!prev) return prev;
      const updated = { ...prev };
      let obj: any = updated;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          obj[key] = value;
        } else {
          obj[key] = { ...obj[key] };
          obj = obj[key];
        }
      });
      return updated;
    });
  };

  // Abrir formulario para nuevo o editar cliente
  const openForm = (cli?: Cliente) => {
    setEditingCliente(cli || null);
    setFormCliente(
      cli || {
        clienteId: "",
        persona: {
          id: "",
          tipoDocumento: "",
          numeroDocumento: "",
          nombres: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          correo: "",
          telefono: "",
          direccion: "",
        },
        tipo: "",
        fechaRegistro: new Date().toISOString(),
      }
    );
    setIsFormVisible(true);
  };

  // Guardar cliente (nuevo o editado)
  const handleSaveCliente = (cli: Cliente) => {
    if (cli.clienteId) {
      setClientes(clientes.map(c => (c.clienteId === cli.clienteId ? cli : c)));
    } else {
      setClientes([...clientes, { ...cli, clienteId: Date.now().toString() }]);
    }
    setEditingCliente(null);
    setFormCliente(null);
    setIsFormVisible(false);
  };

  // Eliminar cliente
  const handleDeleteCliente = () => {
    if (deletingCliente) {
      setClientes(clientes.filter(c => c.clienteId !== deletingCliente.clienteId));
      setDeletingCliente(null);
    }
  };

  // Aplicar filtros
  const filteredClientes = clientes.filter(c => {
    const fullName = `${c.persona.nombres} ${c.persona.apellidoPaterno} ${c.persona.apellidoMaterno}`.toLowerCase();
    const dni = c.persona.numeroDocumento.toLowerCase();
    return fullName.includes(filters.texto.toLowerCase()) && dni.includes(filters.dni.toLowerCase());
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Gestión de Clientes</h1>

      {/* FILTROS + BOTÓN */}
      <div className="flex justify-between items-center gap-4">
        <ClientsSearchBar filters={filters} onChange={handleFilterChange} />
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => openForm()}
        >
          Registrar Cliente
        </button>
      </div>

      {/* LISTA DE CLIENTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClientes.map(cli => (
          <ClienteCard
            key={cli.clienteId}
            data={cli}
            onEdit={() => openForm(cli)}
            onDelete={() => setDeletingCliente(cli)}
          />
        ))}
      </div>

      {/* FORMULARIO MODAL */}
      {isFormVisible && formCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl">
            <ClienteForm
              state={formCliente}
              setField={setFormField}
              onCancel={() => setIsFormVisible(false)}
              onSave={handleSaveCliente}
            />
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      <DeleteModal
        visible={!!deletingCliente}
        message={`¿Deseas eliminar a ${deletingCliente?.persona.nombres} ${deletingCliente?.persona.apellidoPaterno}?`}
        onCancel={() => setDeletingCliente(null)}
        onConfirm={handleDeleteCliente}
      />
    </div>
  );
}
