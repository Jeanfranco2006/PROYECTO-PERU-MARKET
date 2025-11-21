import React, { useState } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaBuilding,
  FaBox,
  FaSearch,
  FaUsers,
} from "react-icons/fa";

export default function Proveedores() {
  // Estado para saber si estamos editando
  const [isEditing, setIsEditing] = useState(false);

  const [showModal, setShowModal] = useState(false);

  // Estado para modal de eliminar
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // proveedor seleccionado para eliminar
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    ruc: "",
    razon_social: "",
    contacto: "",
    telefono: "",
    correo: "",
    direccion: "",
    estado: "ACTIVO",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Abrir modal de edición
  const handleEdit = (proveedor) => {
    setIsEditing(true);
    setFormData(proveedor);
    setShowModal(true);
  };

  // Abrir modal de eliminar
  const handleDeleteClick = (proveedor) => {
    setDeleteTarget(proveedor);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const confirmDelete = () => {
    console.log("Proveedor eliminado:", deleteTarget);

    setShowDeleteModal(false);
    alert("Proveedor eliminado correctamente");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      console.log("Proveedor editado:", formData);
    } else {
      console.log("Proveedor creado:", formData);
    }

    setShowModal(false);
    setIsEditing(false);

    setFormData({
      ruc: "",
      razon_social: "",
      contacto: "",
      telefono: "",
      correo: "",
      direccion: "",
      estado: "ACTIVO",
    });
  };

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <FaUsers className="text-[#7E1F20]" />
        <span>PROVEEDORES</span>
      </h1>

      {/* Cards */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-md flex-1">
          <div className="flex items-center gap-3">
            <div className="bg-[#F2E8D5] p-3 rounded-lg">
              <FaBuilding className="text-[#7E1F20] text-xl" />
            </div>
            <div>
              <h3 className="text-gray-600 text-sm">Total de proveedores</h3>
              <p className="text-2xl font-bold">25</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md flex-1">
          <div className="flex items-center gap-3">
            <div className="bg-[#F2E8D5] p-3 rounded-lg">
              <FaBox className="text-[#7E1F20] text-xl" />
            </div>
            <div>
              <h3 className="text-gray-600 text-sm">Total de productos</h3>
              <p className="text-2xl font-bold">156</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card de búsqueda */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
          <span className="bg-[#F2E8D5] p-3 rounded-lg">
            <FaSearch className="text-[#7E1F20] text-xl" />
          </span>
          Búsqueda de Proveedor
        </h3>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar por fecha o por RUC"
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7E1F20] focus:border-transparent"
          />

          <button className="bg-[#7E1F20] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#65171A] flex items-center gap-2">
            <FaSearch />
            Buscar
          </button>
        </div>
      </div>

      {/* Botón Nuevo */}
      <div className="flex justify-start mb-3">
        <button
          onClick={() => {
            setIsEditing(false);
            setFormData({
              ruc: "",
              razon_social: "",
              contacto: "",
              telefono: "",
              correo: "",
              direccion: "",
              estado: "ACTIVO",
            });
            setShowModal(true);
          }}
          className="bg-[#7E1F20] text-white px-4 py-2 rounded-lg shadow hover:bg-[#65171A] transition flex items-center gap-2 text-sm font-semibold"
        >
          <FaPlus className="text-xs" />
          Nuevo Proveedor
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow-lg rounded-xl border-t-4 border-[#7E1F20] overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#7E1F20] text-white">
            <tr>
              <th className="p-3">RUC</th>
              <th className="p-3">Razón Social</th>
              <th className="p-3">Contacto</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Dirección</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Opciones</th>
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item} className="border-b hover:bg-gray-50">
                <td className="p-3">20123456789</td>
                <td className="p-3">Empresa Ejemplo {item}</td>
                <td className="p-3">Juan Pérez</td>
                <td className="p-3">555-1234</td>
                <td className="p-3">contacto@empresa{item}.com</td>
                <td className="p-3">Av. Ejemplo 123</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item % 2 === 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item % 2 === 0 ? "ACTIVO" : "INACTIVO"}
                  </span>
                </td>

                {/* Botones */}
                <td className="p-3">
                  <div className="flex gap-3">
                    <button
                      className="text-[#7E1F20] hover:text-[#65171A]"
                      onClick={() =>
                        handleEdit({
                          ruc: "20123456789",
                          razon_social: `Empresa Ejemplo ${item}`,
                          contacto: "Juan Pérez",
                          telefono: "555-1234",
                          correo: `contacto@empresa${item}.com`,
                          direccion: "Av. Ejemplo 123",
                          estado: item % 2 === 0 ? "ACTIVO" : "INACTIVO",
                        })
                      }
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() =>
                        handleDeleteClick({
                          ruc: "20123456789",
                          razon_social: `Empresa Ejemplo ${item}`,
                        })
                      }
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? "Editar Proveedor" : "Crear Nuevo Proveedor"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Campos */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RUC *
                  </label>
                  <input
                    type="text"
                    name="ruc"
                    value={formData.ruc}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razón Social *
                  </label>
                  <input
                    type="text"
                    name="razon_social"
                    value={formData.razon_social}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contacto
                  </label>
                  <input
                    type="text"
                    name="contacto"
                    value={formData.contacto}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#7E1F20] text-white rounded-lg hover:bg-[#65171A]"
                >
                  {isEditing ? "Guardar Cambios" : "Guardar Proveedor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Eliminar Proveedor
            </h2>

            <p className="text-gray-700 mb-6">
              ¿Estás seguro que deseas eliminar al proveedor:
              <br />
              <span className="font-semibold text-gray-900">
                {deleteTarget?.razon_social}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-[#7E1F20] text-white rounded-lg hover:bg-[#65171A]"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}