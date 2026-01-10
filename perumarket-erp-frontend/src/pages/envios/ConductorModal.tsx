import { useState, type FormEvent, useEffect } from "react";
import { 
  FaIdBadge, 
  FaIdCard, 
  FaPowerOff, 
  FaTimes, 
  FaSave, 
  FaPlus,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheck,
  FaExclamationTriangle
} from "react-icons/fa";
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

// ✅ Tipos de documento
const TIPOS_DOCUMENTO = ["DNI", "Pasaporte", "CE"];

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validatingDni, setValidatingDni] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<ConductorForm>(INITIAL_FORM);

  // Resetear formulario al abrir/cerrar
  useEffect(() => {
    if (show) {
      setErrors({});
    } else {
      setForm(INITIAL_FORM);
      setValidatingDni(false);
    }
  }, [show]);

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
    
    // Actualizar estado anidado
    if (name.startsWith('persona.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        persona: { ...prev.persona, [field]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const validarDni = async (): Promise<boolean> => {
    const dni = form.persona.numeroDocumento;
    
    if (!dni) {
      setErrors(prev => ({ ...prev, 'persona.numeroDocumento': "El DNI es requerido" }));
      return false;
    }

    if (dni.length !== 8) {
      setErrors(prev => ({ ...prev, 'persona.numeroDocumento': "El DNI debe tener 8 dígitos" }));
      return false;
    }

    setValidatingDni(true);
    
    try {
      const existe = await ConductorService.validarDni(dni);

      if (existe) {
        setErrors(prev => ({ ...prev, 'persona.numeroDocumento': "Este DNI ya está registrado" }));
        return false;
      }
      return true;
    } catch {
      setErrors(prev => ({ ...prev, 'persona.numeroDocumento': "Error validando DNI" }));
      return false;
    } finally {
      setValidatingDni(false);
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};
    
    // Validar campos de persona
    if (!form.persona.nombres.trim()) newErrors['persona.nombres'] = "Los nombres son requeridos";
    if (!form.persona.apellidoPaterno.trim()) newErrors['persona.apellidoPaterno'] = "El apellido paterno es requerido";
    
    // Validar campos de conductor
    if (!form.licencia.trim()) newErrors.licencia = "La licencia es requerida";
    if (!form.categoriaLicencia) newErrors.categoriaLicencia = "La categoría es requerida";
    
    setErrors(newErrors);
    
    // Si hay errores básicos, no validamos DNI
    if (Object.keys(newErrors).length > 0) {
      return false;
    }
    
    // Validar DNI
    return await validarDni();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!(await validateForm())) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const dto: ConductorDTO = {
        ...form.persona,
        licencia: form.licencia,
        categoriaLicencia: form.categoriaLicencia,
        estado: form.estado
      };

      await ConductorService.crearConductor(dto);

      setShow(false);
      setForm(INITIAL_FORM);
      onSaved?.();
    } catch (err) {
      console.error("Error creando conductor:", err);
      alert("No se pudo crear el conductor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <FaPlus className="text-sm" />
        <span className="font-medium">Nuevo Conductor</span>
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div 
            className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaIdBadge className="text-green-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Registrar Nuevo Conductor</h2>
                  <p className="text-sm text-gray-500">Complete los datos del conductor</p>
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
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Columna Izquierda - Información Personal */}
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                    Información Personal
                  </h3>

                  {/* Tipo Documento */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaIdCard className="text-blue-600" />
                      Tipo de Documento
                    </label>
                    <div className="relative">
                      <select
                        name="persona.tipoDocumento"
                        value={form.persona.tipoDocumento}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all appearance-none"
                      >
                        {TIPOS_DOCUMENTO.map(tipo => (
                          <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaIdCard />
                      </div>
                    </div>
                  </div>

                  {/* Número Documento */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaIdCard className="text-purple-600" />
                      Número de Documento
                    </label>
                    <div className="relative">
                      <input
                        name="persona.numeroDocumento"
                        placeholder="Ej: 12345678"
                        value={form.persona.numeroDocumento}
                        onChange={handleChange}
                        onBlur={validarDni}
                        maxLength={8}
                        className={`w-full pl-10 pr-10 py-2.5 border ${errors['persona.numeroDocumento'] ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all`}
                        required
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaIdCard />
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validatingDni ? (
                          <FaSpinner className="animate-spin text-green-500" />
                        ) : errors['persona.numeroDocumento'] ? (
                          <FaExclamationTriangle className="text-red-500" />
                        ) : form.persona.numeroDocumento.length === 8 ? (
                          <FaCheck className="text-green-500" />
                        ) : null}
                      </div>
                    </div>
                    {errors['persona.numeroDocumento'] && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        ⚠️ {errors['persona.numeroDocumento']}
                      </p>
                    )}
                  </div>

                  {/* Nombres */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaUser className="text-indigo-600" />
                      Nombres Completos
                    </label>
                    <div className="relative">
                      <input
                        name="persona.nombres"
                        placeholder="Ej: Juan Carlos"
                        value={form.persona.nombres}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2.5 border ${errors['persona.nombres'] ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all`}
                        required
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaUser />
                      </div>
                    </div>
                    {errors['persona.nombres'] && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        ⚠️ {errors['persona.nombres']}
                      </p>
                    )}
                  </div>

                  {/* Apellidos */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <FaUser className="text-gray-600" />
                        Apellido Paterno
                      </label>
                      <div className="relative">
                        <input
                          name="persona.apellidoPaterno"
                          placeholder="Ej: Pérez"
                          value={form.persona.apellidoPaterno}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2.5 border ${errors['persona.apellidoPaterno'] ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all`}
                          required
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <FaUser />
                        </div>
                      </div>
                      {errors['persona.apellidoPaterno'] && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          ⚠️ {errors['persona.apellidoPaterno']}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <FaUser className="text-gray-600" />
                        Apellido Materno
                      </label>
                      <div className="relative">
                        <input
                          name="persona.apellidoMaterno"
                          placeholder="Ej: Gómez"
                          value={form.persona.apellidoMaterno}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <FaUser />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fecha Nacimiento */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaCalendarAlt className="text-amber-600" />
                      Fecha de Nacimiento
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="persona.fechaNacimiento"
                        value={form.persona.fechaNacimiento}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaCalendarAlt />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna Derecha - Contacto e Información Conductor */}
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                    Contacto e Información del Conductor
                  </h3>

                  {/* Correo */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaEnvelope className="text-red-500" />
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="persona.correo"
                        placeholder="Ej: correo@example.com"
                        value={form.persona.correo}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaEnvelope />
                      </div>
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaPhone className="text-green-600" />
                      Teléfono / Móvil
                    </label>
                    <div className="relative">
                      <input
                        name="persona.telefono"
                        placeholder="Ej: 987654321"
                        value={form.persona.telefono}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaPhone />
                      </div>
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaMapMarkerAlt className="text-blue-500" />
                      Dirección de Domicilio
                    </label>
                    <div className="relative">
                      <input
                        name="persona.direccion"
                        placeholder="Ej: Av. Principal 123"
                        value={form.persona.direccion}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaMapMarkerAlt />
                      </div>
                    </div>
                  </div>

                  {/* Licencia */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaIdCard className="text-purple-600" />
                      Licencia de Conducir
                    </label>
                    <div className="relative">
                      <input
                        name="licencia"
                        placeholder="Ej: A12345678"
                        value={form.licencia}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2.5 border ${errors.licencia ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all uppercase`}
                        required
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaIdCard />
                      </div>
                    </div>
                    {errors.licencia && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        ⚠️ {errors.licencia}
                      </p>
                    )}
                  </div>

                  {/* Categoría Licencia */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaIdBadge className="text-amber-600" />
                      Categoría de Licencia
                    </label>
                    <div className="relative">
                      <select
                        name="categoriaLicencia"
                        value={form.categoriaLicencia}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2.5 border ${errors.categoriaLicencia ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all appearance-none`}
                        required
                      >
                        <option value="">-- Seleccionar --</option>
                        {CATEGORIAS_LICENCIA.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaIdBadge />
                      </div>
                    </div>
                    {errors.categoriaLicencia && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        ⚠️ {errors.categoriaLicencia}
                      </p>
                    )}
                  </div>

                  {/* Estado */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaPowerOff className="text-gray-600" />
                      Estado
                    </label>
                    <div className="relative">
                      <select
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all appearance-none"
                      >
                        <option value="DISPONIBLE">Disponible</option>
                        <option value="EN_RUTA">En Ruta</option>
                        <option value="INACTIVO">Inactivo</option>
                      </select>
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaPowerOff />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                  disabled={isSubmitting || validatingDni}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || validatingDni}
                  className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Guardar Conductor
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