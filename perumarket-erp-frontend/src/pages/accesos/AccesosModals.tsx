import { useState, useEffect } from "react";
import { FiX, FiCheck, FiAlertCircle, FiEyeOff, FiEye } from "react-icons/fi";

// Modal para ver detalles
export const ModalDetalles = ({ 
  isOpen, 
  titulo, 
  children, 
  onClose 
}: { 
  isOpen: boolean; 
  titulo: string; 
  children: React.ReactNode; 
  onClose: () => void 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b bg-white sticky top-0">
          <h2 className="text-xl font-bold text-gray-800">{titulo}</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
        <div className="border-t p-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal para editar/crear
export const ModalEditar = ({ 
  isOpen, 
  titulo, 
  fields, 
  onSave, 
  onClose, 
  type = "edit",
  rolesDropdown = [] 
}: { 
  isOpen: boolean; 
  titulo: string; 
  fields: any; 
  onSave: (data: any) => void; 
  onClose: () => void; 
  type?: string;
  rolesDropdown?: any[]; 
}) => {
  const [formData, setFormData] = useState(fields);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (type === "usuario") {
      if (!formData.username?.trim()) newErrors.username = 'El usuario es requerido';
      if (!formData.nombres?.trim()) newErrors.nombres = 'Los nombres son requeridos';
      if (!formData.correo?.trim()) newErrors.correo = 'El correo es requerido';
      if (formData.correo && !/\S+@\S+\.\S+/.test(formData.correo)) newErrors.correo = 'Correo inválido';
      if (!formData.idRol) newErrors.idRol = 'El rol es requerido';
      // Solo validar contraseña si es nuevo usuario o si se está cambiando
      if ((!formData.id && !formData.password) || (formData.password && formData.password.length < 6)) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
    }
    
    if (type === "rol" && !formData.nombre?.trim()) newErrors.nombre = 'El nombre es requerido';
    if (type === "modulo" && !formData.nombre?.trim()) newErrors.nombre = 'El nombre es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  useEffect(() => {
    setFormData(fields);
    setShowPassword(false);
  }, [fields]);

  if (!isOpen) return null;

  const renderField = (key: string, value: any) => {
    if (key === 'id' || key === 'fecha_creacion' || key === 'fecha_actualizacion' || 
        key === 'id_persona' || key === 'usuarioId') return null;
    
    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
    
    if (key === 'estado') {
      return (
        <div key={key}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <select
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors[key] ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
          {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
        </div>
      );
    }

    if (key === 'tipoDocumento') {
      return (
        <div key={key}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <select
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="DNI">DNI</option>
            <option value="RUC">RUC</option>
            <option value="PASAPORTE">PASAPORTE</option>
            <option value="OTRO">OTRO</option>
          </select>
        </div>
      );
    }

    if (key === 'idRol') {
      return (
        <div key={key}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Rol</label>
          <select
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors[key] ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar rol</option>
            {rolesDropdown.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
          {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
        </div>
      );
    }

    if (key === 'password') {
      return (
        <div key={key}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contraseña {!formData.id && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors[key] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={formData.id ? "Dejar vacío para mantener la actual" : "Ingrese la contraseña"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
          {formData.id && (
            <p className="text-xs text-gray-500 mt-1">Dejar vacío para mantener la contraseña actual</p>
          )}
        </div>
      );
    }
    
    return (
      <div key={key}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <input
          type={key.includes('correo') ? 'email' : key.includes('telefono') ? 'tel' : key.includes('fecha') ? 'date' : 'text'}
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors[key] ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={`Ingrese ${label.toLowerCase()}`}
        />
        {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b bg-white sticky top-0">
          <h2 className="text-xl font-bold text-gray-800">{titulo}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiX size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          {Object.entries(formData).map(([key, value]) => renderField(key, value))}
        </div>
        <div className="border-t p-6 bg-gray-50 flex gap-3 justify-end sticky bottom-0">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <FiCheck size={16} /> {type === "edit" ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal para permisos de módulos por rol
// En AccesosModals.tsx - ACTUALIZAR COMPLETAMENTE EL MODAL PERMISOS
export const ModalPermisos = ({ 
  isOpen, 
  rol, 
  modulos, 
  permisos, 
  onSave, 
  onClose 
}: { 
  isOpen: boolean; 
  rol: any; 
  modulos: any[]; 
  permisos: any[]; 
  onSave: (permisos: any[]) => void; 
  onClose: () => void 
}) => {
  const [permisosLocales, setPermisosLocales] = useState(permisos);

  const togglePermiso = (idModulo: number) => {
    setPermisosLocales(prev => 
      prev.map(p => 
        p.idModulo === idModulo 
          ? { ...p, hasAccess: !p.hasAccess }
          : p
      )
    );
  };

  const handleSave = () => {
    onSave(permisosLocales);
    onClose();
  };

  const toggleAll = (access: boolean) => {
    setPermisosLocales(prev => 
      prev.map(p => ({ ...p, hasAccess: access }))
    );
  };

  // Contar permisos activos
  const permisosActivos = permisosLocales.filter(p => p.hasAccess).length;
  const totalPermisos = permisosLocales.length;

  useEffect(() => {
    setPermisosLocales(permisos);
  }, [permisos]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b bg-white sticky top-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Gestión de Permisos</h2>
            <p className="text-gray-600">Rol: <span className="font-semibold">{rol?.nombre}</span></p>
            <p className="text-sm text-gray-500">
              {permisosActivos} de {totalPermisos} módulos permitidos
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiX size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Controles rápidos */}
          <div className="flex gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
            <button
              onClick={() => toggleAll(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <FiCheck className="inline mr-2" size={16} />
              Permitir Todos
            </button>
            <button
              onClick={() => toggleAll(false)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <FiX className="inline mr-2" size={16} />
              Denegar Todos
            </button>
            <div className="flex-1"></div>
            <div className="bg-white px-3 py-2 rounded border">
              <span className="text-sm font-medium text-gray-700">
                {permisosActivos} / {totalPermisos} seleccionados
              </span>
            </div>
          </div>

          {/* Lista de módulos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modulos.map((modulo) => {
              const permiso = permisosLocales.find(p => p.idModulo === modulo.id);
              const tieneAcceso = permiso?.hasAccess || false;
              
              return (
                <div 
                  key={modulo.id} 
                  className={`border rounded-lg p-4 transition-all cursor-pointer ${
                    tieneAcceso 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  } hover:shadow-md`}
                  onClick={() => togglePermiso(modulo.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{modulo.nombre}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          tieneAcceso 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {tieneAcceso ? 'Permitido' : 'Denegado'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{modulo.descripcion}</p>
                      <code className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {modulo.ruta}
                      </code>
                    </div>
                    
                    <div className="ml-4">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={tieneAcceso}
                            onChange={() => togglePermiso(modulo.id)}
                            className="sr-only"
                          />
                          <div className={`block w-14 h-8 rounded-full transition-colors ${
                            tieneAcceso ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                            tieneAcceso ? 'transform translate-x-6' : ''
                          }`}></div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="border-t p-6 bg-gray-50 flex gap-3 justify-end sticky bottom-0">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <FiCheck size={16} /> Guardar Permisos
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal para confirmar eliminación
export const ModalConfirmar = ({ 
  isOpen, 
  titulo, 
  mensaje, 
  onConfirm, 
  onCancel, 
  tipo = "eliminar" 
}: { 
  isOpen: boolean; 
  titulo: string; 
  mensaje: string; 
  onConfirm: () => void; 
  onCancel: () => void; 
  tipo?: string 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${
              tipo === 'eliminar' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
            }`}>
              <FiAlertCircle size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-800 mb-2">{titulo}</h2>
              <p className="text-gray-600">{mensaje}</p>
            </div>
          </div>
        </div>
        <div className="border-t p-6 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-3 text-white rounded-lg transition-colors font-medium ${
              tipo === 'eliminar' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {tipo === 'eliminar' ? 'Eliminar' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};