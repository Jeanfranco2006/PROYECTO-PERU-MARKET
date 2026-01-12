import React, { useEffect, useMemo, useState, type FormEvent } from "react";

import {
  FiPlus, FiEdit, FiEye, FiTruck,
  FiPackage, FiSearch, FiX, FiBox, FiShoppingCart, FiCheck, FiCalendar,
  FiUser,
  FiMap,
  FiMapPin
} from "react-icons/fi";
import { enviosService } from "../../services/envios/envioServices";
import { api } from "../../services/api";
import VehiculoModal from "./RegistarVehiculoModal";
import ConductorModal from "./ConductorModal";
import RutaModal from "./RutaModal";
import type { Envio, FormDataEnvio, EstadoEnvio } from "../../types/envios/envio";
import OpenStreetMapSelector from "../../components/GoogleMapsSelector";

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
  const [showMapModal, setShowMapModal] = useState(false);

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

  // Estado para las coordenadas del mapa
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  // ========== FUNCIONES PRINCIPALES ==========

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
    setSelectedLocation(null);
  };

  const cargarDatos = async () => {
    try {
      setLoading(prev => ({ ...prev, envios: true, pedidos: true, combos: true }));

      const [enviosData, pedidosData, vehiculosRes, conductoresRes, rutasRes] = await Promise.all([
        enviosService.listar(),
        enviosService.listarPedidosDisponibles(),
        api.get("/vehiculos/disponibles"),
        api.get("/conductores/disponibles"),
        api.get("/rutas")
      ]);

      setEnvios(Array.isArray(enviosData) ? enviosData : []);
      setPedidosDisponibles(Array.isArray(pedidosData) ? pedidosData : []);
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

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setSelectedLocation({ lat, lng, address });
    setFormData(prev => ({ ...prev, direccionEnvio: address }));
    setShowMapModal(false);
  };

  const openMapModal = () => {
    setShowMapModal(true);
  };

  const iniciarCrearEnvio = (pedido: any) => {
    console.log("📦 Pedido seleccionado para crear envío:", pedido);
    setPedidoSeleccionado(pedido);
    setFormData(prev => ({
      ...prev,
      idVenta: pedido.idVenta || pedido.id,
    }));
    setShowCrearEnvioModal(true);
  };

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

      const envioData = {
        idVenta: formData.idVenta,
        idVehiculo: formData.idVehiculo,
        idConductor: formData.idConductor,
        idRuta: formData.idRuta,
        direccionEnvio: formData.direccionEnvio,
        fechaEnvio: formData.fechaEnvio,
        fechaEntrega: formData.fechaEntrega,
        costoTransporte: formData.costoTransporte,
        estado: formData.estado,
        observaciones: formData.observaciones,
        ...(selectedLocation && {
          latitud: selectedLocation.lat,
          longitud: selectedLocation.lng
        })
      };

      const nuevoEnvio = await enviosService.crear(envioData);

      alert("✅ Envío creado correctamente");
      setShowCrearEnvioModal(false);
      resetForm();
      cargarDatos();

    } catch (error: any) {
      console.error("❌ Error creando envío:", error);
      alert(error.response?.data?.message || error.message || "Error al crear envío");
    }
  };

  const handleEditarEnvio = (envio: Envio) => {
    setEnvioSeleccionado(envio);
    setFormData({
      idVenta: envio.idPedido || envio.pedido?.id,
      idVehiculo: envio.idVehiculo ?? envio.vehiculo?.id,
      idConductor: envio.idConductor ?? envio.conductor?.id,
      idRuta: envio.idRuta ?? envio.ruta?.id,
      direccionEnvio: envio.direccionEnvio ?? "",
      fechaEnvio: envio.fechaEnvio ? String(envio.fechaEnvio).split('T')[0] : "",
      fechaEntrega: envio.fechaEntrega ? String(envio.fechaEntrega).split('T')[0] : "",
      costoTransporte: envio.costoTransporte ?? 0,
      estado: envio.estado,
      observaciones: envio.observaciones ?? ""
    });
    
    setSelectedLocation(null);
    setShowModal(true);
  };

  const handleActualizarEnvio = async (e: FormEvent) => {
    e.preventDefault();

    const idParaActualizar = envioSeleccionado?.idEnvio ?? envioSeleccionado?.id;

    if (!idParaActualizar) {
      alert("Error: No se pudo identificar el envío seleccionado");
      return;
    }

    try {
      const updateData = {
        idVehiculo: formData.idVehiculo,
        idConductor: formData.idConductor,
        idRuta: formData.idRuta,
        direccionEnvio: formData.direccionEnvio,
        fechaEnvio: formData.fechaEnvio,
        fechaEntrega: formData.fechaEntrega,
        costoTransporte: Number(formData.costoTransporte),
        estado: formData.estado,
        observaciones: formData.observaciones,
        ...(selectedLocation && {
          latitud: selectedLocation.lat,
          longitud: selectedLocation.lng
        })
      };

      await enviosService.actualizar(idParaActualizar, updateData);

      alert("✅ Envío actualizado correctamente");
      setShowModal(false);
      setEnvioSeleccionado(null);
      cargarDatos();

    } catch (error: any) {
      console.error("Error actualizando envío:", error);
      alert(error.response?.data || error.message);
    }
  };

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

  const cambiarEstadoEnvio = async (id: number, estado: EstadoEnvio) => {
    if (!id) return;
    try {
      await enviosService.actualizar(id, { estado });
      cargarDatos();
    } catch (error) {
      console.error("Error cambiando estado:", error);
      alert("❌ Error al cambiar estado");
    }
  };

  const enviosFiltrados = useMemo(() => {
    return envios.filter(e => {
      const search = searchTerm.toLowerCase();
      const pedidoId = e.idPedido?.toString() || "";
      const direccion = e.direccionEnvio?.toLowerCase() || "";
      const cliente = e.nombreCliente?.toLowerCase() || "";

      return (
        (pedidoId.includes(search) || direccion.includes(search) || cliente.includes(search)) &&
        (!filterEstado || e.estado === filterEstado)
      );
    });
  }, [envios, searchTerm, filterEstado]);

  const pedidosFiltrados = useMemo(() => {
    return pedidosDisponibles.filter(p => {
      const search = searchTerm.toLowerCase();
      const codigo = p.codigo?.toLowerCase() ?? "";
      const cliente = p.clienteNombre?.toLowerCase() ?? "";
      const dni = p.dniCliente?.toString()?.toLowerCase() ?? "";

      return codigo.includes(search) || cliente.includes(search) || dni.includes(search);
    });
  }, [pedidosDisponibles, searchTerm]);

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

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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
                        <div className="font-medium text-gray-900">{pedido.clienteNombre || pedido.nombreCliente}</div>
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
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${pedido.tieneEnvio
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
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pedido.tieneEnvio
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
                  <th className="p-4 text-left font-medium text-gray-700 uppercase">Pedido</th>
                  <th className="p-4 text-left font-medium text-gray-700 uppercase">Cliente</th>
                  <th className="p-4 text-left font-medium text-gray-700 uppercase">Vehículo</th>
                  <th className="p-4 text-left font-medium text-gray-700 uppercase">Conductor</th>
                  <th className="p-4 text-left font-medium text-gray-700 uppercase">Ruta / Dirección</th>
                  <th className="p-4 text-left font-medium text-gray-700 uppercase">Fechas</th>
                  <th className="p-4 text-left font-medium text-gray-700 uppercase">Costo</th>
                  <th className="p-4 text-center font-medium text-gray-700 uppercase">Estado</th>
                  <th className="p-4 text-center font-medium text-gray-700 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {enviosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center">
                      <FiPackage className="mx-auto text-4xl text-gray-300 mb-3" />
                      <p className="text-gray-500">No hay envíos registrados</p>
                    </td>
                  </tr>
                ) : (
                  enviosFiltrados.map((envio) => (
                    <tr key={envio.idEnvio || envio.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      {/* 1. PEDIDO */}
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">
                          #{envio.idPedido || envio.pedido?.id}
                        </div>
                      </td>

                      {/* 2. CLIENTE */}
                      <td className="p-4">
                        <div className="text-gray-900 font-medium">
                          {envio.nombreCliente || envio.pedido?.cliente?.nombre || 'Sin cliente'}
                        </div>
                      </td>

                      {/* 3. VEHÍCULO */}
                      <td className="p-4">
                        {(envio.placaVehiculo || envio.vehiculo?.placa) ? (
                          <div>
                            <div className="font-medium text-gray-900">{envio.placaVehiculo || envio.vehiculo?.placa}</div>
                          </div>
                        ) : <span className="text-gray-400">-</span>}
                      </td>

                      {/* 4. CONDUCTOR */}
                      <td className="p-4">
                        <div className="text-gray-900">
                          {envio.nombreConductor || envio.conductor?.nombre || '-'}
                        </div>
                      </td>

                      {/* 5. RUTA Y DIRECCIÓN */}
                      <td className="p-4 max-w-xs">
                        <div className="text-gray-900 font-medium">
                          {envio.nombreRuta || envio.ruta?.nombre || 'Manual'}
                        </div>
                        <div className="text-gray-500 text-xs truncate" title={envio.direccionEnvio}>
                          {envio.direccionEnvio || '-'}
                        </div>
                      </td>

                      {/* 6. FECHAS */}
                      <td className="p-4">
                        <div className="text-xs space-y-1">
                          <div className="text-gray-600">
                            <span className="font-medium">Env:</span> {formatDate(envio.fechaEnvio)}
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Ent:</span> {formatDate(envio.fechaEntrega)}
                          </div>
                        </div>
                      </td>

                      {/* 7. COSTO */}
                      <td className="p-4">
                        <span className="font-medium text-gray-900">S/ {envio.costoTransporte?.toFixed(2) || '0.00'}</span>
                      </td>

                      {/* 8. ESTADO */}
                      <td className="p-4 text-center">
                        <select
                          value={envio.estado || "PENDIENTE"}
                          onChange={(e) => {
                            const id = envio.idEnvio ?? envio.id;
                            if (id) cambiarEstadoEnvio(id, e.target.value as EstadoEnvio);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer ${estadoColor(envio.estado)}`}
                        >
                          <option value="PENDIENTE">PENDIENTE</option>
                          <option value="EN_RUTA">EN RUTA</option>
                          <option value="ENTREGADO">ENTREGADO</option>
                          <option value="CANCELADO">CANCELADO</option>
                        </select>
                      </td>

                      {/* 9. ACCIONES */}
                      <td className="p-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => { setEnvioSeleccionado(envio); setShowDetailModal(true); }}
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
              <div className="text-center p-8 bg-white rounded-xl border border-gray-200">
                <FiPackage className="mx-auto text-4xl text-gray-300 mb-3" />
                <p className="text-gray-500">No hay envíos registrados</p>
              </div>
            ) : (
              enviosFiltrados.map((envio) => (
                <div key={envio.idEnvio || envio.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                  <div className="space-y-4">
                    
                    {/* Encabezado: Pedido y Estado */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-bold text-gray-900 text-lg">
                          Pedido #{envio.idPedido || envio.pedido?.id}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {envio.nombreCliente || envio.pedido?.cliente?.nombre || 'Sin cliente'}
                        </p>
                      </div>
                      
                      {/* Selector de Estado */}
                      <select
                        value={envio.estado || "PENDIENTE"}
                        onChange={(e) => {
                          const id = envio.idEnvio ?? envio.id;
                          if (id) cambiarEstadoEnvio(id, e.target.value as EstadoEnvio);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm ${estadoColor(envio.estado)}`}
                      >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="EN_RUTA">EN RUTA</option>
                        <option value="ENTREGADO">ENTREGADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                      </select>
                    </div>
                    
                    <hr className="border-gray-100" />

                    {/* Detalles */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs uppercase font-semibold mb-1">Vehículo</p>
                        <div className="font-medium text-gray-800">
                          {envio.placaVehiculo || envio.vehiculo?.placa || '-'}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase font-semibold mb-1">Conductor</p>
                        <div className="font-medium text-gray-800 truncate">
                          {envio.nombreConductor || envio.conductor?.nombre || '-'}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-xs uppercase font-semibold mb-1">Dirección</p>
                      <p className="font-medium text-gray-800 text-sm bg-gray-50 p-2 rounded-lg border border-gray-100">
                        {envio.direccionEnvio || '-'}
                      </p>
                    </div>
                    
                    {/* Botones de Acción */}
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => { setEnvioSeleccionado(envio); setShowDetailModal(true); }} 
                        className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
                      >
                        <FiEye size={16} /> Ver
                      </button>
                      <button 
                        onClick={() => handleEditarEnvio(envio)} 
                        className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-green-50 text-green-700 border border-green-100 rounded-lg hover:bg-green-100 text-sm font-medium transition-colors"
                      >
                        <FiEdit size={16} /> Editar
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
            
            {/* Header Sticky */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10 shrink-0">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Crear Nuevo Envío</h2>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  Pedido: <span className="font-semibold text-blue-600">{pedidoSeleccionado.codigo}</span>
                </p>
              </div>
              <button 
                onClick={() => { setShowCrearEnvioModal(false); resetForm(); }} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <FiX size={24} className="text-gray-500" />
              </button>
            </div>
            
            {/* Body Scrollable */}
            <form onSubmit={handleCrearEnvio} className="flex-1 overflow-y-auto p-4 md:p-6">
              
              {/* Información del Pedido */}
              <div className="mb-6 md:mb-8 bg-blue-50 border border-blue-100 rounded-xl p-4 md:p-5">
                <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2 text-sm md:text-base">
                  <FiPackage className="text-blue-600" /> Resumen del Pedido
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-blue-600/70 font-medium uppercase tracking-wider">Cliente</p>
                    <p className="font-semibold text-gray-800 truncate">{pedidoSeleccionado.clienteNombre || pedidoSeleccionado.nombreCliente}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600/70 font-medium uppercase tracking-wider">Total</p>
                    <p className="font-bold text-gray-800">S/ {pedidoSeleccionado.total?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600/70 font-medium uppercase tracking-wider">Fecha Pedido</p>
                    <p className="font-semibold text-gray-800">{formatDate(pedidoSeleccionado.fechaPedido)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600/70 font-medium uppercase tracking-wider">Estado Venta</p>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">CONFIRMADO</span>
                  </div>
                </div>
              </div>
              
              {/* Grid Responsiva */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                
                {/* Columna Izquierda: Recursos */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b pb-2 mb-4">
                    <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <h4 className="font-bold text-gray-700">Recursos</h4>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Vehículo Disponible <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="idVehiculo"
                        value={formData.idVehiculo !== undefined ? formData.idVehiculo : ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, idVehiculo: Number(e.target.value) || undefined }))}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all text-sm"
                        required
                      >
                        <option value="">Seleccionar vehículo...</option>
                        {vehiculos
                          .filter((v: any) => v.estado === 'DISPONIBLE')
                          .map(v => (
                            <option key={v.id} value={v.id}>
                              {v.placa} - {v.marca} {v.modelo}
                            </option>
                        ))}
                      </select>
                      <FiTruck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {vehiculos.filter((v: any) => v.estado === 'DISPONIBLE').length === 0 && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        ⚠️ No hay vehículos disponibles.
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Conductor <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="idConductor"
                        value={formData.idConductor !== undefined ? formData.idConductor : ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, idConductor: Number(e.target.value) || undefined }))}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all text-sm"
                        required
                      >
                        <option value="">Seleccionar conductor...</option>
                        {conductores.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.persona?.nombres} {c.persona?.apellidoPaterno} - {c.licencia}
                          </option>
                        ))}
                      </select>
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ruta</label>
                    <div className="relative">
                      <select
                        name="idRuta"
                        value={formData.idRuta !== undefined ? formData.idRuta : ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, idRuta: Number(e.target.value) || undefined }))}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all text-sm"
                      >
                        <option value="">Escoger Ruta</option>
                        {rutas.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.nombre}
                          </option>
                        ))}
                      </select>
                      <FiMap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                {/* Columna Derecha: Detalles de Entrega */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b pb-2 mb-4">
                    <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <h4 className="font-bold text-gray-700">Entrega</h4>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Dirección de Envío <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="direccionEnvio"
                        value={formData.direccionEnvio}
                        onChange={(e) => setFormData(prev => ({ ...prev, direccionEnvio: e.target.value }))}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                        placeholder="Ej: Av. Principal 123, Ciudad"
                        required
                      />
                      <button
                        type="button"
                        onClick={openMapModal}
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap text-sm"
                      >
                        <FiMapPin size={16} />
                        Mapa
                      </button>
                    </div>
                    {selectedLocation && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                        ✅ Ubicación seleccionada: {selectedLocation.address}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Fecha Salida <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="fechaEnvio"
                        value={formData.fechaEnvio}
                        onChange={(e) => setFormData(prev => ({ ...prev, fechaEnvio: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fecha Entrega</label>
                      <input
                        type="date"
                        name="fechaEntrega"
                        value={formData.fechaEntrega}
                        onChange={(e) => setFormData(prev => ({ ...prev, fechaEntrega: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        min={formData.fechaEnvio}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Costo (S/)</label>
                      <input
                        type="number"
                        step="0.01"
                        name="costoTransporte"
                        value={formData.costoTransporte}
                        onChange={(e) => setFormData(prev => ({ ...prev, costoTransporte: Number(e.target.value) }))}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Estado Inicial</label>
                      <div className="px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium cursor-not-allowed">
                        PENDIENTE
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Observaciones</label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                      rows={2}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                      placeholder="Instrucciones especiales..."
                    />
                  </div>
                </div>
              </div>
              
              {/* Footer Sticky Bottom */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowCrearEnvioModal(false); resetForm(); }}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all text-sm sm:text-base w-full sm:w-auto"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
                >
                  <FiPlus className="text-lg" /> Crear Envío
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: OpenStreetMap Selector */}
{showMapModal && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <FiMapPin size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Seleccionar Ubicación en el Mapa</h2>
            <p className="text-sm text-gray-500">Haz clic en el mapa para seleccionar la dirección de entrega</p>
          </div>
        </div>
        <button 
          onClick={() => setShowMapModal(false)} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FiX size={24} className="text-gray-500" />
        </button>
      </div>
      
      <div className="flex-1 p-4">
        <OpenStreetMapSelector
          onLocationSelect={handleLocationSelect}
          initialLocation={
            selectedLocation 
              ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
              : undefined
          }
          height="500px"
        />
      </div>
      
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {selectedLocation ? (
            <span className="text-green-600">✅ Ubicación seleccionada</span>
          ) : (
            <span className="text-amber-600">📍 Haz clic en el mapa para seleccionar una ubicación</span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowMapModal(false)}
            className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              if (selectedLocation) {
                setShowMapModal(false);
              } else {
                alert("Por favor selecciona una ubicación en el mapa");
              }
            }}
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Confirmar Ubicación
          </button>
        </div>
      </div>
    </div>
  </div>

      )}
    </div>
  );
}