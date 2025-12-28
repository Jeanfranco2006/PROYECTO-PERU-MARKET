import { useState, type FormEvent } from "react";
import { api } from "../../services/api";

import { FaIdCard, FaPowerOff } from "react-icons/fa";
import PersonaForm from "../../components/modals/PersonaForm";
import InputField from "../Clients/InputField";
import SelectField from "../Clients/SelectField";

interface Props {
  onSaved?: () => void;
}

export default function ConductorModal({ onSaved }: Props) {
  const [show, setShow] = useState(false);

  const [state, setState] = useState({
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
    estado: "DISPONIBLE"
  });

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

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await api.post("/conductores", state);
    setShow(false);
    onSaved?.();
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
                <button type="button" onClick={() => setShow(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
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
