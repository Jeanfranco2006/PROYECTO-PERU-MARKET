
import { Cliente } from "../types/Employee";

interface Props {
  state: Cliente;
  setField: (field: keyof Cliente | keyof Cliente["persona"], value: any) => void;
  onCancel: () => void;
  onSave: (cli: Cliente) => void;
}

export default function ClienteForm({ state, setField, onCancel, onSave }: Props) {
  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave(state);
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-4 p-4 bg-white rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm">Tipo Documento</label>
          <select
            className="border rounded px-2 py-2 w-full"
            value={state.persona.tipoDocumento}
            onChange={e => setField("tipoDocumento", e.target.value)}
          >
            <option>DNI</option>
            <option>Pasaporte</option>
            <option>CE</option>
          </select>

          <label className="text-sm">Nombres</label>
          <input
            className="border rounded px-2 py-2 w-full"
            value={state.persona.nombres}
            onChange={e => setField("nombres", e.target.value)}
          />

          <label className="text-sm">Correo</label>
          <input
            className="border rounded px-2 py-2 w-full"
            value={state.persona.correo}
            onChange={e => setField("correo", e.target.value)}
          />

          <label className="text-sm">Dirección</label>
          <input
            className="border rounded px-2 py-2 w-full"
            value={state.persona.direccion}
            onChange={e => setField("direccion", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">N° Documento</label>
          <input
            className="border rounded px-2 py-2 w-full"
            value={state.persona.numeroDocumento}
            onChange={e => setField("numeroDocumento", e.target.value)}
          />

          <label className="text-sm">Apellido Paterno</label>
          <input
            className="border rounded px-2 py-2 w-full"
            value={state.persona.apellidoPaterno}
            onChange={e => setField("apellidoPaterno", e.target.value)}
          />

          <label className="text-sm">Apellido Materno</label>
          <input
            className="border rounded px-2 py-2 w-full"
            value={state.persona.apellidoMaterno}
            onChange={e => setField("apellidoMaterno", e.target.value)}
          />

          <label className="text-sm">Teléfono</label>
          <input
            className="border rounded px-2 py-2 w-full"
            value={state.persona.telefono}
            onChange={e => setField("telefono", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Guardar
        </button>
      </div>
    </form>
  );
}
