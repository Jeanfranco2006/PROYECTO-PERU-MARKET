import { FiX } from "react-icons/fi";

interface Props {
  open: boolean;
  onClose: () => void;
  rol: any;
}

export default function ModalPermisosRol({ open, onClose, rol }: Props) {
  if (!open || !rol) return null;

  // Módulos de ejemplo (luego vendrán desde tu backend)
  const modulos = [
    { id: 1, nombre: "Dashboard" },
    { id: 2, nombre: "Ventas" },
    { id: 3, nombre: "Compras" },
    { id: 4, nombre: "Clientes" },
    { id: 5, nombre: "Proveedores" },
    { id: 6, nombre: "Inventario" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">





      <div className="bg-white w-full max-w-xl p-6 rounded shadow-lg relative">

        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-black"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Permisos para: <span className="text-blue-600">{rol.nombre}</span>
        </h2>

        <div className="max-h-80 overflow-y-auto border rounded p-3">
          {modulos.map((m) => (
            <div key={m.id} className="flex justify-between items-center py-2 border-b">
              <span>{m.nombre}</span>

              <input type="checkbox" className="w-5 h-5" />
            </div>
          ))}
        </div>

        {/* Guardar */}
        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900"
          >
            Guardar Permisos
          </button>
        </div>
      </div>
    </div>
  );
}
