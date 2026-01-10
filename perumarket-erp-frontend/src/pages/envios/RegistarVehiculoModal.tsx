import { useState, type FormEvent, useEffect } from "react";
import { 
  FaTruck, 
  FaTimes, 
  FaSave, 
  FaPlus,
  FaSpinner,
  FaClipboard,
  FaCar,
  FaWeight,
  FaRoad,
  FaCheck,
  FaExclamationTriangle
} from "react-icons/fa";
import { api } from "../../services/api";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validatingPlaca, setValidatingPlaca] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [vehiculosExistentes, setVehiculosExistentes] = useState<VehiculoExistente[]>([]);

  const [form, setForm] = useState({
    placa: "",
    marca: "",
    modelo: "",
    capacidadKg: "",
    estado: "DISPONIBLE",
  });

  // Resetear errores al abrir/cerrar
  useEffect(() => {
    if (show) {
      setErrors({});
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Limpiar error del campo al editar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Validación en tiempo real para campos numéricos
    if (name === "capacidadKg") {
      if (value && parseFloat(value) <= 0) {
        setErrors(prev => ({ ...prev, [name]: "La capacidad debe ser mayor a 0" }));
      }
    }
    
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validarPlaca = async (): Promise<boolean> => {
    const placa = form.placa.trim().toUpperCase();
    
    if (!placa) {
      setErrors(prev => ({ ...prev, placa: "La placa es requerida" }));
      return false;
    }

    // Validar formato básico de placa
    const placaRegex = /^[A-Z0-9]{6,10}$/;
    if (!placaRegex.test(placa)) {
      setErrors(prev => ({ ...prev, placa: "Formato de placa inválido" }));
      return false;
    }

    setValidatingPlaca(true);

    try {
      // Verificar si la placa ya existe
      const existe = vehiculosExistentes.some(
        vehiculo => vehiculo.placa.toUpperCase() === placa
      );

      if (existe) {
        setErrors(prev => ({ ...prev, placa: "Esta placa ya está registrada" }));
        return false;
      }
      return true;
    } catch (error) {
      setErrors(prev => ({ ...prev, placa: "Error validando placa" }));
      return false;
    } finally {
      setValidatingPlaca(false);
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};
    
    if (!form.placa.trim()) {
      newErrors.placa = "La placa es requerida";
    }
    
    if (!form.capacidadKg) {
      newErrors.capacidadKg = "La capacidad es requerida";
    } else if (parseFloat(form.capacidadKg) <= 0) {
      newErrors.capacidadKg = "La capacidad debe ser mayor a 0";
    }
    
    setErrors(newErrors);
    
    // Si hay errores básicos, no validamos placa
    if (Object.keys(newErrors).length > 0) {
      return false;
    }
    
    // Validar placa solo si no hay errores básicos
    return await validarPlaca();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!(await validateForm())) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await api.post("/vehiculos", {
        ...form,
        placa: form.placa.trim().toUpperCase(),
        capacidadKg: Number(form.capacidadKg),
      });
      
      setShow(false);
      setForm({
        placa: "",
        marca: "",
        modelo: "",
        capacidadKg: "",
        estado: "DISPONIBLE",
      });
      onSaved?.();
    } catch (error: any) {
      console.error("Error creando vehículo:", error);
      
      if (error.response?.status === 409) {
        setErrors(prev => ({ ...prev, placa: "Esta placa ya está registrada" }));
      } else {
        alert("No se pudo crear el vehículo. Verifique los datos.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <FaPlus className="text-sm" />
        <span className="font-medium">Nuevo Vehículo</span>
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div 
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaTruck className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Registrar Nuevo Vehículo</h2>
                  <p className="text-sm text-gray-500">Complete los datos del vehículo de transporte</p>
                </div>
              </div>
              <button
                onClick={() => setShow(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Placa */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaClipboard className="text-blue-600" />
                  Placa del Vehículo
                </label>
                <div className="relative">
                  <input
                    name="placa"
                    placeholder="Ej: ABC-123"
                    value={form.placa}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-2.5 border ${errors.placa ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all uppercase`}
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaClipboard />
                  </div>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {validatingPlaca ? (
                      <FaSpinner className="animate-spin text-blue-500" />
                    ) : errors.placa ? (
                      <FaExclamationTriangle className="text-red-500" />
                    ) : form.placa ? (
                      <FaCheck className="text-green-500" />
                    ) : null}
                  </div>
                </div>
                {errors.placa && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    ⚠️ {errors.placa}
                  </p>
                )}
              </div>

              {/* Marca y Modelo */}
              <div className="grid grid-cols-2 gap-4">
                {/* Marca */}
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaCar className="text-gray-600" />
                    Marca
                  </label>
                  <div className="relative">
                    <input
                      name="marca"
                      placeholder="Ej: Toyota"
                      value={form.marca}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaCar />
                    </div>
                  </div>
                </div>

                {/* Modelo */}
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaRoad className="text-gray-600" />
                    Modelo
                  </label>
                  <div className="relative">
                    <input
                      name="modelo"
                      placeholder="Ej: Hilux"
                      value={form.modelo}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaRoad />
                    </div>
                  </div>
                </div>
              </div>

              {/* Capacidad */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaWeight className="text-orange-600" />
                  Capacidad
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    name="capacidadKg"
                    placeholder="Ej: 3500"
                    value={form.capacidadKg}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-2.5 border ${errors.capacidadKg ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all`}
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaWeight />
                  </div>
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    kg
                  </span>
                </div>
                {errors.capacidadKg && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    ⚠️ {errors.capacidadKg}
                  </p>
                )}
              </div>

              {/* Estado */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaTruck className="text-purple-600" />
                  Estado
                </label>
                <div className="relative">
                  <select
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all appearance-none"
                  >
                    <option value="DISPONIBLE">Disponible</option>
                    <option value="EN_RUTA">En Ruta</option>
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                    <option value="INACTIVO">Inactivo</option>
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaTruck />
                  </div>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                  disabled={isSubmitting || validatingPlaca}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || validatingPlaca}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Guardar Vehículo
                    </>
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