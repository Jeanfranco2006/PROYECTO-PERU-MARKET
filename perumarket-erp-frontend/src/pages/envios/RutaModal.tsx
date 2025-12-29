import { useState, type ChangeEvent, type FormEvent } from "react";
import { RutaService } from "../../services/envios/rutaService";


interface Props {
  onSaved?: () => void;
}

export default function RutaModal({ onSaved }: Props) {
  const [show, setShow] = useState(false);
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
      alert("Ocurrió un error al crear la ruta.");
    }
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
      >
        + Nueva Ruta
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">Registrar Ruta</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="nombre" placeholder="Nombre de la ruta" value={form.nombre} onChange={handleChange} className="input" required />
              <input name="origen" placeholder="Origen" value={form.origen} onChange={handleChange} className="input" required />
              <input name="destino" placeholder="Destino" value={form.destino} onChange={handleChange} className="input" required />
              <input type="number" name="distancia_km" placeholder="Distancia (km)" value={form.distancia_km ?? ""} onChange={handleChange} className="input" />
              <input type="number" step="0.01" name="tiempo_estimado_horas" placeholder="Tiempo estimado (horas)" value={form.tiempo_estimado_horas ?? ""} onChange={handleChange} className="input" />
              <input type="number" step="0.01" name="costo_base" placeholder="Costo base" value={form.costo_base ?? ""} onChange={handleChange} className="input" />

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShow(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

