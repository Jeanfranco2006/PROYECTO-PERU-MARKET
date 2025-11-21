import { Departament } from "../types/Employee";



interface Props {
  state: Departament;
  setField: (field: keyof Departament, value: any) => void;
  onCancel: () => void;
  onSave: (dep: Departament) => void;
}

export default function DepartmentForm({ state, setField, onCancel, onSave }: Props) {
  
  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave(state);
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-4 p-4 bg-white rounded shadow w-full max-w-lg">

      <h2 className="text-lg font-semibold mb-1">Registrar Departamento</h2>

      {/* Nombre */}
      <div>
        <label className="text-sm font-medium">Nombre</label>
        <input
          className="border rounded px-3 py-2 w-full"
          value={state.nombre}
          onChange={e => setField("nombre", e.target.value)}
          placeholder="Ej. Recursos Humanos"
          required
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="text-sm font-medium">Descripción</label>
        <textarea
          className="border rounded px-3 py-2 w-full"
          value={state.descripcion || ""}
          onChange={e => setField("descripcion", e.target.value)}
          placeholder="Descripción del departamento..."
          rows={3}
        />
      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Guardar
        </button>
      </div>

    </form>
  );
}
