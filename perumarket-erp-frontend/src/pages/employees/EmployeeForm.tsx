import { useRef, type FormEvent } from "react";
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
  const fotoFileRef = useRef<HTMLInputElement>(null);
  const cvFileRef = useRef<HTMLInputElement>(null);
  const currentFotoBlobUrl = useRef<string | null>(null);
  
  // Limpiar URL blob anterior cuando se cambia la foto
  const cleanupPreviousFotoBlob = () => {
    if (currentFotoBlobUrl.current && currentFotoBlobUrl.current.startsWith('blob:')) {
      URL.revokeObjectURL(currentFotoBlobUrl.current);
      currentFotoBlobUrl.current = null;
    }
  };

  // Limpieza cuando el componente se desmonta
  // useEffect(() => {
  //   return () => {
  //     cleanupPreviousFotoBlob();
  //   };
  // }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!state.persona.nombres.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    if (!state.persona.numeroDocumento.trim()) {
      alert("El número de documento es obligatorio");
      return;
    }
    onSave(state);
  }

  // Manejo de imagen con error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  };

  // Manejo de subida de archivo de foto
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido');
        e.target.value = '';
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        e.target.value = '';
        return;
      }
      
      // Limpiar URL blob anterior
      cleanupPreviousFotoBlob();
      
      // Crear URL temporal para vista previa
      const imageUrl = URL.createObjectURL(file);
      currentFotoBlobUrl.current = imageUrl;
      setField("foto", imageUrl);
    }
  };

  // Manejo de subida de CV
  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (file.type !== 'application/pdf') {
        alert('Por favor, selecciona un archivo PDF');
        e.target.value = '';
        return;
      }
      
      // Validar tamaño (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('El CV no debe superar los 10MB');
        e.target.value = '';
        return;
      }
      
      setField("cv", file.name);
    }
  };

  // Eliminar foto seleccionada
  const handleRemoveFoto = () => {
    cleanupPreviousFotoBlob();
    setField("foto", "");
    if (fotoFileRef.current) {
      fotoFileRef.current.value = "";
    }
  };

  // Clases reutilizables para limpieza del JSX
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const inputClass = "block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border";

  // Determinar si mostrar la vista previa de la foto
  const shouldShowFotoPreview = state.foto && 
    (state.foto.startsWith('blob:') || 
     state.foto.startsWith('http') || 
     state.foto.startsWith('data:'));

  return (
    <div className="flex flex-col h-full bg-slate-50 sm:bg-white">
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          {state.empleadoId ? "Editar Empleado" : "Registrar Nuevo Empleado"}
        </h2>
        <p className="text-sm text-slate-500 mt-1">Complete la información personal y laboral del colaborador.</p>
      </div>

      {/* BODY SCROLLABLE */}
      <div className="flex-1 overflow-y-auto p-6">
        <form id="employee-form" onSubmit={submit} className="space-y-8">
          
          {/* SECCIÓN: DATOS PERSONALES */}
          <div>
            <h3 className="text-lg font-medium leading-6 text-slate-900 border-b border-slate-200 pb-2 mb-4">
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              
              {/* Campos del formulario (igual que antes) */}
              {/* ... */}

            </div>
          </div>

          {/* SECCIÓN: DATOS LABORALES */}
          <div>
            <h3 className="text-lg font-medium leading-6 text-slate-900 border-b border-slate-200 pb-2 mb-4">
              Información Laboral
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              
              {/* ... otros campos ... */}

              <div className="md:col-span-2">
                 <label className={labelClass}>Documentos Adjuntos</label>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                       <span className="text-xs text-slate-500 block mb-1">Fotografía (máx. 5MB)</span>
                       <input 
                          ref={fotoFileRef}
                          type="file" 
                          accept="image/*"
                          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                          onChange={handleFotoChange}
                       />
                       {shouldShowFotoPreview && (
                         <div className="mt-2 flex flex-col items-start">
                           <img 
                             src={state.foto} 
                             className="h-16 w-16 object-cover rounded border" 
                             alt="Vista previa de foto"
                             onError={handleImageError}
                           />
                           <button
                             type="button"
                             onClick={handleRemoveFoto}
                             className="mt-1 text-xs text-red-600 hover:text-red-800"
                           >
                             Eliminar foto
                           </button>
                         </div>
                       )}
                    </div>
                    <div className="flex-1">
                       <span className="text-xs text-slate-500 block mb-1">CV - PDF (máx. 10MB)</span>
                       <input 
                          ref={cvFileRef}
                          type="file" 
                          accept="application/pdf"
                          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                          onChange={handleCvChange}
                       />
                       {state.cv && (
                         <div className="mt-2 flex items-center gap-2">
                           <span className="text-xs text-slate-600 truncate">{state.cv}</span>
                           <button
                             type="button"
                             onClick={() => {
                               setField("cv", "");
                               if (cvFileRef.current) cvFileRef.current.value = "";
                             }}
                             className="text-xs text-red-600 hover:text-red-800"
                           >
                             ×
                           </button>
                         </div>
                       )}
                    </div>
                 </div>
              </div>

            </div>
          </div>

        </form>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            // Limpiar blobs antes de cancelar
            cleanupPreviousFotoBlob();
            onCancel();
          }}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          form="employee-form"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}