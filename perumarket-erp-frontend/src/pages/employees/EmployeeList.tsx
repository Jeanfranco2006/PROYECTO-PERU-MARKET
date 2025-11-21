import { useState } from "react";
import type { Employee } from "../../types/Employee";
import { PencilIcon } from "@heroicons/react/24/outline";
import { BsTrash2 } from "react-icons/bs";
import { LuBuilding2, LuUsersRound } from "react-icons/lu";
import { BiUserPlus } from "react-icons/bi";

interface Props {
  employees: Employee[];
  departamentos: { id: string | number; nombre: string }[];
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
  onNewEmpleado: () => void;
  onNewCliente: () => void;
  onNewDepartamento: () => void;
}

export default function EmployeeList({
  employees,
  departamentos,
  onEdit,
  onDelete,
  onNewEmpleado,
  onNewCliente,
  onNewDepartamento
}: Props) {

  const [dniSearch, setDniSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("todos");

  const filtered = employees.filter(emp => {
    const dni = emp.persona.numeroDocumento || "";
    const matchDni = dni.includes(dniSearch);

    const empDeptId = emp.departamento?.id?.toString() ?? "";
    const matchDept = deptFilter === "todos" || empDeptId === deptFilter;

    return matchDni && matchDept;
  });

  return (
    <div className="w-full p-5 bg-white rounded-2xl shadow-md">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-700">Gestión de Empleados</h2>

        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            onClick={onNewEmpleado}
          >
            <BiUserPlus size={18} /> Nuevo Empleado
          </button>

          <button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            onClick={onNewCliente}
          >
            <LuUsersRound size={18} /> Nuevo Cliente
          </button>

          <button
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
            onClick={onNewDepartamento}
          >
            <LuBuilding2 size={18} /> Nuevo Departamento
          </button>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <input
          type="text"
          className="border rounded-lg px-4 py-2 w-full md:w-72 focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Buscar por DNI..."
          value={dniSearch}
          onChange={(e) => setDniSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-4 py-2 w-full md:w-72 focus:ring-2 focus:ring-blue-400 outline-none"
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
        >
          <option value="todos">Todos los departamentos</option>

          {departamentos.map(dep => (
            <option key={dep.id} value={dep.id.toString()}>
              {dep.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="border p-2">Documento</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Correo</th>
              <th className="border p-2">Puesto</th>
              <th className="border p-2">Estado</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(emp => (
              <tr key={emp.empleadoId} className="text-sm hover:bg-gray-50 transition">

                <td className="border p-2">
                  {emp.persona.tipoDocumento} - {emp.persona.numeroDocumento}
                </td>

                <td className="border p-2">
                  {emp.persona.nombres} {emp.persona.apellidoPaterno} {emp.persona.apellidoMaterno}
                </td>

                <td className="border p-2">{emp.persona.correo}</td>

                <td className="border p-2">{emp.puesto || "Sin asignar"}</td>

                <td className="border p-2 text-center">
                  <span
                    className={
                      `px-2 py-1 rounded text-xs font-semibold ${
                        emp.estado === "activo"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`
                    }
                  >
                    {emp.estado?.toUpperCase()}
                  </span>
                </td>

                <td className="border p-2 flex justify-center gap-2">

                  <button
                    className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
                    onClick={() => onEdit(emp)}
                  >
                    <PencilIcon size={18} />
                  </button>

                  <button
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    onClick={() => onDelete(emp)}
                  >
                    <BsTrash2 size={18} />
                  </button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
