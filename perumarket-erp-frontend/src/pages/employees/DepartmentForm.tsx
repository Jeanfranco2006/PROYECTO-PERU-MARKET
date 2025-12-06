import type { Departament } from "../../types/Employee";
import { LuX } from "react-icons/lu";

interface Props {
  state: Departament;
  setField: (field: keyof Departament, value: any) => void;
  onCancel: () => void;
  onSave: (dep: Departament) => Promise<void>;
}

export default function DepartmentForm({ state, setField, onCancel, onSave }: Props) {
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // ← IMPORTANTE para evitar cierre del modal
    
    // Validación básica
    if (!state.nombre.trim()) {
      alert("El nombre del departamento es requerido");
      return;
    }
    
    await onSave(state);
  };

  return (
    <div className="bg-white p-6">
      <div className="sm:flex sm:items-start">
        <div className="hidden sm:flex mx-auto flex-shrink-0 items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
          <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-4 w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">
              {state.id ? 'Editar Departamento' : 'Nuevo Departamento'}
            </h3>
            <button
              onClick={onCancel}
              className="sm:hidden p-2 text-slate-400 hover:text-slate-600"
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Complete la información básica del área operativa.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre del Departamento *
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors"
                value={state.nombre}
                onChange={e => setField("nombre", e.target.value)}
                placeholder="Ej: Recursos Humanos, Ventas, IT..."
                required
                autoFocus
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descripción Funcional
              </label>
              <textarea
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors min-h-[100px]"
                value={state.descripcion || ""}
                onChange={e => setField("descripcion", e.target.value)}
                placeholder="Describa las responsabilidades principales y objetivos del departamento..."
                rows={4}
              />
            </div>

            {/* Footer de Acciones */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={onCancel}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {state.id ? 'Actualizar' : 'Crear'} Departamento
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}