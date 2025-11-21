import { FiX } from "react-icons/fi";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ModalCrearUsuario({ open, onClose }: Props) {
  if (!open) return null;

  const [form, setForm] = useState({
    tipo_documento: "DNI",
    numero_documento: "",
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    telefono: "",
    fecha_nacimiento: "",
    direccion: "",

    username: "",
    password: "",
    rol: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Datos a enviar al backend:", form);

    // Aquí más adelante usarás fetch/axios
    // await axios.post("/api/usuarios", form)

    onClose(); // cerrar modal
  };

  return (
<div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">

      <div className="bg-white w-full max-w-3xl rounded shadow-lg p-6 animate-fadeIn relative">

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-black"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">Crear Usuario</h2>

        {/* FORMULARIO */}
        <div className="grid grid-cols-2 gap-4">

          {/* Persona */}
          <h3 className="col-span-2 text-lg font-semibold mt-2 mb-1">Datos de Persona</h3>

          <select
            name="tipo_documento"
            value={form.tipo_documento}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="DNI">DNI</option>
            <option value="RUC">RUC</option>
            <option value="PASAPORTE">Pasaporte</option>
            <option value="OTRO">Otro</option>
          </select>

          <input
            name="numero_documento"
            placeholder="Número de documento"
            className="border p-2 rounded"
            value={form.numero_documento}
            onChange={handleChange}
          />

          <input
            name="nombres"
            placeholder="Nombres"
            className="border p-2 rounded"
            value={form.nombres}
            onChange={handleChange}
          />

          <input
            name="apellido_paterno"
            placeholder="Apellido paterno"
            className="border p-2 rounded"
            value={form.apellido_paterno}
            onChange={handleChange}
          />

          <input
            name="apellido_materno"
            placeholder="Apellido materno"
            className="border p-2 rounded"
            value={form.apellido_materno}
            onChange={handleChange}
          />

          <input
            name="correo"
            placeholder="Correo"
            className="border p-2 rounded"
            value={form.correo}
            onChange={handleChange}
          />

          <input
            name="telefono"
            placeholder="Teléfono"
            className="border p-2 rounded"
            value={form.telefono}
            onChange={handleChange}
          />

          <input
            type="date"
            name="fecha_nacimiento"
            className="border p-2 rounded"
            value={form.fecha_nacimiento}
            onChange={handleChange}
          />

          <input
            name="direccion"
            placeholder="Dirección"
            className="border p-2 rounded col-span-2"
            value={form.direccion}
            onChange={handleChange}
          />

          {/* USUARIO */}
          <h3 className="col-span-2 text-lg font-semibold mt-2 mb-1">Datos de Usuario</h3>

          <input
            name="username"
            placeholder="Nombre de usuario"
            className="border p-2 rounded"
            value={form.username}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="border p-2 rounded"
            value={form.password}
            onChange={handleChange}
          />

          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          >
            <option value="">Seleccione un rol</option>
            <option value="1">Administrador</option>
            <option value="2">Vendedor</option>
            <option value="3">Compras</option>
            <option value="4">Almacén</option>
            <option value="5">Contador</option>
          </select>
        </div>

        {/* Botón guardar */}
        <div className="mt-6 text-right">
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900"
          >
            Guardar Usuario
          </button>
        </div>

      </div>
    </div>
  );
}
