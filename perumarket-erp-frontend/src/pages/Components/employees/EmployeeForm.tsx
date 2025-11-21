import { useRef, ChangeEvent, FormEvent } from "react";
import { Employee } from "../types/Employee";

// IMPORTANDO ICONOS DE REACT-ICONS
import {
  FaRegUser,
  FaEnvelope,
  FaPhone,
  FaCalendarDays,
  FaBuilding,
  FaIdCard,
  FaFileArrowUp,
  FaUserCheck,
} from "react-icons/fa6";

interface Props {
  state: Employee;
  setField: (field: string, value: any) => void;
  onCancel: () => void;
  onSave: (emp: Employee) => void;
}

export default function EmployeeForm({
  state,
  setField,
  onCancel,
  onSave,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  function submit(e: FormEvent) {
    e.preventDefault();

    if (!state.persona.nombres.trim()) return alert("El nombre es obligatorio");
    if (!state.persona.numeroDocumento.trim()) return alert("El número de documento es obligatorio");
    if (!state.persona.correo.trim()) return alert("Debe ingresar un correo válido");

    onSave(state);
  }

  function onFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    alert("Archivos seleccionados: " + Array.from(files).map((f) => f.name).join(", "));
  }

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 gap-4 p-4 bg-white rounded shadow-md border"
    >
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <FaUserCheck className="text-blue-600" />
        Registrar / Editar Empleado
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
            <option>DNI</option>
            <option>Pasaporte</option>
            <option>CE</option>
          </select>

          <label className="text-sm font-medium flex items-center gap-1">
            <FaRegUser size={16} /> Nombres
          </label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={state.persona.nombres}
            onChange={(e) => setField("persona.nombres", e.target.value)}
          />

          <label className="text-sm font-medium flex items-center gap-1">
            <FaEnvelope size={16} /> Correo
          </label>
          <input
            type="email"
            className="border rounded px-3 py-2 w-full"
            value={state.persona.correo}
            onChange={(e) => setField("persona.correo", e.target.value)}
          />

          <label className="text-sm font-medium flex items-center gap-1">
            <FaBuilding size={16} /> Dirección
          </label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={state.persona.direccion}
            onChange={(e) => setField("persona.direccion", e.target.value)}
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
        </div>

        {/* DERECHA */}
        {/* DERECHA */}
<div className="space-y-3">

  <label className="text-sm font-medium flex items-center gap-1">
    <FaIdCard size={16} /> N° Documento
  </label>
  <input
    className="border rounded px-3 py-2 w-full"
    value={state.persona.numeroDocumento}
    onChange={(e) => setField("persona.numeroDocumento", e.target.value)}
  />

  <label className="text-sm font-medium">Apellido Paterno</label>
  <input
    className="border rounded px-3 py-2 w-full"
    value={state.persona.apellidoPaterno}
    onChange={(e) => setField("persona.apellidoPaterno", e.target.value)}
  />

  <label className="text-sm font-medium">Apellido Materno</label>
  <input
    className="border rounded px-3 py-2 w-full"
    value={state.persona.apellidoMaterno}
    onChange={(e) => setField("persona.apellidoMaterno", e.target.value)}
  />

  <label className="text-sm font-medium flex items-center gap-1">
    <FaPhone size={16} /> Teléfono
  </label>
  <input
    className="border rounded px-3 py-2 w-full"
    value={state.persona.telefono}
    onChange={(e) => setField("persona.telefono", e.target.value)}
  />

  <label className="text-sm font-medium">Puesto</label>
  <input
    className="border rounded px-3 py-2 w-full"
    value={state.puesto}
    onChange={(e) => setField("puesto", e.target.value)}
  />

  {/* SUELDO */}
  <label className="text-sm font-medium">Sueldo (S/.)</label>
  <input
    type="number"
    className="border rounded px-3 py-2 w-full"
    value={state.sueldo}
    onChange={(e) => setField("sueldo", Number(e.target.value))}
  />

  <label className="text-sm font-medium">Estado</label>
  <select
    className="border rounded px-3 py-2 w-full"
    value={state.estado}
    onChange={(e) => setField("estado", e.target.value)}
  >
    <option value="activo">Activo</option>
    <option value="inactivo">Inactivo</option>
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
      <div className="flex justify-end gap-3 mt-4">
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
  );
}
