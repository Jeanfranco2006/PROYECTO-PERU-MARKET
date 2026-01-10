import { useState, type ChangeEvent, type FormEvent } from "react";
import { api } from "../../services/api";
import { FiTruck, FiBox, FiActivity, FiX, FiSave, FiTag } from "react-icons/fi";

export default function VehiculoModal({ onSaved }: { onSaved?: () => void }) {
  const [showModalVehiculo, setShowModalVehiculo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [vehiculoForm, setVehiculoForm] = useState({
    placa: '',
    marca: '',
    modelo: '',
    capacidadKg: '',
    estado: 'DISPONIBLE'
  });

  const handleVehiculoChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSubmitVehiculo = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/vehiculos', vehiculoForm);
      setVehiculoForm({ placa: '', marca: '', modelo: '', capacidadKg: '', estado: 'DISPONIBLE' });
      setShowModalVehiculo(false);
      onSaved?.(); 
    } catch (err) {
      console.error(err);
      alert("Error al registrar el vehículo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* BOTÓN PRINCIPAL */}
      <button 
        onClick={() => setShowModalVehiculo(true)} 
        className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-300 active:scale-95"
      >
        <FiTruck className="text-xl group-hover:rotate-12 transition-transform" />
        <span>Nuevo Vehículo</span>
      </button>

      {/* MODAL OVERLAY */}
      {showModalVehiculo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
          
          {/* CARD PRINCIPAL */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-fade-in-up">
            
            {/* HEADER CON GRADIENTE */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6 overflow-hidden">
              
              {/* ✅ CORRECCIÓN 1: z-10 para asegurar que el botón esté encima de la decoración */}
              <div className="relative z-10 flex justify-between items-start text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FiTruck size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Registrar Vehículo</h2>
                    <p className="text-blue-100 text-xs mt-0.5">Ingresa los detalles de la unidad</p>
                  </div>
                </div>
                
                {/* Botón Cerrar */}
                <button 
                  onClick={() => setShowModalVehiculo(false)} 
                  className="p-1 text-blue-100 hover:text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              {/* ✅ CORRECCIÓN 2: pointer-events-none para que los clics traspasen la decoración */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* FORMULARIO */}
            <form onSubmit={handleSubmitVehiculo} className="p-6 md:p-8 space-y-6">
              
              {/* Input: Placa */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">
                  Placa del Vehículo
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiTag className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    name="placa" 
                    value={vehiculoForm.placa} 
                    onChange={handleVehiculoChange} 
                    placeholder="Ej. ABC-123" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-gray-700 placeholder-gray-400"
                    required 
                  />
                </div>
              </div>

              {/* Grid: Marca y Modelo */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">Marca</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      name="marca" 
                      value={vehiculoForm.marca} 
                      onChange={handleVehiculoChange} 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                      placeholder="Ej. Toyota"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">Modelo</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      name="modelo" 
                      value={vehiculoForm.modelo} 
                      onChange={handleVehiculoChange} 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                      placeholder="Ej. Hilux"
                    />
                  </div>
                </div>
              </div>

              {/* Grid: Capacidad y Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">Capacidad</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiBox className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type="number" 
                      step="0.01" 
                      name="capacidadKg" 
                      value={vehiculoForm.capacidadKg} 
                      onChange={handleVehiculoChange} 
                      className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                      placeholder="0.00"
                    />
                    <span className="absolute inset-y-0 right-4 flex items-center text-gray-400 text-xs font-bold">KG</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">Estado</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiActivity className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <select 
                      name="estado" 
                      value={vehiculoForm.estado} 
                      onChange={handleVehiculoChange} 
                      className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-sm font-medium text-gray-700"
                    >
                      <option value="DISPONIBLE">DISPONIBLE</option>
                      <option value="EN_RUTA">EN RUTA</option>
                      <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                      <option value="INACTIVO">INACTIVO</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowModalVehiculo(false)} 
                  className="px-6 py-3 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-colors focus:ring-2 focus:ring-gray-200"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="text-lg" />
                      <span>Guardar Vehículo</span>
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