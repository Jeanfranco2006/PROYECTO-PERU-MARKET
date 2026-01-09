import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { FiX, FiTruck, FiCheck, FiAlertCircle } from "react-icons/fi";
import { api } from "../../services/api";
import InputField from "../../pages/Clients/InputField";
import SelectField from "../../pages/Clients/SelectField";
import { FaWeight, FaCar, FaClipboardCheck, FaSpinner } from "react-icons/fa";

interface Props {
  onSaved?: () => void;
}

interface VehiculoExistente {
  id: number;
  placa: string;
  estado: string;
}

export default function VehiculoModal({ onSaved }: Props) {
  const [show, setShow] = useState(false);
  const [validatingPlaca, setValidatingPlaca] = useState(false);
  const [placaError, setPlacaError] = useState("");
  const [placaSuccess, setPlacaSuccess] = useState(false);
  const [vehiculosExistentes, setVehiculosExistentes] = useState<VehiculoExistente[]>([]);

  const [form, setForm] = useState({
    placa: "",
    marca: "",
    modelo: "",
    capacidadKg: "",
    estado: "DISPONIBLE", // Estado por defecto
  });

  // Cargar vehículos existentes al abrir el modal
  useEffect(() => {
    if (show) {
      cargarVehiculosExistentes();
    }
  }, [show]);

  const cargarVehiculosExistentes = async () => {
    try {
      const response = await api.get("/vehiculos");
      const vehiculos = response.data.map((v: any) => ({
        id: v.id,
        placa: v.placa,
        estado: v.estado
      }));
      setVehiculosExistentes(vehiculos);
    } catch (error) {
      console.error("Error cargando vehículos:", error);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Si cambia la placa, resetear validaciones
    if (name === "placa") {
      setPlacaError("");
      setPlacaSuccess(false);
    }
    
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validarPlaca = async () => {
    const placa = form.placa.trim().toUpperCase();
    
    if (!placa) {
      setPlacaError("La placa es requerida");
      setPlacaSuccess(false);
      return;
    }

    // Validar formato básico de placa (puedes ajustar esta regex según tu país)
    const placaRegex = /^[A-Z0-9]{6,10}$/;
    if (!placaRegex.test(placa)) {
      setPlacaError("Formato de placa inválido");
      setPlacaSuccess(false);
      return;
    }

    setValidatingPlaca(true);

    try {
      // Verificar si la placa ya existe
      const existe = vehiculosExistentes.some(
        vehiculo => vehiculo.placa.toUpperCase() === placa
      );

      if (existe) {
        setPlacaError("Esta placa ya está registrada");
        setPlacaSuccess(false);
      } else {
        setPlacaSuccess(true);
        setPlacaError("");
      }
    } catch (error) {
      setPlacaError("Error validando placa");
      setPlacaSuccess(false);
    } finally {
      setValidatingPlaca(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!form.placa.trim()) {
      setPlacaError("La placa es requerida");
      return;
    }

    if (!form.capacidadKg || Number(form.capacidadKg) <= 0) {
      alert("La capacidad debe ser mayor a 0");
      return;
    }

    // Validar placa antes de enviar
    if (!placaSuccess) {
      await validarPlaca();
      if (placaError) {
        return;
      }
    }

    try {
      await api.post("/vehiculos", {
        ...form,
        placa: form.placa.trim().toUpperCase(), // Normalizar placa
        capacidadKg: Number(form.capacidadKg),
        estado: form.estado, // Mantener el estado seleccionado
      });
      
      setShow(false);
      setForm({
        placa: "",
        marca: "",
        modelo: "",
        capacidadKg: "",
        estado: "DISPONIBLE",
      });
      setPlacaError("");
      setPlacaSuccess(false);
      onSaved?.();
    } catch (error: any) {
      console.error("Error creando vehículo:", error);
      
      if (error.response?.status === 409) {
        setPlacaError("Esta placa ya está registrada");
      } else {
        alert("No se pudo crear el vehículo. Verifique los datos.");
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 shadow-md transition-all font-medium"
      >
        <FiTruck className="text-lg" /> Nuevo Vehículo
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

            {/* HEADER */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Registrar Vehículo
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Complete todos los campos requeridos (<span className="text-red-500">*</span>)
                </p>
              </div>
              <button
                onClick={() => {
                  setShow(false);
                  setForm({
                    placa: "",
                    marca: "",
                    modelo: "",
                    capacidadKg: "",
                    estado: "DISPONIBLE",
                  });
                  setPlacaError("");
                  setPlacaSuccess(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={24} className="text-gray-500" />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={submit} className="p-6">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                {/* ================= COLUMNA IZQUIERDA ================= */}
                <div className="space-y-5">
                  <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">
                    Información del Vehículo
                  </h3>

                  {/* Campo de Placa con validación */}
                  <div className="relative">
                    <InputField
                      label="Placa"
                      icon={<FaClipboardCheck />}
                      value={form.placa}
                      onChange={(val) => setForm(prev => ({ ...prev, placa: val }))}
                      onBlur={validarPlaca}
                      required
                      error={placaError}
                      success={placaSuccess}
                    />
                    
                    {validatingPlaca && (
                      <div className="absolute right-3 top-[34px] text-blue-500">
                        <FaSpinner className="animate-spin h-4 w-4" />
                      </div>
                    )}
                    
                    {placaSuccess && !validatingPlaca && (
                      <div className="absolute right-3 top-[34px] text-green-500">
                        <FiCheck className="h-4 w-4" />
                      </div>
                    )}
                    
                    {placaError && !validatingPlaca && (
                      <div className="absolute right-3 top-[34px] text-red-500">
                        <FiAlertCircle className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <InputField
                    label="Marca"
                    icon={<FaCar />}
                    value={form.marca}
                    onChange={(val) => setForm(prev => ({ ...prev, marca: val }))}
                  />

                  <InputField
                    label="Modelo"
                    icon={<FaCar />}
                    value={form.modelo}
                    onChange={(val) => setForm(prev => ({ ...prev, modelo: val }))}
                  />
                </div>

                {/* ================= COLUMNA DERECHA ================= */}
                <div className="space-y-5">
                  <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">
                    Especificaciones
                  </h3>

                  <InputField
                    label="Capacidad (Kg)"
                    icon={<FaWeight />}
                    type="number"
                    value={form.capacidadKg}
                    onChange={(val) => setForm(prev => ({ ...prev, capacidadKg: val }))}
                    required
                  />

                  <SelectField
                    label="Estado"
                    icon={<FiTruck />}
                    value={form.estado}
                    options={["DISPONIBLE", "EN_RUTA", "MANTENIMIENTO", "INACTIVO"]}
                    onChange={(val) => setForm(prev => ({ ...prev, estado: val }))}
                    required
                  />
                </div>
              </div>

              {/* FOOTER */}
              <div className="mt-10 pt-6 border-t border-gray-200 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShow(false);
                    setForm({
                      placa: "",
                      marca: "",
                      modelo: "",
                      capacidadKg: "",
                      estado: "DISPONIBLE",
                    });
                    setPlacaError("");
                    setPlacaSuccess(false);
                  }}
                  className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={validatingPlaca}
                >
                  {validatingPlaca ? (
                    <span className="flex items-center gap-2">
                      <FaSpinner className="animate-spin" /> Validando...
                    </span>
                  ) : (
                    "Guardar Vehículo"
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}