import { useState, type ChangeEvent, type FormEvent } from "react";
import { RutaService } from "../../services/envios/rutaService";

interface Props {
  onSaved?: () => void;
}

export default function RutaModal({ onSaved }: Props) {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    origen: "",
    destino: "",
    distancia_km: "",
    tiempo_estimado_horas: "",
    costo_base: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
      setForm({ nombre: "", origen: "", destino: "", distancia_km: "", tiempo_estimado_horas: "", costo_base: "" });
      onSaved?.();
    } catch (error) {
      console.error("Error creando ruta:", error);
      alert("Ocurrió un error al crear la ruta."); // Podrías cambiar esto por un toast notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* BOTÓN: Color Yellow/Amber para coincidir con la imagen (+ Nueva Ruta) */}
      <button
        onClick={() => setShow(true)}
        className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        Nueva Ruta
      </button>

      {/* MODAL */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Registrar Ruta</h2>
              <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Nombre de la Ruta */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre de la Ruta</label>
                <input 
                  name="nombre" 
                  placeholder="Ej. Ruta Norte Express" 
                  value={form.nombre} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all placeholder-gray-400" 
                  required 
                />
              </div>

              {/* Grid: Origen y Destino */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Origen</label>
                  <div className="relative">
                    <input 
                        name="origen" 
                        placeholder="Ciudad A" 
                        value={form.origen} 
                        onChange={handleChange} 
                        className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all" 
                        required 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Destino</label>
                  <input 
                    name="destino" 
                    placeholder="Ciudad B" 
                    value={form.destino} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all" 
                    required 
                  />
                </div>
              </div>

              {/* Grid: Métricas (3 columnas) */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Distancia (km)</label>
                  <input 
                    type="number" 
                    name="distancia_km" 
                    placeholder="0" 
                    value={form.distancia_km ?? ""} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tiempo (h)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="tiempo_estimado_horas" 
                    placeholder="0.0" 
                    value={form.tiempo_estimado_horas ?? ""} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Costo Base</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 text-sm">S/</span>
                    <input 
                        type="number" 
                        step="0.01" 
                        name="costo_base" 
                        placeholder="0.00" 
                        value={form.costo_base ?? ""} 
                        onChange={handleChange} 
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                <button 
                  type="button" 
                  onClick={() => setShow(false)} 
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:ring-4 focus:ring-yellow-200 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : 'Guardar Ruta'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}