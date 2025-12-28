import {
  FaIdCard,
  FaRegUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSpinner
} from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import SelectField from "../../pages/Clients/SelectField";
import InputField from "../../pages/Clients/InputField";
import type { Persona } from "../../types/Employee";

interface PersonaFormProps {
  persona: Persona;
  setField: (path: string, value: any) => void;
  errors?: Record<string, string>;
  disabled?: boolean;

  // control DNI desde el padre
  onValidateDni?: () => void;
  dniError?: string;
  dniSuccess?: boolean;
  validatingDni?: boolean;
}

export default function PersonaForm({
  persona,
  setField,
  errors = {},
  disabled = false,
  onValidateDni,
  dniError,
  dniSuccess,
  validatingDni
}: PersonaFormProps) {
  const tiposDocumento = ["DNI", "Pasaporte", "CE"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

      {/* ================= COLUMNA IZQUIERDA ================= */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">
          Información Personal
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Documento"
            icon={<FaIdCard />}
            value={persona.tipoDocumento}
            options={tiposDocumento}
            onChange={(val) => setField("persona.tipoDocumento", val)}
            required
            error={errors.tipoDocumento}
            disabled={disabled}
          />
        </div>

        {/* DNI */}
        <div className="relative">
          <InputField
            label="Número de Documento"
            icon={<FaIdCard />}
            value={persona.numeroDocumento}
            onChange={(val) => {
              if (/^\d*$/.test(val)) {
                setField("persona.numeroDocumento", val);
              }
            }}
            onBlur={onValidateDni}
            required
            error={errors.dni || dniError}
            success={dniSuccess}
            disabled={disabled || validatingDni}
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
          value={persona.nombres}
          onChange={(val) => setField("persona.nombres", val)}
          required
          error={errors.nombres}
          disabled={disabled}
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Apellido Paterno"
            icon={<FaRegUser />}
            value={persona.apellidoPaterno}
            onChange={(val) => setField("persona.apellidoPaterno", val)}
            required
            error={errors.apellidoPaterno}
            disabled={disabled}
          />
          <InputField
            label="Apellido Materno"
            icon={<FaRegUser />}
            value={persona.apellidoMaterno}
            onChange={(val) => setField("persona.apellidoMaterno", val)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* ================= COLUMNA DERECHA ================= */}
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">
          Contacto y Ubicación
        </h3>

        <InputField
          label="Correo Electrónico"
          icon={<FaEnvelope />}
          type="email"
          value={persona.correo}
          onChange={(val) => setField("persona.correo", val)}
          disabled={disabled}
        />

        <InputField
          label="Teléfono / Móvil"
          icon={<FaPhone />}
          value={persona.telefono}
          onChange={(val) => setField("persona.telefono", val)}
          disabled={disabled}
        />

        <InputField
          label="Dirección de Domicilio"
          icon={<FaMapMarkerAlt />}
          value={persona.direccion}
          onChange={(val) => setField("persona.direccion", val)}
          disabled={disabled}
        />

        <InputField
          label="Fecha de Nacimiento"
          icon={<FaCalendarDays />}
          type="date"
          value={persona.fechaNacimiento || ""}
          onChange={(val) => setField("persona.fechaNacimiento", val)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
