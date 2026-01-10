import { useState, type FormEvent, useEffect } from "react";
import { FaIdBadge, FaIdCard, FaPowerOff } from "react-icons/fa";
import PersonaForm from "../../components/modals/PersonaForm";
import InputField from "../Clients/InputField";
import SelectField from "../Clients/SelectField";
import { ConductorService } from "../../services/envios/conductorService";
import type { ConductorDTO } from "../../types/Conductor/conductor";
import type { ConductorForm } from "../../types/Conductor/conductorform";

interface Props {
  onSaved?: () => void;
}

// ✅ Categorías de licencia (Perú)
const CATEGORIAS_LICENCIA = [
  "A-I",
  "A-IIA",
  "A-IIB",
  "A-IIIA",
  "A-IIIB",
  "A-IIIC"
];

// ✅ Estado inicial
const INITIAL_FORM: ConductorForm = {
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
};

export default function ConductorModal({ onSaved }: Props) {
  const [show, setShow] = useState(false);
  const [state, setState] = useState<ConductorForm>(INITIAL_FORM);

  // 🔐 estados validación DNI
  const [validatingDni, setValidatingDni] = useState(false);
  const [dniError, setDniError] = useState<string | undefined>();
  const [dniSuccess, setDniSuccess] = useState(false);

  // 🔄 reset completo del formulario
  const resetForm = () => {
    setState(INITIAL_FORM);
    setDniError(undefined);
    setDniSuccess(false);
    setValidatingDni(false);
  };

  // 🧠 reset automático al cerrar modal
  useEffect(() => {
    if (!show) resetForm();
  }, [show]);

  // setField genérico
  const setField = (path: string, value: any) => {
    setState(prev => {
      const keys = path.split(".");
      const copy: any = { ...prev };
      let ref = copy;

      keys.slice(0, -1).forEach(k => {
        ref[k] = { ...ref[k] };
        ref = ref[k];
      });

      ref[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  // ✅ validar DNI (PERSONA)
  const validarDni = async () => {
    const dni = state.persona.numeroDocumento;

    if (!dni || dni.length !== 8) return;

    try {
      setValidatingDni(true);
      setDniError(undefined);
      setDniSuccess(false);

      const existe = await ConductorService.validarDni(dni);

      if (existe) {
        setDniError("Este DNI ya se encuentra registrado");
      } else {
        setDniSuccess(true);
      }
    } catch {
      setDniError("Error al validar DNI");
    } finally {
      setValidatingDni(false);
    }
  };

  // 💾 submit
  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (dniError || !dniSuccess) {
      alert("Corrige el DNI antes de guardar");
      return;
    }

    try {
      const dto: ConductorDTO = {
        ...state.persona,
        licencia: state.licencia,
        categoriaLicencia: state.categoriaLicencia,
        estado: state.estado
      };

      await ConductorService.crearConductor(dto);

      resetForm();
      setShow(false);
      onSaved?.();
    } catch (err) {
      console.error("Error creando conductor:", err);
      alert("No se pudo crear el conductor");
    }
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        + Nuevo Conductor
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-5xl p-6">
            <h2 className="text-lg font-bold mb-6">
              Registrar Conductor
            </h2>

            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* PERSONA */}
                <PersonaForm
                  persona={state.persona}
                  setField={setField}
                  onValidateDni={validarDni}
                  dniError={dniError}
                  dniSuccess={dniSuccess}
                  validatingDni={validatingDni}
                />

                {/* CONDUCTOR */}
                <div className="space-y-5">
                  <h3 className="text-sm font-semibold border-b pb-2">
                    Información del Conductor
                  </h3>

                  <InputField
                    label="Licencia de Conducir"
                    icon={<FaIdCard />}
                    value={state.licencia}
                    onChange={(v) => setField("licencia", v)}
                    required
                  />

                  <SelectField
                    label="Categoría de Licencia"
                    icon={<FaIdBadge />}
                    value={state.categoriaLicencia}
                    options={CATEGORIAS_LICENCIA}
                    onChange={(v) => setField("categoriaLicencia", v)}
                    required
                  />

                  <SelectField
                    label="Estado"
                    icon={<FaPowerOff />}
                    value={state.estado}
                    options={["DISPONIBLE", "EN_RUTA", "INACTIVO"]}
                    onChange={(v) => setField("estado", v)}
                    required
                  />
                </div>
              </div>
<div className="flex justify-end gap-3 pt-6 border-t">
  {/* ❌ Cancelar */}
  <button
    type="button"
    onClick={() => setShow(false)}
    className="
      px-5 py-2 rounded-lg
      bg-gray-200 text-gray-700
      hover:bg-gray-300
      transition-colors
      font-medium
    "
  >
    Cancelar
  </button>

  {/* 💾 Guardar */}
  <button
    type="submit"
    disabled={validatingDni}
    className={`
      px-5 py-2 rounded-lg
      font-medium text-white
      transition-colors
      ${validatingDni
        ? "bg-green-300 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700"}
    `}
  >
    Guardar
  </button>
</div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
