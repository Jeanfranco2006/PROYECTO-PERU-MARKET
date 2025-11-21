import type { Employee } from "../../types/Employee";
import { formatDate } from "../../utils/format";

import { 
  FiMapPin, 
  FiCreditCard, 
  FiMail, 
  FiPhone, 
  FiCalendar 
} from "react-icons/fi";

interface Props {
  data: Employee;
  onEdit: () => void;
  onDelete: () => void;
}

export default function EmployeeCard({ data, onEdit, onDelete }: Props) {
  const iniciales = `${
    data.persona?.nombres?.charAt(0)?.toUpperCase() || ""
  }${data.persona?.apellidoPaterno?.charAt(0)?.toUpperCase() || ""}`;

  const estadoColors =
    data.estado === "activo"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-semibold">
            {iniciales}
          </div>

          <div>
            <h2 className="font-bold text-lg">
              {data.persona.nombres} {data.persona.apellidoPaterno} {data.persona.apellidoMaterno}
            </h2>
            <p className="text-gray-500 text-sm">Puesto: {data.puesto}</p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColors}`}>
          {data.estado?.toUpperCase()}
        </span>
      </div>

      {/* INFO */}
      <div className="mt-3 text-sm text-gray-700 space-y-2">

        <p className="flex items-center gap-2">
          <FiMapPin className="text-blue-600" /> 
          Departamento: {data.departamento?.nombre || "Sin asignar"}
        </p>

        <p className="flex items-center gap-2">
          <FiCreditCard className="text-blue-600" />
          N° Documento: {data.persona.numeroDocumento}
        </p>

        <p className="flex items-center gap-2">
          <FiMail className="text-blue-600" />
          {data.persona.correo}
        </p>

        <p className="flex items-center gap-2">
          <FiPhone className="text-blue-600" />
          {data.persona.telefono || "Sin número"}
        </p>

        <p className="flex items-center gap-2">
          <FiCalendar className="text-blue-600" />
          Ingreso: {formatDate(data.fechaContratacion)}
        </p>
      </div>

      {/* ACCIONES */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Editar
        </button>

        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
