import type { Departament } from "../../types/Employee";

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
    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
          <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
          <h3 className="text-lg leading-6 font-medium text-slate-900" id="modal-title">
            {state.id ? 'Editar Departamento' : 'Nuevo Departamento'}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-slate-500 mb-4">
              Complete la información básica del área operativa.
            </p>
            
            <form id="dept-form" onSubmit={submit} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Nombre del Departamento</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  value={state.nombre}
                  onChange={e => setField("nombre", e.target.value)}
                  placeholder="Ej. Recursos Humanos"
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Descripción Funcional</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  value={state.descripcion || ""}
                  onChange={e => setField("descripcion", e.target.value)}
                  placeholder="Describa las responsabilidades principales..."
                  rows={3}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Footer de Acciones */}
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
        <button
          type="submit"
          form="dept-form"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
        >
          Guardar Departamento
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}