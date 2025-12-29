import { useState, type ChangeEvent, type FormEvent,  } from "react";
import { api } from "../../services/api";

export default function VehiculoModal({ onSaved }: { onSaved?: () => void }) {
  const [showModalVehiculo, setShowModalVehiculo] = useState(false);
  const [vehiculoForm, setVehiculoForm] = useState({
    placa: '',
    marca: '',
    modelo: '',
    capacidad_kg: '',
    estado: 'DISPONIBLE'
  });


  


  const handleVehiculoChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehiculoForm(prev => ({ ...prev, [name]: value }));
  };

const handleSubmitVehiculo = async (e: FormEvent) => {
  e.preventDefault();
  try {
    await api.post('/vehiculos', vehiculoForm);
    setShowModalVehiculo(false);
    setVehiculoForm({ placa: '', marca: '', modelo: '', capacidad_kg: '', estado: 'DISPONIBLE' });
    onSaved?.(); // 🔹 Aquí sí
  } catch (err) {
    console.error(err);
  }
};


  return (
    <>
      <button onClick={() => setShowModalVehiculo(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Nuevo Vehículo
      </button>

      {showModalVehiculo && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
            <h2 className="text-lg font-bold mb-4">Registrar Nuevo Vehículo</h2>
            <form onSubmit={handleSubmitVehiculo} className="space-y-4">
              <input type="text" placeholder="Placa" name="placa" value={vehiculoForm.placa} onChange={handleVehiculoChange} className="w-full p-3 border rounded-lg" required />
              <input type="text" placeholder="Marca" name="marca" value={vehiculoForm.marca} onChange={handleVehiculoChange} className="w-full p-3 border rounded-lg" />
              <input type="text" placeholder="Modelo" name="modelo" value={vehiculoForm.modelo} onChange={handleVehiculoChange} className="w-full p-3 border rounded-lg" />
              <input type="number" step="0.01" placeholder="Capacidad (kg)" name="capacidad_kg" value={vehiculoForm.capacidad_kg} onChange={handleVehiculoChange} className="w-full p-3 border rounded-lg" />
              <select name="estado" value={vehiculoForm.estado} onChange={handleVehiculoChange} className="w-full p-3 border rounded-lg">
                <option value="DISPONIBLE">DISPONIBLE</option>
                <option value="EN_RUTA">EN_RUTA</option>
                <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                  <option value="INACTIVO">INACTIVO</option>
              </select>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowModalVehiculo(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
