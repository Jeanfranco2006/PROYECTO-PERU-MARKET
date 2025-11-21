import { useState } from "react";
import ClienteCard from "./ClientCards";
import DeleteModal from "../employees/EmployeeDeleteModal";
import SearchBar from "../employees/EmployeeSearchBar";
import { sampleClientes } from "./exampleClients";
import { Cliente } from "../types/Employee";
import ClienteForm from "./ClientFrom";

export default function AppClientes() {
  const [clientes, setClientes] = useState<Cliente[]>(sampleClientes);
  const [EditingCliente,setEditingCliente] = useState<Cliente | null>(null);
  const [deletingCliente, setDeletingCliente] = useState<Cliente | null>(null);
  const [search, setSearch] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formCliente, setFormCliente] = useState<Cliente | null>(null);

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
        fechaRegistro: new Date().toISOString(),
        estado: "activo",
      }
    );
    setIsFormVisible(true);
  };

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

  const handleDeleteCliente = () => {
    if (deletingCliente) {
      setClientes(clientes.filter(c => c.clienteId !== deletingCliente.clienteId));
      setDeletingCliente(null);
    }
  };

  const filteredClientes = clientes.filter(c => {
    const fullName = `${c.persona.nombres} ${c.persona.apellidoPaterno} ${c.persona.apellidoMaterno}`;
    return fullName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Gestión de Clientes</h1>

      <div className="flex justify-between items-center">
   
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => openForm()}
        >
          Registrar Cliente
        </button>
      </div>

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

      {isFormVisible && formCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl">
            <ClienteForm
              state={formCliente}
              setField={(field, value) => {
                if (field in formCliente.persona) {
                  setFormCliente({
                    ...formCliente,
                    persona: { ...formCliente.persona, [field]: value },
                  });
                } else {
                  setFormCliente({ ...formCliente, [field]: value });
                }
              }}
              onCancel={() => setIsFormVisible(false)}
              onSave={handleSaveCliente}
            />
          </div>
        </div>
      )}

      <DeleteModal
        visible={!!deletingCliente}
        message={`¿Deseas eliminar a ${deletingCliente?.persona.nombres} ${deletingCliente?.persona.apellidoPaterno}?`}
        onCancel={() => setDeletingCliente(null)}
        onConfirm={handleDeleteCliente}
      />
    </div>
  );
}
