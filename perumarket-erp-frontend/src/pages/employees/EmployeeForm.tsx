import { useRef, type ChangeEvent, type FormEvent } from "react";
import {
  FaRegUser,
  FaEnvelope,
  FaPhone,
  FaCalendarDays,
  FaBuilding,
  FaIdCard,
  FaUserCheck,
} from "react-icons/fa6";
import type { Departament, Employee } from "../../types/Employee";

interface Props {
  state: Employee;
  setField: (field: string, value: any) => void;
  onCancel: () => void;
  onSave: (emp: Employee) => void;
  departamentos: Departament[];
}

export default function EmployeeForm({
  state,
  setField,
  onCancel,
  onSave,
  departamentos,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  function submit(e: FormEvent) {
    e.preventDefault();

    if (!state.persona.nombres.trim()) return alert("El nombre es obligatorio");
    if (!state.persona.numeroDocumento.trim())
      return alert("El número de documento es obligatorio");
    if (!state.persona.correo?.trim())
      return alert("Debe ingresar un correo válido");

    onSave(state);
  }

  function onFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    alert(
      "Archivos seleccionados: " +
      Array.from(files)
        .map((f) => f.name)
        .join(", ")
    );
  }

  // Función para manejar el cambio de departamento
  const handleDepartamentoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const depId = e.target.value;
    
    if (depId === "") {
      setField("departamento", null);
    } else {
      const depObj = departamentos.find((d) => d.id === parseInt(depId));
      setField("departamento", depObj || null);
    }
  };

  return (
    <div className="max-h-[85vh] overflow-y-auto p-2">
      <form
        onSubmit={submit}
        className="grid grid-cols-1 gap-4 p-4 bg-white rounded shadow-md border"
      >
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <FaUserCheck className="text-blue-600" />
          {state.empleadoId ? "Editar Empleado" : "Registrar Empleado"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* IZQUIERDA */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              <FaIdCard size={16} /> Tipo Documento
            </label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={state.persona.tipoDocumento}
              onChange={(e) => setField("persona.tipoDocumento", e.target.value)}
            >
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
              <option value="PASAPORTE">Pasaporte</option>
              <option value="OTRO">Otro</option>
            </select>

            <label className="text-sm font-medium flex items-center gap-1">
              <FaRegUser size={16} /> Nombres
            </label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={state.persona.nombres}
              onChange={(e) => setField("persona.nombres", e.target.value)}
              placeholder="Ingrese los nombres"
            />

            <label className="text-sm font-medium flex items-center gap-1">
              <FaEnvelope size={16} /> Correo
            </label>
            <input
              type="email"
              className="border rounded px-3 py-2 w-full"
              value={state.persona.correo}
              onChange={(e) => setField("persona.correo", e.target.value)}
              placeholder="correo@ejemplo.com"
            />

            <label className="text-sm font-medium flex items-center gap-1">
              <FaBuilding size={16} /> Dirección
            </label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={state.persona.direccion}
              onChange={(e) => setField("persona.direccion", e.target.value)}
              placeholder="Ingrese la dirección"
            />

            <label className="text-sm font-medium flex items-center gap-1">
              <FaCalendarDays size={16} /> Fecha de contratación
            </label>
            <input
              type="date"
              className="border rounded px-3 py-2 w-full"
              value={state.fechaContratacion || ""}
              onChange={(e) => setField("fechaContratacion", e.target.value)}
            />

            <label className="text-sm font-medium">Sueldo (S/.)</label>
            <input
              type="number"
              step="0.01"
              className="border rounded px-3 py-2 w-full"
              value={state.sueldo}
              onChange={(e) => setField("sueldo", Number(e.target.value))}
              placeholder="0.00"
            />

            <label className="text-sm font-medium">Estado</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={state.estado}
              onChange={(e) => setField("estado", e.target.value)}
            >
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>

          {/* DERECHA */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              <FaIdCard size={16} /> N° Documento
            </label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={state.persona.numeroDocumento}
              onChange={(e) =>
                setField("persona.numeroDocumento", e.target.value)
              }
              placeholder="Ingrese el número de documento"
            />

            <label className="text-sm font-medium">Apellido Paterno</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={state.persona.apellidoPaterno}
              onChange={(e) =>
                setField("persona.apellidoPaterno", e.target.value)
              }
              placeholder="Ingrese apellido paterno"
            />

            <label className="text-sm font-medium">Apellido Materno</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={state.persona.apellidoMaterno}
              onChange={(e) =>
                setField("persona.apellidoMaterno", e.target.value)
              }
              placeholder="Ingrese apellido materno"
            />

            <label className="text-sm font-medium flex items-center gap-1">
              <FaPhone size={16} /> Teléfono
            </label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={state.persona.telefono}
              onChange={(e) => setField("persona.telefono", e.target.value)}
              placeholder="Ingrese teléfono"
            />

            <label className="text-sm font-medium">Puesto</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={state.puesto}
              onChange={(e) => setField("puesto", e.target.value)}
              placeholder="Ingrese el puesto"
            />

            <label className="text-sm font-medium flex items-center gap-1">
              <FaCalendarDays size={16} /> Fecha de nacimiento
            </label>
            <input
              type="date"
              className="border rounded px-3 py-2 w-full"
              value={state.persona.fechaNacimiento || ""}
              onChange={(e) => setField("persona.fechaNacimiento", e.target.value)}
            />

            {/* DEPARTAMENTO - CORREGIDO */}
            <label className="text-sm font-medium">Departamento</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={state.departamento?.id || ""}
              onChange={handleDepartamentoChange}
            >
              <option value="">Seleccione un departamento</option>
              {departamentos.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.nombre}
                </option>
              ))}
            </select>

            {/* FOTO */}
            <label className="text-sm font-medium">Foto del empleado</label>
            {state.foto && (
              <img
                src={state.foto}
                alt="Foto del empleado"
                className="w-24 h-24 object-cover rounded border mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              className="border rounded px-3 py-2 w-full"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const preview = URL.createObjectURL(file);
                setField("foto", preview);
              }}
            />

            {/* CV */}
            <label className="text-sm font-medium mt-3">Currículum (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              className="border rounded px-3 py-2 w-full"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setField("cv", file.name);
                alert("CV seleccionado: " + file.name);
              }}
            />
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-3 mt-4 sticky bottom-0 bg-white py-3 border-t">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}