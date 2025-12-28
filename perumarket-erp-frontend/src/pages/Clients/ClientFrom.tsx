import { useState } from "react";
import {
  FaRegUser,
  FaEnvelope,
  FaPhone,
  FaCalendarDays,
  FaIdCard,
  FaUserCheck,
  FaSignature,
  FaTriangleExclamation,
  FaSpinner,
  FaPowerOff // <--- NUEVO ICONO
} from "react-icons/fa6";
import { FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";

import type { FormEvent, JSX } from "react";
import type { Cliente } from "../../types/clientes/Client";
import { checkDniExists } from "../../services/clientes/clienteService";
import PersonaForm from "../../components/modals/PersonaForm";
import SelectField from "./SelectField";
import InputField from "./InputField";

interface Props {
  state: Cliente;
  setField: (path: string, value: any) => void;
  onCancel: () => void;
  onSave: (cli: Cliente) => void;
  loading?: boolean;
}

// ------------------------------------------------------
// CAMPOS REUTILIZABLES
// ------------------------------------------------------
// (Mismos componentes InputField y SelectField que ya tenías, sin cambios)
/* interface InputFieldProps {
  label: string;
  icon: JSX.Element;
  value: string;
  type?: string;
  onChange: (val: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onBlur?: () => void;
  success?: boolean;
}

const InputField = ({ label, icon, value, type = "text", onChange, required = false, disabled = false, error = "", onBlur, success = false }: InputFieldProps) => (
  <div className="relative">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
      <span className="text-slate-400">{icon}</span> {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        className={`block w-full rounded-lg border px-3 py-2.5 text-slate-900 placeholder-slate-400 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${error ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' : success ? 'border-emerald-300 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-200' : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-indigo-200 hover:border-indigo-300'}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        onBlur={onBlur}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        {error && <FaTriangleExclamation className="h-4 w-4 text-red-500" />}
        {success && <FaCheckCircle className="h-4 w-4 text-emerald-500" />}
      </div>
    </div>
    {error && <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1 animate-pulse">{error}</p>}
  </div>
);

 */

// ------------------------------------------------------
// FORMULARIO PRINCIPAL
// ------------------------------------------------------

export default function ClienteForm({ state, setField, onCancel, onSave, loading = false }: Props) {
  const tiposCliente = ["NATURAL", "JURIDICA"];
  const tiposDocumento = ["DNI", "Pasaporte", "CE"];
  const estadosCliente = ["ACTIVO", "INACTIVO"]; // <--- Opciones de estado

  // Estados para validación
  const [dniError, setDniError] = useState<string>("");
  const [dniSuccess, setDniSuccess] = useState<boolean>(false);
  const [validatingDni, setValidatingDni] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateDni = async () => {
    const dni = state.persona.numeroDocumento.trim();
    setDniSuccess(false);
    
    if (!dni) { setDniError(""); return; }
    
    // ... validaciones de longitud ...

    setValidatingDni(true);
    try {
      // IMPORTANTE: Desestructurar la respuesta
      const { exists, message } = await checkDniExists(dni, state.id);
      
      if (exists) {
        setDniError(message || "El número de documento ya está registrado en el sistema.");
      } else {
        setDniError("");
        setDniSuccess(true);
      }
    } catch (error) {
      console.error('Error validando DNI:', error);
      setDniError(""); // No bloqueamos si falla la red, pero quitamos el success
    } finally {
      setValidatingDni(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!state.persona.nombres.trim()) errors.nombres = "El nombre es obligatorio";
    if (!state.persona.numeroDocumento.trim()) errors.dni = "El N° Documento es obligatorio";
    else if (dniError) errors.dni = dniError;
    if (!state.persona.apellidoPaterno.trim()) errors.apellidoPaterno = "El apellido es obligatorio";
    if (!state.tipo) errors.tipo = "Seleccione un tipo";
    if (!state.persona.tipoDocumento) errors.tipoDocumento = "Seleccione un documento";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormErrors({});
    if (!validateForm()) return;
    if (dniError) return;
    onSave(state);
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <FaUserCheck className="h-5 w-5" />
            </span>
            {state.id ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 ml-11">
            {state.id ? `Editando registro #${state.id}` : 'Ingrese los datos para registrar un cliente.'}
          </p>
        </div>
        
        {/* Badge de Estado en Header (Solo edición) */}
        {state.id && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            state.estado === 'ACTIVO' 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
              : 'bg-red-50 text-red-600 border-red-200'
          }`}>
            {state.estado || 'ACTIVO'}
          </span>
        )}
      </div>

      {/* Body */}
      <form onSubmit={submit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
  <div className="space-y-8">

    {/* Tipo Cliente */}
 <div className="md:col-span-1 space-y-5">
    <h3 className="text-sm font-semibold border-b pb-2">
        Información del Cliente
      </h3>

      {state.id && (
        <SelectField
          label="Estado del Cliente"
          icon={<FaPowerOff />}
          value={state.estado || "ACTIVO"}
          options={estadosCliente}
          onChange={(val) => setField("estado", val)}
          required
        />
      )}

      <SelectField
        label="Tipo Cliente"
        icon={<FaSignature />}
        value={state.tipo || ""}
        options={tiposCliente}
        onChange={(val) => setField("tipo", val)}
        required
        error={formErrors.tipo}
      />
    </div>

    {/* COLUMNA DERECHA → PERSONA */}
    <PersonaForm
      persona={state.persona}
      setField={setField}
      errors={formErrors}
      onValidateDni={validateDni}
      dniError={formErrors.dni || dniError}
      dniSuccess={dniSuccess}
      validatingDni={validatingDni}
    />

  </div>
</form>


      {/* Footer Fijo */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-800 transition-colors"
        >
          Cancelar
        </button>
        
        <button
          onClick={submit}
          disabled={loading || validatingDni || !!dniError}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold text-white shadow-sm flex items-center gap-2 transition-all ${loading || validatingDni || !!dniError ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin h-4 w-4" />
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <FaCheckCircle className="h-4 w-4" />
              <span>{state.id ? 'Guardar Cambios' : 'Registrar Cliente'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}