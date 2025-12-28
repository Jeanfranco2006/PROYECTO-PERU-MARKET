import { useState, type ChangeEvent, type FormEvent } from "react";
import { api } from "../../services/api";

interface Props {
  onSaved?: () => void;
}

export default function RutaModal({ onSaved }: Props) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    origen: "",
    destino: "",
    distancia_km: "",
    estado: "ACTIVA"
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await api.post("/rutas", {
      ...form,
      distancia_km: Number(form.distancia_km)
    });
    setShow(false);
    setForm({ origen: "", destino: "", distancia_km: "", estado: "ACTIVA" });
    onSaved?.();
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
              <input name="origen" placeholder="Origen" value={form.origen} onChange={handleChange} className="input" />
              <input name="destino" placeholder="Destino" value={form.destino} onChange={handleChange} className="input" />
              <input type="number" name="distancia_km" placeholder="Distancia (km)" value={form.distancia_km} onChange={handleChange} className="input" />

              <select name="estado" value={form.estado} onChange={handleChange} className="input">
                <option value="ACTIVA">ACTIVA</option>
                <option value="INACTIVA">INACTIVA</option>
              </select>

              <div className="flex justify-end gap-2 pt-4">
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
