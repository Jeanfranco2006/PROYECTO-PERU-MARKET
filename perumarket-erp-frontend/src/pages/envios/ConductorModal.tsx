import { useState, type FormEvent } from "react";
// Iconos
import { FaIdBadge, FaIdCard, FaPowerOff } from "react-icons/fa";
// Componentes
import PersonaForm from "../../components/modals/PersonaForm";
import InputField from "../Clients/InputField";
import SelectField from "../Clients/SelectField";
import { ConductorService } from "../../services/envios/conductorService";
import type { Conductor } from "../../types/Conductor/conductor";

interface Props {
  onSaved?: () => void;
}

export default function ConductorModal({ onSaved }: Props) {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- LÓGICA DE ESTADO (Restaurada a la versión que funcionaba) ---
  const [state, setState] = useState<Conductor>({
    persona: {
      tipoDocumento: "DNI",
      numeroDocumento: "",
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      correo: "",
      telefono: "",
      direccion: "",
      fechaNacimiento: ""
    },
    licencia: "",
    categoriaLicencia: "",
    estado: "DISPONIBLE"
  });

  // Lista de campos que pertenecen a "Persona" para redirección automática
  const personaFields = [
    "tipoDocumento", "numeroDocumento", "nombres", 
    "apellidoPaterno", "apellidoMaterno", "correo", 
    "telefono", "direccion", "fechaNacimiento"
  ];

 const setField = (path: string, value: any) => {
    let targetPath = path;
    
    // Aseguramos que sea string
    let finalValue = value ? String(value) : "";

    // --- 1. VALIDACIÓN DNI ---
    // Usamos .includes para que funcione con "numeroDocumento" O "persona.numeroDocumento"
    if (path.includes("numeroDocumento")) {
        finalValue = finalValue.replace(/\D/g, '').slice(0, 8);
    }

    // --- 2. VALIDACIÓN TELÉFONO ---
    if (path.includes("telefono")) {
        finalValue = finalValue.replace(/\D/g, '').slice(0, 9);
    }

    // --- 3. RUTEO INTELIGENTE ---
    // Si el path es exactamente uno de los campos de persona (sin prefijo), se lo agregamos
    if (personaFields.includes(path)) {
        targetPath = `persona.${path}`;
    }

    setState(prev => {
      const keys = targetPath.split(".");
      const copy: any = { ...prev };
      let ref = copy;

      keys.slice(0, -1).forEach(k => {
        ref[k] = { ...ref[k] };
        ref = ref[k];
      });

      ref[keys[keys.length - 1]] = finalValue;
      return copy;
    });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!state.persona.numeroDocumento || !state.licencia) {
        alert("⚠️ Por favor completa el DNI y la Licencia.");
        return;
    }

    setIsLoading(true);
    try {
      // Aplanamos los datos para que Java no reciba NULL
      const datosParaEnviar = {
        ...state.persona,
        licencia: state.licencia,
        categoriaLicencia: state.categoriaLicencia,
        estado: state.estado
      };

      await ConductorService.crearConductor(datosParaEnviar as any);
      setShow(false);
      onSaved?.();
      
      // Limpiar formulario
      setState({
        persona: { tipoDocumento: "DNI", numeroDocumento: "", nombres: "", apellidoPaterno: "", apellidoMaterno: "", correo: "", telefono: "", direccion: "", fechaNacimiento: "" },
        licencia: "",
        categoriaLicencia: "",
        estado: "DISPONIBLE"
      });

    } catch (err) {
      console.error(err);
      alert("❌ Error al registrar conductor.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      {/* BOTÓN PRINCIPAL */}
      <button
        onClick={() => setShow(true)}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95 text-sm md:text-base"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        <span className="hidden sm:inline">Nuevo Conductor</span>
        <span className="sm:hidden">Nuevo</span>
      </button>

      {/* MODAL OVERLAY */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
          
          {/* TARJETA DEL MODAL */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg lg:max-w-5xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-fade-in-up">
            
            {/* HEADER */}
            <div className="flex justify-between items-center px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 bg-gray-50 shrink-0">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="bg-green-100 p-1.5 md:p-2 rounded-lg text-green-600">
                    <FaIdBadge className="text-lg md:text-xl" />
                  </div>
                  Registrar Conductor
                </h2>
                <button 
                  onClick={() => setShow(false)} 
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* BODY (SCROLLABLE) */}
            <form onSubmit={submit} className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">

                {/* COLUMNA 1: PERSONA */}
                <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold">1</span>
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Datos Personales</h3>
                    </div>
                    
                    {/* Contenedor del formulario de persona */}
                    <div className="bg-gray-50/50 p-3 md:p-4 rounded-xl border border-gray-100">
                        {/* Usamos el setField inteligente que detecta los campos */}
                        <PersonaForm
                          persona={state.persona}
                          setField={setField}
                        />
                    </div>
                </div>

                {/* COLUMNA 2: CONDUCTOR */}
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">2</span>
                      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Información Laboral</h3>
                  </div>

                  <div className="space-y-4 bg-white p-1">
                    <div className="transition-all hover:bg-gray-50 p-2 rounded-lg -mx-2">
                        <InputField
                            label="Licencia de Conducir"
                            icon={<FaIdCard className="text-green-500" />}
                            value={state.licencia}
                            onChange={(v: any) => setField("licencia", v)}
                            required
                        />
                    </div>

                    <div className="transition-all hover:bg-gray-50 p-2 rounded-lg -mx-2">
                        <SelectField
                            label="Categoría de Licencia"
                            icon={<FaIdBadge className="text-green-500" />}
                            value={state.categoriaLicencia}
                            options={["A-I", "A-IIa", "A-IIb", "A-IIIa", "A-IIIb", "A-IIIc"]}
                            onChange={(v: any) => setField("categoriaLicencia", v)}
                            required
                        />
                    </div>

                    <div className="transition-all hover:bg-gray-50 p-2 rounded-lg -mx-2">
                        <SelectField
                            label="Estado"
                            icon={<FaPowerOff className={state.estado === 'DISPONIBLE' ? 'text-green-500' : 'text-gray-400'} />}
                            value={state.estado}
                            options={["DISPONIBLE", "EN_RUTA", "INACTIVO"]}
                            onChange={(v: any) => setField("estado", v)}
                            required
                        />
                    </div>
                  </div>
                  
                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 md:p-4 flex gap-3 items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-blue-800 leading-relaxed">
                        Asegúrese de validar la licencia. El conductor estará disponible inmediatamente.
                    </p>
                  </div>
                </div>
              </div>
            </form>

            {/* FOOTER */}
            <div className="px-4 py-4 md:px-8 md:py-5 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0">
                <button 
                    type="button" 
                    onClick={() => setShow(false)} 
                    className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm"
                >
                  Cancelar
                </button>
                <button 
                    onClick={submit} 
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    'Guardar Conductor'
                  )}
                </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}