import React, { useState } from "react";
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiTruck, 
  FiMap, 
  FiUser, 
  FiPackage,
  FiSearch,
  FiCheck,
  FiX
} from "react-icons/fi";

interface Envio {
  id: number;
  pedido: string;
  cliente: string;
  vehiculo: string;
  conductor: string;
  ruta: string;
  direccion: string;
  fecha_envio: string;
  fecha_entrega: string;
  costo: string;
  estado: string;
  estadoColor: string;
  observaciones?: string;
}

export default function Envios() {
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [envioSeleccionado, setEnvioSeleccionado] = useState<Envio | null>(null);
  const [envios, setEnvios] = useState<Envio[]>([
    {
      id: 1,
      pedido: "PED-001",
      cliente: "Juan Pérez",
      vehiculo: "ABC-123 (Toyota Hilux)",
      conductor: "Carlos López",
      ruta: "Lima - Callao",
      direccion: "Av. Lima 123, Callao",
      fecha_envio: "2024-01-15",
      fecha_entrega: "2024-01-16",
      costo: "45.00",
      estado: "ENTREGADO",
      estadoColor: "bg-green-100 text-green-800",
      observaciones: "Entregado sin inconvenientes"
    },
    {
      id: 2,
      pedido: "PED-002",
      cliente: "María García",
      vehiculo: "DEF-456 (Nissan NP300)",
      conductor: "Roberto Silva",
      ruta: "Lima - Miraflores",
      direccion: "Av. Larco 456, Miraflores",
      fecha_envio: "2024-01-16",
      fecha_entrega: "",
      costo: "35.00",
      estado: "EN_RUTA",
      estadoColor: "bg-blue-100 text-blue-800",
      observaciones: "En camino al destino"
    },
    {
      id: 3,
      pedido: "PED-003",
      cliente: "Luis Rodríguez",
      vehiculo: "GHI-789 (Hyundai Porter)",
      conductor: "Miguel Ángel",
      ruta: "Lima - Surco",
      direccion: "Av. Caminos del Inca 789, Surco",
      fecha_envio: "2024-01-17",
      fecha_entrega: "",
      costo: "28.00",
      estado: "PENDIENTE",
      estadoColor: "bg-yellow-100 text-yellow-800",
      observaciones: "Esperando asignación de conductor"
    }
  ]);

  const [formData, setFormData] = useState({
    id_pedido: "",
    id_vehiculo: "",
    id_conductor: "",
    id_ruta: "",
    direccion_envio: "",
    fecha_envio: "",
    fecha_entrega: "",
    costo_transporte: "",
    estado: "PENDIENTE",
    observaciones: ""
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const pedidos = [
    { id: 1, codigo: "PED-001", cliente: "Juan Pérez", total: "250.00" },
    { id: 2, codigo: "PED-002", cliente: "María García", total: "180.00" },
    { id: 3, codigo: "PED-003", cliente: "Luis Rodríguez", total: "320.00" }
  ];

  const vehiculos = [
    { id: 1, placa: "ABC-123", marca: "Toyota", modelo: "Hilux", capacidad: "1000", estado: "DISPONIBLE" },
    { id: 2, placa: "DEF-456", marca: "Nissan", modelo: "NP300", capacidad: "800", estado: "DISPONIBLE" },
    { id: 3, placa: "GHI-789", marca: "Hyundai", modelo: "Porter", capacidad: "600", estado: "DISPONIBLE" }
  ];

  const conductores = [
    { id: 1, nombre: "Carlos López", licencia: "A12345678", categoria: "A-III" },
    { id: 2, nombre: "Roberto Silva", licencia: "B87654321", categoria: "A-II" },
    { id: 3, nombre: "Miguel Ángel", licencia: "C11223344", categoria: "A-III" }
  ];

  const rutas = [
    { id: 1, nombre: "Lima - Callao", origen: "Lima", destino: "Callao", distancia: "15", tiempo: "0.5", costo: "25.00" },
    { id: 2, nombre: "Lima - Miraflores", origen: "Lima", destino: "Miraflores", distancia: "10", tiempo: "0.4", costo: "20.00" },
    { id: 3, nombre: "Lima - Surco", origen: "Lima", destino: "Surco", distancia: "12", tiempo: "0.6", costo: "22.00" }
  ];

  // Filtrar envíos
  const enviosFiltrados = envios.filter(envio => {
    const matchesSearch = envio.pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         envio.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         envio.direccion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !filterEstado || envio.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nuevoEnvio: Envio = {
      id: envios.length + 1,
      pedido: pedidos.find(p => p.id === parseInt(formData.id_pedido))?.codigo || "PED-NUEVO",
      cliente: pedidos.find(p => p.id === parseInt(formData.id_pedido))?.cliente || "Cliente",
      vehiculo: vehiculos.find(v => v.id === parseInt(formData.id_vehiculo))?.placa || "Vehículo",
      conductor: conductores.find(c => c.id === parseInt(formData.id_conductor))?.nombre || "Conductor",
      ruta: rutas.find(r => r.id === parseInt(formData.id_ruta))?.nombre || "Ruta",
      direccion: formData.direccion_envio,
      fecha_envio: formData.fecha_envio,
      fecha_entrega: formData.fecha_entrega,
      costo: formData.costo_transporte,
      estado: formData.estado,
      estadoColor: getEstadoColor(formData.estado),
      observaciones: formData.observaciones
    };

    setEnvios(prev => [...prev, nuevoEnvio]);
    setShowModal(false);
    resetForm();
  };

  const getEstadoColor = (estado: string) => {
    switch(estado) {
      case 'ENTREGADO': return 'bg-green-100 text-green-800';
      case 'EN_RUTA': return 'bg-blue-100 text-blue-800';
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const resetForm = () => {
    setFormData({
      id_pedido: "",
      id_vehiculo: "",
      id_conductor: "",
      id_ruta: "",
      direccion_envio: "",
      fecha_envio: "",
      fecha_entrega: "",
      costo_transporte: "",
      estado: "PENDIENTE",
      observaciones: ""
    });
  };

  // Acciones
  const handleVerDetalles = (envio: Envio) => {
    setEnvioSeleccionado(envio);
    setShowDetailModal(true);
  };

  const handleEditar = (envio: Envio) => {
    setEnvioSeleccionado(envio);
    // Aquí podrías cargar los datos en el formulario para editar
    setShowModal(true);
  };

  const handleEliminar = (envio: Envio) => {
    setEnvioSeleccionado(envio);
    setShowDeleteModal(true);
  };

  const confirmarEliminar = () => {
    if (envioSeleccionado) {
      setEnvios(prev => prev.filter(envio => envio.id !== envioSeleccionado.id));
      setShowDeleteModal(false);
      setEnvioSeleccionado(null);
    }
  };

  const cambiarEstado = (envioId: number, nuevoEstado: string) => {
    setEnvios(prev => prev.map(envio => 
      envio.id === envioId 
        ? { ...envio, estado: nuevoEstado, estadoColor: getEstadoColor(nuevoEstado) }
        : envio
    ));
  };

  return (
    <div className="w-full p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">GESTIÓN DE ENVÍOS</h1>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiPackage className="text-blue-700 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-600 text-sm">Total Envíos</h3>
              <p className="text-2xl font-bold">{envios.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <FiTruck className="text-green-700 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-600 text-sm">En Ruta</h3>
              <p className="text-2xl font-bold">{envios.filter(e => e.estado === 'EN_RUTA').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FiMap className="text-yellow-700 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-600 text-sm">Pendientes</h3>
              <p className="text-2xl font-bold">{envios.filter(e => e.estado === 'PENDIENTE').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <FiUser className="text-red-700 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-600 text-sm">Entregados</h3>
              <p className="text-2xl font-bold">{envios.filter(e => e.estado === 'ENTREGADO').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de acciones */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-black text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-gray-800 w-full sm:w-auto justify-center"
        >
          <FiPlus />
          CREAR ENVÍO
        </button>

        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por pedido, cliente o dirección..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="w-full sm:w-48 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_RUTA">En Ruta</option>
            <option value="ENTREGADO">Entregado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Tabla de envíos */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Vista desktop */}
        <div className="hidden lg:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Pedido</th>
                <th className="p-3 text-left">Cliente</th>
                <th className="p-3 text-left">Vehículo</th>
                <th className="p-3 text-left">Conductor</th>
                <th className="p-3 text-left">Ruta</th>
                <th className="p-3 text-left">Dirección</th>
                <th className="p-3 text-left">Fechas</th>
                <th className="p-3 text-left">Costo</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {enviosFiltrados.map((envio) => (
                <tr key={envio.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{envio.pedido}</td>
                  <td className="p-3">{envio.cliente}</td>
                  <td className="p-3">{envio.vehiculo}</td>
                  <td className="p-3">{envio.conductor}</td>
                  <td className="p-3">{envio.ruta}</td>
                  <td className="p-3 max-w-xs truncate">{envio.direccion}</td>
                  <td className="p-3">
                    <div className="text-xs">
                      <div>Envío: {envio.fecha_envio}</div>
                      {envio.fecha_entrega && <div>Entrega: {envio.fecha_entrega}</div>}
                    </div>
                  </td>
                  <td className="p-3">S/ {envio.costo}</td>
                  <td className="p-3">
                    <select
                      value={envio.estado}
                      onChange={(e) => cambiarEstado(envio.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs border-0 focus:ring-2 focus:ring-blue-500 ${envio.estadoColor}`}
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="EN_RUTA">EN RUTA</option>
                      <option value="ENTREGADO">ENTREGADO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      <button 
                        onClick={() => handleVerDetalles(envio)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <FiEye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditar(envio)}
                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button 
                        onClick={() => handleEliminar(envio)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista móvil */}
        <div className="lg:hidden p-4 space-y-4">
          {enviosFiltrados.map((envio) => (
            <div key={envio.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">{envio.pedido}</p>
                    <p className="text-gray-600">{envio.cliente}</p>
                  </div>
                  <select
                    value={envio.estado}
                    onChange={(e) => cambiarEstado(envio.id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs border-0 focus:ring-2 focus:ring-blue-500 ${envio.estadoColor}`}
                  >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="EN_RUTA">EN RUTA</option>
                    <option value="ENTREGADO">ENTREGADO</option>
                    <option value="CANCELADO">CANCELADO</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Vehículo</p>
                    <p className="font-medium">{envio.vehiculo}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Conductor</p>
                    <p className="font-medium">{envio.conductor}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500">Dirección</p>
                  <p className="font-medium text-sm">{envio.direccion}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Fecha Envío</p>
                    <p className="font-medium">{envio.fecha_envio}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Costo</p>
                    <p className="font-medium">S/ {envio.costo}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => handleVerDetalles(envio)}
                    className="flex-1 flex items-center justify-center gap-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition-colors"
                  >
                    <FiEye size={14} /> Ver
                  </button>
                  <button 
                    onClick={() => handleEditar(envio)}
                    className="flex-1 flex items-center justify-center gap-1 p-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm transition-colors"
                  >
                    <FiEdit size={14} /> Editar
                  </button>
                  <button 
                    onClick={() => handleEliminar(envio)}
                    className="flex-1 flex items-center justify-center gap-1 p-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition-colors"
                  >
                    <FiTrash2 size={14} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para crear/editar envío */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {envioSeleccionado ? 'Editar Envío' : 'Crear Nuevo Envío'}
              </h2>
              <button onClick={() => { setShowModal(false); setEnvioSeleccionado(null); }} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Columna 1 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pedido *
                    </label>
                    <select
                      name="id_pedido"
                      value={formData.id_pedido}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar pedido</option>
                      {pedidos.map(pedido => (
                        <option key={pedido.id} value={pedido.id}>
                          {pedido.codigo} - {pedido.cliente} (S/ {pedido.total})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehículo *
                    </label>
                    <select
                      name="id_vehiculo"
                      value={formData.id_vehiculo}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar vehículo</option>
                      {vehiculos.map(vehiculo => (
                        <option key={vehiculo.id} value={vehiculo.id}>
                          {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo} ({vehiculo.capacidad}kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conductor *
                    </label>
                    <select
                      name="id_conductor"
                      value={formData.id_conductor}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar conductor</option>
                      {conductores.map(conductor => (
                        <option key={conductor.id} value={conductor.id}>
                          {conductor.nombre} - {conductor.licencia}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ruta
                    </label>
                    <select
                      name="id_ruta"
                      value={formData.id_ruta}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar ruta</option>
                      {rutas.map(ruta => (
                        <option key={ruta.id} value={ruta.id}>
                          {ruta.nombre} - S/ {ruta.costo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Columna 2 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección de Envío *
                    </label>
                    <input
                      type="text"
                      name="direccion_envio"
                      value={formData.direccion_envio}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ingrese la dirección completa"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Envío *
                      </label>
                      <input
                        type="date"
                        name="fecha_envio"
                        value={formData.fecha_envio}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Entrega
                      </label>
                      <input
                        type="date"
                        name="fecha_entrega"
                        value={formData.fecha_entrega}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Costo de Transporte (S/)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="costo_transporte"
                      value={formData.costo_transporte}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="EN_RUTA">EN RUTA</option>
                      <option value="ENTREGADO">ENTREGADO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Observaciones adicionales..."
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEnvioSeleccionado(null); resetForm(); }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {envioSeleccionado ? 'Actualizar Envío' : 'Crear Envío'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {showDetailModal && envioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Detalles del Envío</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Pedido</p>
                  <p className="font-semibold">{envioSeleccionado.pedido}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Cliente</p>
                  <p className="font-semibold">{envioSeleccionado.cliente}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Vehículo</p>
                  <p className="font-semibold">{envioSeleccionado.vehiculo}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Conductor</p>
                  <p className="font-semibold">{envioSeleccionado.conductor}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Ruta</p>
                  <p className="font-semibold">{envioSeleccionado.ruta}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Estado</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${envioSeleccionado.estadoColor}`}>
                    {envioSeleccionado.estado.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Fecha Envío</p>
                  <p className="font-semibold">{envioSeleccionado.fecha_envio}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Fecha Entrega</p>
                  <p className="font-semibold">{envioSeleccionado.fecha_entrega || 'Pendiente'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600 text-sm">Dirección</p>
                  <p className="font-semibold">{envioSeleccionado.direccion}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Costo</p>
                  <p className="font-semibold">S/ {envioSeleccionado.costo}</p>
                </div>
              </div>
              
              {envioSeleccionado.observaciones && (
                <div>
                  <p className="text-gray-600 text-sm">Observaciones</p>
                  <p className="font-semibold">{envioSeleccionado.observaciones}</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && envioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Confirmar Eliminación</h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                ¿Estás seguro de que deseas eliminar el envío <strong>{envioSeleccionado.pedido}</strong>?
              </p>
              <p className="text-sm text-gray-500">
                Esta acción no se puede deshacer.
              </p>
            </div>
            
            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <FiTrash2 size={16} />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}