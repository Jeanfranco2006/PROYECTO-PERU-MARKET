import React, { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import {
  FiPlus, FiEdit, FiTrash2, FiEye, FiTruck, FiMap, FiUser, FiPackage, FiSearch, FiX
} from "react-icons/fi";
import type { Envio, CrearEnvioDTO, FormDataEnvio } from "../../types/envios/envio";
import { enviosService } from "../../services/envios/envioServices";
import { api } from "../../services/api";


export default function Envios() {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [envioSeleccionado, setEnvioSeleccionado] = useState<Envio | null>(null);

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  // Combos
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [conductores, setConductores] = useState<any[]>([]);
  const [rutas, setRutas] = useState<any[]>([]);

  // Formulario
  const [formData, setFormData] = useState<FormDataEnvio>({
    idVenta: 0,       // antes: idPedido
    idCliente: undefined,
    productos: [],
    estado: "PENDIENTE",
    fechaRegistro: "", // antes: fechaEnvio
    observaciones: "",
    idVehiculo: 0,
    idConductor: 0,
    idRuta: 0,
    direccionEnvio: "",
    fechaEntrega: "",
    costoTransporte: 0
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ["idVenta", "idVehiculo", "idConductor", "idRuta"].includes(name)
        ? Number(value)
        : name === "costoTransporte"
          ? parseFloat(value)
          : value
    }));
  };

  const handleEditar = (envio: Envio) => {
    setEnvioSeleccionado(envio);
    setFormData({
      idVenta: envio.pedido.id,
      idCliente: envio.pedido.idCliente,
      idVehiculo: envio.vehiculo?.id || 0,
      idConductor: envio.conductor?.id || 0,
      idRuta: envio.ruta?.id || 0,
      direccionEnvio: envio.direccionEnvio,
      fechaRegistro: envio.fechaEnvio || "",
      fechaEntrega: envio.fechaEntrega || "",
      costoTransporte: envio.costoTransporte || 0,
      estado: envio.estado,
      observaciones: envio.observaciones || "",
      productos: [] // opcional si quieres mostrar productos
    });
    setShowModal(true);
  };
  const cargarEnvios = async () => {
    try {
      const data = await enviosService.listar();
      setEnvios(data); // ahora seguro que es array
    } catch (error) {
      console.error("Error cargando envíos", error);
      setEnvios([]); // fallback
    }
  };


  const cargarCombos = async () => {
    try {
      const [pedidosRes, vehiculosRes, conductoresRes, rutasRes] = await Promise.all([
        enviosService.listarPedidosPendientes(), // <-- ahora traes solo pedidos pendientes
        api.get("/vehiculos"),
        api.get("/conductores"),
        api.get("/rutas")
      ]);

      setPedidos(pedidosRes || []);
      setVehiculos(vehiculosRes.data || []);
      setConductores(conductoresRes.data || []);
      setRutas(rutasRes.data || []);
    } catch (error) {
      console.error("Error cargando combos", error);
      setPedidos([]);
      setVehiculos([]);
      setConductores([]);
      setRutas([]);
    }
  };



  useEffect(() => {
    cargarEnvios();
    cargarCombos();
  }, []);

  const resetForm = () => {
    setFormData({
      idVenta: 0,
      idCliente: undefined,
      productos: [],
      estado: "PENDIENTE",
      fechaRegistro: "",
      observaciones: "",
      idVehiculo: 0,
      idConductor: 0,
      idRuta: 0,
      direccionEnvio: "",
      fechaEntrega: "",
      costoTransporte: 0
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (envioSeleccionado) {
        await enviosService.actualizar(envioSeleccionado.id, formData);
      } else {
        await enviosService.crear(formData);
      }
      cargarEnvios();
      resetForm();
      setShowModal(false);
      setEnvioSeleccionado(null);
    } catch (error) {
      console.error("Error guardando envío", error);
    }
  };

  const handleVerDetalles = (envio: Envio) => {
    setEnvioSeleccionado(envio);
    setShowDetailModal(true);
  };

  const handleEliminar = (envio: Envio) => {
    setEnvioSeleccionado(envio);
    setShowDeleteModal(true);
  };

  const confirmarEliminar = async () => {
    if (!envioSeleccionado) return;
    await enviosService.eliminar(envioSeleccionado.id);
    cargarEnvios();
    setShowDeleteModal(false);
    setEnvioSeleccionado(null);
  };

  const estadoColor = (estado: Envio["estado"]) => {
    switch (estado) {
      case "ENTREGADO": return "bg-green-100 text-green-800";
      case "EN_RUTA": return "bg-blue-100 text-blue-800";
      case "PENDIENTE": return "bg-yellow-100 text-yellow-800";
      case "CANCELADO": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const cambiarEstado = async (id: number, estado: Envio["estado"]) => {
    try {
      await enviosService.actualizar(id, { estado });
      cargarEnvios();
    } catch (error) {
      console.error("Error cambiando estado", error);
    }
  };

  const enviosFiltrados = envios.filter((envio) => {
    const search = searchTerm.toLowerCase();
    const matchSearch =
      envio.pedido.id.toString().includes(search) ||
      envio.direccionEnvio.toLowerCase().includes(search) ||
      envio.ruta?.nombre?.toLowerCase().includes(search);
    const matchEstado = !filterEstado || envio.estado === filterEstado;
    return matchSearch && matchEstado;
  });

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

      {/* Tabla desktop y móvil + modales */}
      {/* Esta parte sigue igual que tu versión, ya lista para usar */}
      {/* Tabla de envíos */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Vista Desktop */}
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
                  <td className="p-3 font-medium">{envio.pedido.id}</td>
                  <td className="p-3">{envio.pedido.idCliente}</td>
                  <td className="p-3">{envio.vehiculo?.marca} {envio.vehiculo?.modelo}</td>
                  <td className="p-3">{envio.conductor?.nombre}</td>
                  <td className="p-3">{envio.ruta?.nombre}</td>
                  <td className="p-3 max-w-xs truncate">{envio.direccionEnvio}</td>
                  <td className="p-3">
                    <div className="text-xs">
                      <div>Envío: {envio.fechaEnvio}</div>
                      {envio.fechaEntrega && <div>Entrega: {envio.fechaEntrega}</div>}
                    </div>
                  </td>
                  <td className="p-3">S/ {envio.costoTransporte}</td>
                  <td className="p-3">
                    <select
                      value={envio.estado}
                      onChange={(e) => cambiarEstado(envio.id, e.target.value as Envio["estado"])}
                      className={`px-2 py-1 rounded-full text-xs border-0 focus:ring-2 focus:ring-blue-500 ${estadoColor(envio.estado)}`}
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="EN_RUTA">EN RUTA</option>
                      <option value="ENTREGADO">ENTREGADO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => handleVerDetalles(envio)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        <FiEye size={16} />
                      </button>
                      <button onClick={() => handleEditar(envio)} className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                        <FiEdit size={16} />
                      </button>
                      <button onClick={() => handleEliminar(envio)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
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
                    <p className="font-semibold text-lg">Pedido: {envio.pedido.id}</p>
                    <p className="text-gray-600">Cliente: {envio.pedido.idCliente}</p>
                  </div>
                  <select
                    value={envio.estado}
                    onChange={(e) => cambiarEstado(envio.id, e.target.value as Envio["estado"])}
                    className={`px-2 py-1 rounded-full text-xs border-0 focus:ring-2 focus:ring-blue-500 ${estadoColor(envio.estado)}`}
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
                    <p className="font-medium">{envio.vehiculo?.marca} {envio.vehiculo?.modelo}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Conductor</p>
                    <p className="font-medium">{envio.conductor?.nombre}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500">Dirección</p>
                  <p className="font-medium text-sm">{envio.direccionEnvio}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Fecha Envío</p>
                    <p className="font-medium">{envio.fechaEnvio}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Costo</p>
                    <p className="font-medium">S/ {envio.costoTransporte}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => handleVerDetalles(envio)} className="flex-1 flex items-center justify-center gap-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition-colors">
                    <FiEye size={14} /> Ver
                  </button>
                  <button onClick={() => handleEditar(envio)} className="flex-1 flex items-center justify-center gap-1 p-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm transition-colors">
                    <FiEdit size={14} /> Editar
                  </button>
                  <button onClick={() => handleEliminar(envio)} className="flex-1 flex items-center justify-center gap-1 p-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition-colors">
                    <FiTrash2 size={14} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{envioSeleccionado ? 'Editar Envío' : 'Crear Nuevo Envío'}</h2>
              <button onClick={() => { setShowModal(false); setEnvioSeleccionado(null); resetForm(); }} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Columna 1: Pedido, Vehículo, Conductor, Ruta */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pedido *</label>
                  <select
                    name="idVenta"
                    value={formData.idVenta}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar pedido</option>
                    {pedidos.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.codigo} - {p.nombreCliente} (S/ {p.total})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehículo *</label>
                  <select name="idVehiculo" value={formData.idVehiculo} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                    <option value="">Seleccionar vehículo</option>
                    {vehiculos.map(v => <option key={v.id} value={v.id}>{v.placa} - {v.marca} {v.modelo}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conductor *</label>
                  <select name="idConductor" value={formData.idConductor} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                    <option value="">Seleccionar conductor</option>
                    {conductores.map(c => <option key={c.id} value={c.id}>{c.persona?.nombre} - {c.licencia}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ruta</label>
                  <select name="idRuta" value={formData.idRuta} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Seleccionar ruta</option>
                    {rutas.map(r => <option key={r.id} value={r.id}>{r.nombre} - S/ {r.costo}</option>)}
                  </select>
                </div>
              </div>

              {/* Columna 2: Dirección, Fechas, Costo, Estado, Observaciones */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dirección de Envío *</label>
                  <input type="text" name="direccionEnvio" value={formData.direccionEnvio} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Envío *</label>
                    <input type="date" name="fecharRegistro" value={formData.fechaRegistro} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Entrega</label>
                    <input type="date" name="fechaEntrega" value={formData.fechaEntrega} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Costo de Transporte (S/)</label>
                  <input type="number" step="0.01" name="costoTransporte" value={formData.costoTransporte} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select name="estado" value={formData.estado} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="EN_RUTA">EN RUTA</option>
                    <option value="ENTREGADO">ENTREGADO</option>
                    <option value="CANCELADO">CANCELADO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                  <textarea name="observaciones" value={formData.observaciones} onChange={handleInputChange} rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Observaciones adicionales..." />
                </div>
              </div>

              <div className="col-span-2 flex gap-3 justify-end">
                <button type="button" onClick={() => { setShowModal(false); setEnvioSeleccionado(null); resetForm(); }} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">{envioSeleccionado ? 'Actualizar Envío' : 'Crear Envío'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalles */}
      {showDetailModal && envioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Detalles del Envío</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4 grid grid-cols-2 gap-4">
              <div><p className="text-gray-600 text-sm">Pedido</p><p className="font-semibold">{envioSeleccionado.pedido.id}</p></div>
              <div><p className="text-gray-600 text-sm">Cliente</p><p className="font-semibold">{envioSeleccionado.pedido.idCliente}</p></div>
              <div><p className="text-gray-600 text-sm">Vehículo</p><p className="font-semibold">{envioSeleccionado.vehiculo?.marca} {envioSeleccionado.vehiculo?.modelo}</p></div>
              <div><p className="text-gray-600 text-sm">Conductor</p><p className="font-semibold">{envioSeleccionado.conductor?.nombre}</p></div>
              <div><p className="text-gray-600 text-sm">Ruta</p><p className="font-semibold">{envioSeleccionado.ruta?.nombre}</p></div>
              <div><p className="text-gray-600 text-sm">Estado</p><span className={`px-2 py-1 rounded-full text-xs ${estadoColor(envioSeleccionado.estado)}`}>{envioSeleccionado.estado.replace('_', ' ')}</span></div>
              <div><p className="text-gray-600 text-sm">Fecha Envío</p><p className="font-semibold">{envioSeleccionado.fechaEnvio}</p></div>
              <div><p className="text-gray-600 text-sm">Fecha Entrega</p><p className="font-semibold">{envioSeleccionado.fechaEntrega || 'Pendiente'}</p></div>
              <div className="col-span-2"><p className="text-gray-600 text-sm">Dirección</p><p className="font-semibold">{envioSeleccionado.direccionEnvio}</p></div>
              <div><p className="text-gray-600 text-sm">Costo</p><p className="font-semibold">S/ {envioSeleccionado.costoTransporte}</p></div>
              {envioSeleccionado.observaciones && <div className="col-span-2"><p className="text-gray-600 text-sm">Observaciones</p><p className="font-semibold">{envioSeleccionado.observaciones}</p></div>}
            </div>
            <div className="p-6 border-t flex justify-end">
              <button onClick={() => setShowDetailModal(false)} className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {showDeleteModal && envioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Confirmar Eliminación</h2>
            </div>
            <div className="p-6">
              <p>¿Estás seguro de eliminar el envío <span className="font-semibold">{envioSeleccionado.pedido.id}</span>?</p>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={confirmarEliminar} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
