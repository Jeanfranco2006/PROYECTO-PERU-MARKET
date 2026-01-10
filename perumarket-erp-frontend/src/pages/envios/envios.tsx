import React, { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  FiPlus, FiEdit, FiTrash2, FiEye, FiTruck, FiMap, FiUser, 
  FiPackage, FiSearch, FiX, FiBox, FiShoppingCart, FiCheck, FiCalendar
} from "react-icons/fi";
import { enviosService } from "../../services/envios/envioServices";
import { api } from "../../services/api";
import VehiculoModal from "./RegistarVehiculoModal";
import ConductorModal from "./ConductorModal";
import RutaModal from "./RutaModal";
import type { Envio, FormDataEnvio } from "../../types/envios/envio";

type EstadoEnvio = "PENDIENTE" | "EN_RUTA" | "ENTREGADO" | "CANCELADO";

export default function Envios() {
  // ========== ESTADOS ==========
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [pedidosDisponibles, setPedidosDisponibles] = useState<any[]>([]);
  const [envioSeleccionado, setEnvioSeleccionado] = useState<Envio | null>(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCrearEnvioModal, setShowCrearEnvioModal] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<EstadoEnvio | "">("");
  const [activeTab, setActiveTab] = useState<'envios' | 'pedidos'>('pedidos');
  
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [conductores, setConductores] = useState<any[]>([]);
  const [rutas, setRutas] = useState<any[]>([]);
  
  const [loading, setLoading] = useState({
    envios: false,
    pedidos: false,
    combos: false
  });

  // Estado del formulario para CREAR envío
  const [formData, setFormData] = useState<FormDataEnvio>({
    idVenta: undefined,
    idVehiculo: undefined,
    idConductor: undefined,
    idRuta: undefined,
    direccionEnvio: "",
    fechaEnvio: "",
    fechaEntrega: "",
    costoTransporte: 0,
    estado: "PENDIENTE",
    observaciones: ""
  });

  // ========== FUNCIONES PRINCIPALES ==========

  // Reiniciar formulario
  const resetForm = () => {
    setFormData({
      idVenta: undefined,
      idVehiculo: undefined,
      idConductor: undefined,
      idRuta: undefined,
      direccionEnvio: "",
      fechaEnvio: "",
      fechaEntrega: "",
      costoTransporte: 0,
      estado: "PENDIENTE",
      observaciones: ""
    });
    setPedidoSeleccionado(null);
  };

  // Cargar todos los datos
  const cargarDatos = async () => {
    try {
      setLoading(prev => ({ ...prev, envios: true, pedidos: true, combos: true }));
      
      // Cargar envíos existentes
      const enviosData = await enviosService.listar();
      setEnvios(Array.isArray(enviosData) ? enviosData : []);
      
      // Cargar pedidos disponibles para envío
      const pedidosData = await enviosService.listarPedidosDisponibles();
      setPedidosDisponibles(Array.isArray(pedidosData) ? pedidosData : []);
      
      // Cargar combos
      const [vehiculosRes, conductoresRes, rutasRes] = await Promise.all([
        api.get("/vehiculos/disponibles"),
        api.get("/conductores/disponibles"),
        api.get("/rutas")
      ]);
      
      setVehiculos(vehiculosRes.data || []);
      setConductores(conductoresRes.data || []);
      setRutas(rutasRes.data || []);
      
    } catch (error) {
      console.error("Error cargando datos:", error);
      alert("Error al cargar datos. Revisa la consola para más detalles.");
    } finally {
      setLoading(prev => ({ ...prev, envios: false, pedidos: false, combos: false }));
    }
  };

  // Iniciar creación de envío desde un pedido
  const iniciarCrearEnvio = (pedido: any) => {
    console.log("📦 Pedido seleccionado para crear envío:", pedido);
    setPedidoSeleccionado(pedido);
    setFormData(prev => ({
      ...prev,
      idVenta: pedido.idVenta || pedido.id,
      direccionEnvio: `Entrega para: ${pedido.clienteNombre || 'Cliente'}`
    }));
    setShowCrearEnvioModal(true);
  };

  // Crear nuevo envío
  const handleCrearEnvio = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.idVenta) {
      alert("❌ Error: No se pudo identificar el pedido");
      return;
    }
    
    if (!formData.idVehiculo || !formData.idConductor || !formData.direccionEnvio || !formData.fechaEnvio) {
      alert("❌ Por favor completa todos los campos requeridos (*)");
      return;
    }
    
    try {
      console.log("🚀 Creando envío con datos:", formData);
      
      const nuevoEnvio = await enviosService.crear({
        idVenta: formData.idVenta,
        idVehiculo: formData.idVehiculo,
        idConductor: formData.idConductor,
        idRuta: formData.idRuta,
        direccionEnvio: formData.direccionEnvio,
        fechaEnvio: formData.fechaEnvio,
        fechaEntrega: formData.fechaEntrega,
        costoTransporte: formData.costoTransporte,
        estado: formData.estado,
        observaciones: formData.observaciones
      });
      
      alert("✅ Envío creado correctamente");
      setShowCrearEnvioModal(false);
      resetForm();
      cargarDatos();
      
    } catch (error: any) {
      console.error("❌ Error creando envío:", error);
      alert(error.response?.data?.message || error.message || "Error al crear envío");
    }
  };

  // Editar envío existente
  const handleEditarEnvio = (envio: Envio) => {
    setEnvioSeleccionado(envio);
    setFormData({
      idVenta: envio.pedido?.id,
      idVehiculo: envio.vehiculo?.id,
      idConductor: envio.conductor?.id,
      idRuta: envio.ruta?.id,
      direccionEnvio: envio.direccionEnvio ?? "",
      fechaEnvio: envio.fechaEnvio ? envio.fechaEnvio.split('T')[0] : "",
      fechaEntrega: envio.fechaEntrega ? envio.fechaEntrega.split('T')[0] : "",
      costoTransporte: envio.costoTransporte ?? 0,
      estado: envio.estado,
      observaciones: envio.observaciones ?? ""
    });
    setShowModal(true);
  };

  // Actualizar envío existente
  const handleActualizarEnvio = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!envioSeleccionado) return;
    
    try {
      await enviosService.actualizar(envioSeleccionado.id, {
        idVehiculo: formData.idVehiculo,
        idConductor: formData.idConductor,
        idRuta: formData.idRuta,
        direccionEnvio: formData.direccionEnvio,
        fechaEnvio: formData.fechaEnvio,
        fechaEntrega: formData.fechaEntrega,
        costoTransporte: formData.costoTransporte,
        estado: formData.estado,
        observaciones: formData.observaciones
      });
      
      alert("✅ Envío actualizado correctamente");
      setShowModal(false);
      setEnvioSeleccionado(null);
      cargarDatos();
      
    } catch (error: any) {
      console.error("Error actualizando envío:", error);
      alert(error.response?.data || error.message);
    }
  };

  // Eliminar envío
  const handleEliminarEnvio = async () => {
    if (!envioSeleccionado) return;
    
    try {
      if (window.confirm(`¿Estás seguro de eliminar el envío del pedido ${envioSeleccionado.pedido?.id}?`)) {
        await enviosService.eliminar(envioSeleccionado.id);
        alert("✅ Envío eliminado correctamente");
        setShowDeleteModal(false);
        cargarDatos();
      }
    } catch (error) {
      console.error("Error eliminando envío:", error);
      alert("❌ Error al eliminar el envío");
    }
  };

  // Cambiar estado de envío
  const cambiarEstadoEnvio = async (id: number, estado: EstadoEnvio) => {
    try {
      await enviosService.actualizar(id, { estado });
      cargarDatos();
      alert("✅ Estado actualizado");
    } catch (error) {
      console.error("Error cambiando estado:", error);
      alert("❌ Error al cambiar estado");
    }
  };

  // Filtrar envíos
  const enviosFiltrados = useMemo(() => {
    return envios.filter(e => {
      const search = searchTerm.toLowerCase();
      const pedidoId = e.pedido?.id?.toString() ?? "";
      const direccion = e.direccionEnvio?.toLowerCase() ?? "";
      const cliente = e.pedido?.cliente?.nombre?.toLowerCase() ?? "";
      
      return (
        (pedidoId.includes(search) || direccion.includes(search) || cliente.includes(search)) &&
        (!filterEstado || e.estado === filterEstado)
      );
    });
  }, [envios, searchTerm, filterEstado]);

  // Filtrar pedidos disponibles
  const pedidosFiltrados = useMemo(() => {
    return pedidosDisponibles.filter(p => {
      const search = searchTerm.toLowerCase();
      const codigo = p.codigo?.toLowerCase() ?? "";
      const cliente = p.clienteNombre?.toLowerCase() ?? "";
      const dni = p.dniCliente?.toString()?.toLowerCase() ?? "";
      
      return codigo.includes(search) || cliente.includes(search) || dni.includes(search);
    });
  }, [pedidosDisponibles, searchTerm]);

  // Cargar datos al inicio
  useEffect(() => {
    cargarDatos();
  }, []);

  // ========== FUNCIONES AUXILIARES ==========
  const estadoColor = (estado: EstadoEnvio) => {
    switch (estado) {
      case "ENTREGADO": return "bg-green-100 text-green-800 border border-green-200";
      case "EN_RUTA": return "bg-blue-100 text-blue-800 border border-blue-200";
      case "PENDIENTE": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "CANCELADO": return "bg-red-100 text-red-800 border border-red-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const enviosConPedido = envios.filter(e => e.pedido != null);

  return (
    <div className="w-full p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">GESTIÓN DE ENVÍOS</h1>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <FiShoppingCart className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Pedidos Disponibles</h3>
              <p className="text-2xl font-bold text-gray-800">{pedidosDisponibles.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {pedidosDisponibles.filter(p => !p.tieneEnvio).length} sin envío
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <FiPackage className="text-green-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Total Envíos</h3>
              <p className="text-2xl font-bold text-gray-800">{envios.length}</p>
              <p className="text-xs text-gray-500 mt-1">Creados</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-50 p-3 rounded-lg">
              <FiTruck className="text-yellow-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-gray-600 text-sm font-medium">En Ruta</h3>
              <p className="text-2xl font-bold text-gray-800">{envios.filter(e => e.estado === 'EN_RUTA').length}</p>
              <p className="text-xs text-gray-500 mt-1">En camino</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-red-50 p-3 rounded-lg">
              <FiCheck className="text-red-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Entregados</h3>
              <p className="text-2xl font-bold text-gray-800">{envios.filter(e => e.estado === 'ENTREGADO').length}</p>
              <p className="text-xs text-gray-500 mt-1">Completados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pestañas */}
      <div className="flex border-b mb-6 bg-white rounded-lg shadow-sm">
        <button
          className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${activeTab === 'pedidos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('pedidos')}
        >
          <FiShoppingCart className="text-lg" />
          <span>Pedidos Disponibles</span>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeTab === 'pedidos' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
            {pedidosDisponibles.length}
          </span>
        </button>
        <button
          className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${activeTab === 'envios' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('envios')}
        >
          <FiPackage className="text-lg" />
          <span>Envíos</span>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeTab === 'envios' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
            {envios.length}
          </span>
        </button>
      </div>

      {/* Barra de búsqueda y acciones */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Buscar ${activeTab === 'pedidos' ? 'pedido, cliente o DNI...' : 'envío, cliente o dirección...'}`}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {activeTab === 'envios' && (
          <select
            className="w-full sm:w-48 px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value as "" | EstadoEnvio)}
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_RUTA">En Ruta</option>
            <option value="ENTREGADO">Entregado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        )}
        
        <div className="flex gap-2">
          <VehiculoModal onSaved={cargarDatos} />
          <ConductorModal onSaved={cargarDatos} />
          <RutaModal onSaved={cargarDatos} />
        </div>
      </div>

      {/* CONTENIDO POR PESTAÑA */}

      {/* Pestaña 1: Pedidos Disponibles */}
      {activeTab === 'pedidos' && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Pedidos disponibles para envío</h2>
            <p className="text-sm text-gray-500">Selecciona un pedido para crear un envío</p>
          </div>
          
          {loading.pedidos ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-500">Cargando pedidos disponibles...</p>
            </div>
          ) : pedidosFiltrados.length === 0 ? (
            <div className="p-12 text-center">
              <FiBox className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No hay pedidos disponibles</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Todos los pedidos ya tienen envío asignado'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Código</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Cliente</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Total</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Fecha</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Estado</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pedidosFiltrados.map((pedido) => (
                    <tr key={`pedido-${pedido.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">{pedido.codigo}</div>
                        <div className="text-xs text-gray-500">Venta #{pedido.idVenta}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{pedido.clienteNombre}</div>
                        {pedido.dniCliente && (
                          <div className="text-xs text-gray-500">DNI: {pedido.dniCliente}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-gray-900">S/ {pedido.total?.toFixed(2)}</span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="text-gray-400" />
                          {formatDate(pedido.fechaPedido)}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          pedido.tieneEnvio 
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                          {pedido.tieneEnvio ? 'Con envío pendiente' : 'Sin envío'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => iniciarCrearEnvio(pedido)}
                            disabled={pedido.tieneEnvio}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              pedido.tieneEnvio
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                            }`}
                          >
                            {pedido.tieneEnvio ? (
                              <span className="flex items-center gap-1">
                                <FiCheck /> Con Envío
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <FiPlus /> Crear Envío
                              </span>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Footer con contador */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Mostrando {pedidosFiltrados.length} de {pedidosDisponibles.length} pedidos</span>
              <span>
                {pedidosDisponibles.filter(p => !p.tieneEnvio).length} disponibles para envío
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Pestaña 2: Envíos Existentes */}
      {activeTab === 'envios' && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="hidden lg:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Pedido</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Cliente</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Vehículo</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Conductor</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Ruta</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Dirección</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Fechas</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Costo</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Estado</th>
                  <th className="p-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {enviosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-12 text-center">
                      <FiPackage className="mx-auto text-4xl text-gray-300 mb-3" />
                      <p className="text-gray-500">No hay envíos registrados</p>
                    </td>
                  </tr>
                ) : (
                  enviosFiltrados.map((envio, index) => (
                    <tr key={`envio-desktop-${index}`} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">#{envio.pedido?.id}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-900">{envio.pedido?.cliente?.nombre || 'Sin cliente'}</div>
                      </td>
                      <td className="p-4">
                        {envio.vehiculo ? (
                          <div>
                            <div className="font-medium text-gray-900">{envio.vehiculo.placa}</div>
                            <div className="text-xs text-gray-500">{envio.vehiculo.marca} {envio.vehiculo.modelo}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        {envio.conductor ? (
                          <div className="text-gray-900">{envio.conductor.nombre}</div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        {envio.ruta ? (
                          <div className="text-gray-900">{envio.ruta.nombre}</div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="text-gray-700 truncate">{envio.direccionEnvio || '-'}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-xs space-y-1">
                          <div className="text-gray-600">
                            <span className="font-medium">Env:</span> {envio.fechaEnvio ? formatDate(envio.fechaEnvio) : '-'}
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Ent:</span> {envio.fechaEntrega ? formatDate(envio.fechaEntrega) : 'Pendiente'}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-900">S/ {envio.costoTransporte || '0.00'}</span>
                      </td>
                      <td className="p-4">
                        <select
                          value={envio.estado || "PENDIENTE"}
                          onChange={(e) => envio.id && cambiarEstadoEnvio(envio.id, e.target.value as EstadoEnvio)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer ${estadoColor(envio.estado as EstadoEnvio)}`}
                        >
                          <option value="PENDIENTE">PENDIENTE</option>
                          <option value="EN_RUTA">EN RUTA</option>
                          <option value="ENTREGADO">ENTREGADO</option>
                          <option value="CANCELADO">CANCELADO</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-center">
                          <button 
                            onClick={() => {
                              setEnvioSeleccionado(envio);
                              setShowDetailModal(true);
                            }} 
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Ver detalles"
                          >
                            <FiEye size={16} />
                          </button>
                          <button 
                            onClick={() => handleEditarEnvio(envio)} 
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            title="Editar"
                          >
                            <FiEdit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Vista móvil para envíos */}
          <div className="lg:hidden p-4 space-y-4">
            {enviosFiltrados.length === 0 ? (
              <div className="text-center p-8">
                <FiPackage className="mx-auto text-4xl text-gray-300 mb-3" />
                <p className="text-gray-500">No hay envíos registrados</p>
              </div>
            ) : (
              enviosFiltrados.map((envio, index) => (
                <div key={`envio-mobile-${index}`} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900">Pedido #{envio.pedido?.id}</p>
                        <p className="text-gray-600">{envio.pedido?.cliente?.nombre}</p>
                      </div>
                      <select
                        value={envio.estado || "PENDIENTE"}
                        onChange={(e) => envio.id && cambiarEstadoEnvio(envio.id, e.target.value as EstadoEnvio)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium ${estadoColor(envio.estado as EstadoEnvio)}`}
                      >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="EN_RUTA">EN RUTA</option>
                        <option value="ENTREGADO">ENTREGADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Vehículo</p>
                        <p className="font-medium">{envio.vehiculo?.placa || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Conductor</p>
                        <p className="font-medium">{envio.conductor?.nombre || '-'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 text-xs">Dirección</p>
                      <p className="font-medium text-sm">{envio.direccionEnvio || '-'}</p>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => {
                          setEnvioSeleccionado(envio);
                          setShowDetailModal(true);
                        }} 
                        className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                      >
                        <FiEye size={14} /> Ver
                      </button>
                      <button 
                        onClick={() => handleEditarEnvio(envio)} 
                        className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                      >
                        <FiEdit size={14} /> Editar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL: Crear Envío desde Pedido */}
      {showCrearEnvioModal && pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Crear Nuevo Envío</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Para el pedido: <span className="font-semibold">{pedidoSeleccionado.codigo}</span> | 
                  Cliente: <span className="font-semibold">{pedidoSeleccionado.clienteNombre}</span>
                </p>
              </div>
              <button 
                onClick={() => { setShowCrearEnvioModal(false); resetForm(); }} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={24} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleCrearEnvio} className="p-6">
              {/* Información del Pedido */}
              <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <FiPackage className="text-blue-600" /> Información del Pedido
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Código</p>
                    <p className="font-bold text-gray-800">{pedidoSeleccionado.codigo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Cliente</p>
                    <p className="font-bold text-gray-800">{pedidoSeleccionado.clienteNombre}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Total</p>
                    <p className="font-bold text-gray-800">S/ {pedidoSeleccionado.total?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Fecha</p>
                    <p className="font-bold text-gray-800">{formatDate(pedidoSeleccionado.fechaPedido)}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna Izquierda */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehículo <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="idVehiculo"
                      value={formData.idVehiculo !== undefined ? formData.idVehiculo : ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, idVehiculo: Number(e.target.value) || undefined }))}
                      className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    >
                      <option value="">Seleccionar vehículo...</option>
                      {vehiculos.map(v => (
                        <option key={`vehiculo-${v.id}`} value={v.id}>
                          {v.placa} - {v.marca} {v.modelo} ({v.estado || 'DISPONIBLE'})
                        </option>
                      ))}
                    </select>
                    {vehiculos.length === 0 && (
                      <p className="text-xs text-red-500 mt-2">No hay vehículos disponibles</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conductor <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="idConductor"
                      value={formData.idConductor !== undefined ? formData.idConductor : ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, idConductor: Number(e.target.value) || undefined }))}
                      className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    >
                      <option value="">Seleccionar conductor...</option>
                      {conductores.map(c => (
                        <option key={`conductor-${c.id}`} value={c.id}>
                          {c.persona?.nombres} {c.persona?.apellidoPaterno} - {c.licencia}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ruta (Opcional)</label>
                    <select
                      name="idRuta"
                      value={formData.idRuta !== undefined ? formData.idRuta : ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, idRuta: Number(e.target.value) || undefined }))}
                      className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="">Seleccionar ruta...</option>
                      {rutas.map(r => (
                        <option key={`ruta-${r.id}`} value={r.id}>
                          {r.nombre} - S/ {r.costo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Columna Derecha */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección de Envío <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="direccionEnvio"
                      value={formData.direccionEnvio}
                      onChange={(e) => setFormData(prev => ({ ...prev, direccionEnvio: e.target.value }))}
                      className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Ej: Av. Principal 123, Ciudad"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha Envío <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="fechaEnvio"
                        value={formData.fechaEnvio}
                        onChange={(e) => setFormData(prev => ({ ...prev, fechaEnvio: e.target.value }))}
                        className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Entrega</label>
                      <input
                        type="date"
                        name="fechaEntrega"
                        value={formData.fechaEntrega}
                        onChange={(e) => setFormData(prev => ({ ...prev, fechaEntrega: e.target.value }))}
                        className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        min={formData.fechaEnvio}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Costo Transporte (S/)</label>
                      <input
                        type="number"
                        step="0.01"
                        name="costoTransporte"
                        value={formData.costoTransporte}
                        onChange={(e) => setFormData(prev => ({ ...prev, costoTransporte: Number(e.target.value) }))}
                        className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                      <select
                        name="estado"
                        value={formData.estado}
                        onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value as EstadoEnvio }))}
                        className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="EN_RUTA">EN RUTA</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                      rows={3}
                      className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Instrucciones especiales, referencias, etc..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-200 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowCrearEnvioModal(false); resetForm(); }}
                  className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="flex items-center gap-2">
                    <FiPlus /> Crear Envío
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Ver Detalles de Envío */}
      {showDetailModal && envioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Detalles del Envío</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX size={24} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Pedido</p>
                    <p className="text-lg font-semibold">#{envioSeleccionado.pedido?.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Cliente</p>
                    <p className="text-lg font-semibold">{envioSeleccionado.pedido?.cliente?.nombre || 'Sin cliente'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Vehículo</p>
                    <p className="text-lg font-semibold">
                      {envioSeleccionado.vehiculo ? `${envioSeleccionado.vehiculo.placa} - ${envioSeleccionado.vehiculo.marca} ${envioSeleccionado.vehiculo.modelo}` : '-'}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Conductor</p>
                    <p className="text-lg font-semibold">{envioSeleccionado.conductor?.nombre || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Ruta</p>
                    <p className="text-lg font-semibold">{envioSeleccionado.ruta?.nombre || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Estado</p>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${estadoColor(envioSeleccionado.estado as EstadoEnvio)}`}>
                      {envioSeleccionado.estado}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 font-medium mb-2">Dirección</p>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg border">
                  {envioSeleccionado.direccionEnvio || 'Sin dirección'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Fecha Envío</p>
                  <p className="text-gray-800">{envioSeleccionado.fechaEnvio ? formatDate(envioSeleccionado.fechaEnvio) : '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Fecha Entrega</p>
                  <p className="text-gray-800">{envioSeleccionado.fechaEntrega ? formatDate(envioSeleccionado.fechaEntrega) : 'Pendiente'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 font-medium">Costo Transporte</p>
                <p className="text-2xl font-bold text-gray-800">S/ {envioSeleccionado.costoTransporte || '0.00'}</p>
              </div>
              
              {envioSeleccionado.observaciones && (
                <div>
                  <p className="text-xs text-gray-500 font-medium">Observaciones</p>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg border">
                    {envioSeleccionado.observaciones}
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Editar Envío */}
      {showModal && envioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Editar Envío</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX size={24} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleActualizarEnvio} className="p-6">
              <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-700 mb-2">Información del Pedido</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Pedido</p>
                    <p className="font-bold">#{envioSeleccionado.pedido?.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cliente</p>
                    <p className="font-bold">{envioSeleccionado.pedido?.cliente?.nombre}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Pedido</p>
                    <p className="font-bold">S/ {envioSeleccionado.pedido?.total || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estado Actual</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${estadoColor(envioSeleccionado.estado as EstadoEnvio)}`}>
                      {envioSeleccionado.estado}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehículo</label>
                    <select
                      name="idVehiculo"
                      value={formData.idVehiculo !== undefined ? formData.idVehiculo : ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, idVehiculo: Number(e.target.value) || undefined }))}
                      className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar vehículo...</option>
                      {vehiculos.map(v => (
                        <option key={`vehiculo-edit-${v.id}`} value={v.id}>
                          {v.placa} - {v.marca} {v.modelo}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Conductor</label>
                    <select
                      name="idConductor"
                      value={formData.idConductor !== undefined ? formData.idConductor : ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, idConductor: Number(e.target.value) || undefined }))}
                      className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar conductor...</option>
                      {conductores.map(c => (
                        <option key={`conductor-edit-${c.id}`} value={c.id}>
                          {c.persona?.nombres} {c.persona?.apellidoPaterno}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ruta</label>
                    <select
                      name="idRuta"
                      value={formData.idRuta !== undefined ? formData.idRuta : ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, idRuta: Number(e.target.value) || undefined }))}
                      className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar ruta...</option>
                      {rutas.map(r => (
                        <option key={`ruta-edit-${r.id}`} value={r.id}>
                          {r.nombre} - S/ {r.costo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                    <input
                      type="text"
                      name="direccionEnvio"
                      value={formData.direccionEnvio}
                      onChange={(e) => setFormData(prev => ({ ...prev, direccionEnvio: e.target.value }))}
                      className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Envío</label>
                      <input
                        type="date"
                        name="fechaEnvio"
                        value={formData.fechaEnvio}
                        onChange={(e) => setFormData(prev => ({ ...prev, fechaEnvio: e.target.value }))}
                        className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Entrega</label>
                      <input
                        type="date"
                        name="fechaEntrega"
                        value={formData.fechaEntrega}
                        onChange={(e) => setFormData(prev => ({ ...prev, fechaEntrega: e.target.value }))}
                        className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Costo Transporte (S/)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="costoTransporte"
                      value={formData.costoTransporte}
                      onChange={(e) => setFormData(prev => ({ ...prev, costoTransporte: Number(e.target.value) }))}
                      className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value as EstadoEnvio }))}
                      className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="EN_RUTA">EN RUTA</option>
                      <option value="ENTREGADO">ENTREGADO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                  rows={3}
                  className="w-full p-3.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-200 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg"
                >
                  Actualizar Envío
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}