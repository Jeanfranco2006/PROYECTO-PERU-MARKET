import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { RutaService } from "../../services/envios/rutaService";
import { 
  FaRoute, 
  FaMapMarkerAlt, 
  FaMapMarkedAlt, 
  FaRoad, 
  FaClock, 
  FaDollarSign,
  FaTimes,
  FaSave,
  FaPlus
} from "react-icons/fa";

interface Props {
  onSaved?: () => void;
}

export default function RutaModal({ onSaved }: Props) {
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState({
    nombre: "",
    origen: "",
    destino: "",
    distancia_km: "",
    tiempo_estimado_horas: "",
    costo_base: ""
  });

  // Resetear errores al abrir/cerrar
  useEffect(() => {
    if (show) {
      setErrors({});
    }
  }, [show]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validación en tiempo real
    if (name === "distancia_km" || name === "tiempo_estimado_horas" || name === "costo_base") {
      if (value && parseFloat(value) < 0) {
        setErrors(prev => ({ ...prev, [name]: "El valor no puede ser negativo" }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
    
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!form.origen.trim()) newErrors.origen = "El origen es requerido";
    if (!form.destino.trim()) newErrors.destino = "El destino es requerido";
    
    if (form.distancia_km && parseFloat(form.distancia_km) <= 0) {
      newErrors.distancia_km = "La distancia debe ser mayor a 0";
    }
    
    if (form.tiempo_estimado_horas && parseFloat(form.tiempo_estimado_horas) <= 0) {
      newErrors.tiempo_estimado_horas = "El tiempo debe ser mayor a 0";
    }
    
    if (form.costo_base && parseFloat(form.costo_base) <= 0) {
      newErrors.costo_base = "El costo debe ser mayor a 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await RutaService.crearRuta({
        nombre: form.nombre,
        origen: form.origen,
        destino: form.destino,
        distancia_km: form.distancia_km ? Number(form.distancia_km) : null,
        tiempo_estimado_horas: form.tiempo_estimado_horas ? Number(form.tiempo_estimado_horas) : null,
        costo_base: form.costo_base ? Number(form.costo_base) : null
      });

      setShow(false);
      setForm({ 
        nombre: "", 
        origen: "", 
        destino: "", 
        distancia_km: "", 
        tiempo_estimado_horas: "", 
        costo_base: "" 
      });
      onSaved?.();
    } catch (error: any) {
      console.error("Error creando ruta:", error);
      alert(error.message || "Ocurrió un error al crear la ruta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2.5 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <FaPlus className="text-sm" />
        <span className="font-medium">Nueva Ruta</span>
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
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FaRoute className="text-yellow-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Registrar Nueva Ruta</h2>
                  <p className="text-sm text-gray-500">Complete los datos de la ruta de envío</p>
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
              {/* Nombre */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaRoute className="text-yellow-600" />
                  Nombre de la Ruta
                </label>
                <div className="relative">
                  <input
                    name="nombre"
                    placeholder="Ej: Ruta Lima - Trujillo"
                    value={form.nombre}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border ${errors.nombre ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 transition-all`}
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaRoute />
                  </div>
                </div>
                {errors.nombre && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    ⚠️ {errors.nombre}
                  </p>
                )}
              </div>

              {/* Origen y Destino */}
              <div className="grid grid-cols-2 gap-4">
                {/* Origen */}
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaMapMarkerAlt className="text-green-600" />
                    Origen
                  </label>
                  <div className="relative">
                    <input
                      name="origen"
                      placeholder="Ej: Lima"
                      value={form.origen}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 border ${errors.origen ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 transition-all`}
                      required
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaMapMarkerAlt />
                    </div>
                  </div>
                  {errors.origen && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      ⚠️ {errors.origen}
                    </p>
                  )}
                </div>

                {/* Destino */}
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaMapMarkedAlt className="text-blue-600" />
                    Destino
                  </label>
                  <div className="relative">
                    <input
                      name="destino"
                      placeholder="Ej: Trujillo"
                      value={form.destino}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 border ${errors.destino ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 transition-all`}
                      required
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaMapMarkedAlt />
                    </div>
                  </div>
                  {errors.destino && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      ⚠️ {errors.destino}
                    </p>
                  )}
                </div>
              </div>

              {/* Distancia */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaRoad className="text-gray-600" />
                  Distancia (km)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    name="distancia_km"
                    placeholder="Ej: 560.5"
                    value={form.distancia_km}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border ${errors.distancia_km ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 transition-all`}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaRoad />
                  </div>
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    km
                  </span>
                </div>
                {errors.distancia_km && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    ⚠️ {errors.distancia_km}
                  </p>
                )}
              </div>

              {/* Tiempo */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaClock className="text-purple-600" />
                  Tiempo Estimado
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    name="tiempo_estimado_horas"
                    placeholder="Ej: 8.5"
                    value={form.tiempo_estimado_horas}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border ${errors.tiempo_estimado_horas ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 transition-all`}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaClock />
                  </div>
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    horas
                  </span>
                </div>
                {errors.tiempo_estimado_horas && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    ⚠️ {errors.tiempo_estimado_horas}
                  </p>
                )}
              </div>

              {/* Costo */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaDollarSign className="text-green-600" />
                  Costo Base
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="costo_base"
                    placeholder="Ej: 250.00"
                    value={form.costo_base}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border ${errors.costo_base ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 transition-all`}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaDollarSign />
                  </div>
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    S/
                  </span>
                </div>
                {errors.costo_base && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    ⚠️ {errors.costo_base}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Guardar Ruta
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