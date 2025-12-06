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
interface InputFieldProps {
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

interface SelectFieldProps {
  label: string;
  icon: JSX.Element;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

const SelectField = ({ label, icon, value, options, onChange, required = false, disabled = false, error = "" }: SelectFieldProps) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
      <span className="text-slate-400">{icon}</span> {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <select
      className={`block w-full rounded-lg border px-3 py-2.5 text-slate-900 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-slate-100 disabled:cursor-not-allowed ${error ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-indigo-200 hover:border-indigo-300'}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
    >
      <option value="">-- Seleccionar --</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
  </div>
);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Información Básica
            </h3>

            {/* --- SELECTOR DE ESTADO (SOLO EDICIÓN) --- */}
            {state.id && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <SelectField
                  label="Estado del Cliente"
                  icon={<FaPowerOff />}
                  value={state.estado || "ACTIVO"}
                  options={estadosCliente}
                  onChange={(val) => setField("estado", val)}
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
               <SelectField
                label="Tipo Cliente"
                icon={<FaSignature />}
                value={state.tipo || ""}
                options={tiposCliente}
                onChange={(val) => setField("tipo", val)}
                required
                error={formErrors.tipo}
              />
               <SelectField
                label="Documento"
                icon={<FaIdCard />}
                value={state.persona.tipoDocumento}
                options={tiposDocumento}
                onChange={(val) => {
                  setField("persona.tipoDocumento", val);
                  setDniSuccess(false);
                }}
                required
                error={formErrors.tipoDocumento}
              />
            </div>

            {/* Resto de campos (DNI, Nombres, etc.) se mantienen igual... */}
            <div className="relative">
              <InputField
                label="Número de Documento"
                icon={<FaIdCard />}
                value={state.persona.numeroDocumento}
                onChange={(val) => {
                  if (/^\d*$/.test(val)) {
                    setField("persona.numeroDocumento", val);
                    setDniError("");
                    setDniSuccess(false);
                  }
                }}
                onBlur={validateDni}
                required
                error={formErrors.dni || dniError}
                success={dniSuccess}
                disabled={validatingDni}
              />
              {validatingDni && (
                <div className="absolute right-3 top-[34px] text-indigo-500">
                  <FaSpinner className="animate-spin h-4 w-4" />
                </div>
              )}
            </div>

            <InputField
              label="Nombres Completos"
              icon={<FaRegUser />}
              value={state.persona.nombres}
              onChange={(val) => setField("persona.nombres", val)}
              required
              error={formErrors.nombres}
            />

             <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Apellido Paterno"
                  icon={<FaRegUser />}
                  value={state.persona.apellidoPaterno}
                  onChange={(val) => setField("persona.apellidoPaterno", val)}
                  required
                  error={formErrors.apellidoPaterno}
                />
                <InputField
                  label="Apellido Materno"
                  icon={<FaRegUser />}
                  value={state.persona.apellidoMaterno}
                  onChange={(val) => setField("persona.apellidoMaterno", val)}
                />
             </div>
          </div>

          {/* COLUMNA DERECHA (Contacto) se mantiene igual... */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Contacto y Ubicación
            </h3>

            <InputField
              label="Correo Electrónico"
              icon={<FaEnvelope />}
              type="email"
              value={state.persona.correo}
              onChange={(val) => setField("persona.correo", val)}
            />
            
            <InputField
              label="Teléfono / Móvil"
              icon={<FaPhone />}
              value={state.persona.telefono}
              onChange={(val) => setField("persona.telefono", val)}
            />

            <InputField
              label="Dirección de Domicilio"
              icon={<FaMapMarkerAlt />}
              value={state.persona.direccion}
              onChange={(val) => setField("persona.direccion", val)}
            />

            <InputField
              label="Fecha de Nacimiento"
              icon={<FaCalendarDays />}
              type="date"
              value={state.persona.fechaNacimiento || ""}
              onChange={(val) => setField("persona.fechaNacimiento", val)}
            />
          </div>
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