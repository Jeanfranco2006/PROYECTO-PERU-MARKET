import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaShoppingCart, FaTrash, FaMinus, FaPlus, FaSearch, FaUserPlus } from 'react-icons/fa';
import ModalCliente from './ModalCliente';
import ModalPago from './Modalpago';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  stock: number;
}

interface ProductoVenta {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

interface Cliente {
  id: number;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  telefono: string;
}

interface MetodoPago {
  id: number;
  nombre: string;
  descripcion: string;
  estado: string;
}

interface DetallePago {
  id_metodo_pago: number;
  monto: number;
  referencia: string;
}

const VentasList: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados principales
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ProductoVenta[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);

  // Estados de modales
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);

  // Inicializar datos
  useEffect(() => {
    cargarDatosIniciales();
    cargarClientes();
    cargarMetodosPago();
  }, []);

  const cargarDatosIniciales = () => {
    const productosEjemplo: Producto[] = [
      {
        id: 1,
        nombre: "Aceite de Oliva - 5L",
        precio: 85.00,
        imagen: "https://via.placeholder.com/200x200/10B981/FFFFFF?text=Aceite",
        categoria: "Abarrotes",
        stock: 150,
      },
      {
        id: 2,
        nombre: "Arroz Extra - Saco 50kg",
        precio: 120.00,
        imagen: "https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=Arroz",
        categoria: "Granos",
        stock: 80,
      },
      {
        id: 3,
        nombre: "Atún en Lata - Caja x 48 und",
        precio: 180.00,
        imagen: "https://via.placeholder.com/200x200/EF4444/FFFFFF?text=Atún",
        categoria: "Conservas",
        stock: 60,
      },
      {
        id: 4,
        nombre: "Coca-Cola - Caja x 24 botellas",
        precio: 65.00,
        imagen: "https://via.placeholder.com/200x200/DC2626/FFFFFF?text=Coca",
        categoria: "Bebidas",
        stock: 200,
      },
      {
        id: 5,
        nombre: "Fideos Spaghetti - Caja x 50 paq",
        precio: 95.00,
        imagen: "https://via.placeholder.com/200x200/8B5CF6/FFFFFF?text=Fideos",
        categoria: "Pastas",
        stock: 120,
      },
      {
        id: 6,
        nombre: "Leche Evaporada - Caja x 24 latas",
        precio: 110.00,
        imagen: "https://via.placeholder.com/200x200/06B6D4/FFFFFF?text=Leche",
        categoria: "Lácteos",
        stock: 90,
      }
    ];
    setProductos(productosEjemplo);
  };

  const cargarClientes = () => {
    const clientesGuardados = JSON.parse(localStorage.getItem('clientes') || '[]');
    if (clientesGuardados.length === 0) {
      const clientesEjemplo: Cliente[] = [
        {
          id: 1,
          tipo_documento: 'DNI',
          numero_documento: '12345678',
          nombres: 'Juan',
          apellido_paterno: 'Pérez',
          apellido_materno: 'Gómez',
          correo: 'juan@email.com',
          telefono: '999888777'
        },
        {
          id: 2,
          tipo_documento: 'RUC',
          numero_documento: '20123456789',
          nombres: 'María',
          apellido_paterno: 'López',
          apellido_materno: 'Santos',
          correo: 'maria@email.com',
          telefono: '999888666'
        }
      ];
      setClientes(clientesEjemplo);
      localStorage.setItem('clientes', JSON.stringify(clientesEjemplo));
    } else {
      setClientes(clientesGuardados);
    }
  };

  const cargarMetodosPago = () => {
    const metodosGuardados = JSON.parse(localStorage.getItem('metodos_pago') || '[]');
    if (metodosGuardados.length === 0) {
      const metodosEjemplo: MetodoPago[] = [
        {
          id: 1,
          nombre: 'Efectivo',
          descripcion: 'Pago en efectivo',
          estado: 'activo'
        },
        {
          id: 2,
          nombre: 'Tarjeta Débito',
          descripcion: 'Pago con tarjeta de débito',
          estado: 'activo'
        },
        {
          id: 3,
          nombre: 'Tarjeta Crédito',
          descripcion: 'Pago con tarjeta de crédito',
          estado: 'activo'
        },
        {
          id: 4,
          nombre: 'Transferencia',
          descripcion: 'Transferencia bancaria',
          estado: 'activo'
        },
        {
          id: 5,
          nombre: 'Yape',
          descripcion: 'Pago con Yape',
          estado: 'activo'
        }
      ];
      setMetodosPago(metodosEjemplo);
      localStorage.setItem('metodos_pago', JSON.stringify(metodosEjemplo));
    } else {
      setMetodosPago(metodosGuardados);
    }
  };

  // Filtrar clientes cuando cambia la búsqueda
  useEffect(() => {
    if (busquedaCliente.trim() === '') {
      setClientesFiltrados([]);
    } else {
      const filtrados = clientes.filter(cliente =>
        cliente.nombres.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
        cliente.apellido_paterno.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
        cliente.apellido_materno.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
        cliente.numero_documento.includes(busquedaCliente)
      );
      setClientesFiltrados(filtrados);
    }
  }, [busquedaCliente, clientes]);

  // Funciones del carrito
  const limpiarCarrito = () => setCarrito([]);

  const agregarAlCarrito = (producto: Producto) => {
    const existeEnCarrito = carrito.find(item => item.producto.id === producto.id);
    
    if (existeEnCarrito) {
      setCarrito(carrito.map(item =>
        item.producto.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.producto.precio }
          : item
      ));
    } else {
      setCarrito([...carrito, {
        producto,
        cantidad: 1,
        subtotal: producto.precio
      }]);
    }
  };

  const actualizarCantidad = (id: number, cantidad: number) => {
    if (cantidad === 0) {
      setCarrito(carrito.filter(item => item.producto.id !== id));
    } else {
      setCarrito(carrito.map(item =>
        item.producto.id === id
          ? { ...item, cantidad, subtotal: cantidad * item.producto.precio }
          : item
      ));
    }
  };

  // Funciones de clientes
  const handleRegistrarCliente = (clienteData: Omit<Cliente, 'id'>) => {
    const nuevoCliente: Cliente = {
      ...clienteData,
      id: Date.now()
    };

    const nuevosClientes = [...clientes, nuevoCliente];
    setClientes(nuevosClientes);
    localStorage.setItem('clientes', JSON.stringify(nuevosClientes));
    
    setClienteSeleccionado(nuevoCliente);
    setBusquedaCliente('');
    setMostrarModalCliente(false);

    alert('Cliente registrado exitosamente');
  };

  // Funciones de venta
  const abrirModalPago = () => {
    if (carrito.length === 0) {
      alert('Agrega productos al carrito primero');
      return;
    }
    if (!clienteSeleccionado) {
      alert('Selecciona un cliente primero');
      return;
    }
    setMostrarModalPago(true);
  };

  const procesarVenta = (detallesPago: DetallePago[]) => {
    const totalPagado = detallesPago.reduce((sum, pago) => sum + pago.monto, 0);
    
    // Crear objeto de venta
    const nuevaVenta = {
      id: Date.now(),
      cliente: clienteSeleccionado,
      fecha: new Date().toISOString(),
      estado: 'completada',
      total,
      subtotal,
      descuento: 0,
      igv,
      almacen: 'Principal',
      usuario: 'Vendedor',
      productos: carrito.map(item => ({
        id: item.producto.id,
        nombre: item.producto.nombre,
        precio: item.producto.precio,
        cantidad: item.cantidad,
        subtotal: item.subtotal
      })),
      pagos: detallesPago
    };
    
    // Guardar en localStorage
    const ventasExistentes = JSON.parse(localStorage.getItem('ventas') || '[]');
    const nuevasVentas = [...ventasExistentes, nuevaVenta];
    localStorage.setItem('ventas', JSON.stringify(nuevasVentas));
    
    // Mostrar mensaje de éxito
    const cambio = totalPagado - total;
    let mensaje = `✅ Venta procesada exitosamente!\nCliente: ${clienteSeleccionado?.nombres} ${clienteSeleccionado?.apellido_paterno}\nTotal: S/ ${total.toFixed(2)}\nTotal Pagado: S/ ${totalPagado.toFixed(2)}`;
    
    if (cambio > 0) {
      mensaje += `\nCambio: S/ ${cambio.toFixed(2)}`;
    }
    
    alert(mensaje);
    
    // Limpiar todo
    setCarrito([]);
    setClienteSeleccionado(null);
    setBusquedaCliente('');
    setMostrarModalPago(false);
    navigate('/ventas');
  };

  const cancelarVenta = () => {
    if (carrito.length > 0) {
      if (confirm('¿Estás seguro de cancelar la venta? Se perderán los productos del carrito.')) {
        setCarrito([]);
        setClienteSeleccionado(null);
        setBusquedaCliente('');
      }
    } else {
      navigate('/ventas');
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  // Calcular totales
  const subtotal = carrito.reduce((sum, item) => sum + item.subtotal, 0);
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">VENTAS</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <button 
              onClick={cancelarVenta}
              className="flex items-center justify-center bg-gray-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FaTimes className="mr-2" />
              <span className="text-sm sm:text-base">Cancelar</span>
            </button>
            <button 
              onClick={abrirModalPago}
              className="flex items-center justify-center bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaShoppingCart className="mr-2" />
              <span className="text-sm sm:text-base">Procesar Venta</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Columna izquierda - Productos */}
          <div className="lg:col-span-2">
            {/* Barra de búsqueda */}
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  className="w-full border border-gray-300 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {productosFiltrados.map((producto) => (
                <div
                  key={producto.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="p-3 sm:p-4">
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-full h-24 sm:h-32 object-cover rounded-md mb-2 sm:mb-3"
                    />
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base line-clamp-2">{producto.nombre}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">{producto.categoria}</p>
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <span className="text-base sm:text-lg font-bold text-blue-600">
                        S/ {producto.precio.toFixed(2)}
                      </span>
                      <span className={`text-xs sm:text-sm px-2 py-1 rounded-full ${
                        producto.stock > 10 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        Stock: {producto.stock}
                      </span>
                    </div>
                    <button
                      onClick={() => agregarAlCarrito(producto)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                    >
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna derecha - Carrito */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Carrito de Venta</h2>
            
            {/* Selector de cliente */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={busquedaCliente}
                  onChange={(e) => setBusquedaCliente(e.target.value)}
                  placeholder="Buscar cliente por nombre o DNI..."
                  className="w-full border border-gray-300 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              
              {/* Lista de clientes filtrados */}
              {busquedaCliente && clientesFiltrados.length > 0 && (
                <div className="absolute z-20 w-full max-w-md mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {clientesFiltrados.map((cliente) => (
                    <div
                      key={cliente.id}
                      onClick={() => {
                        setClienteSeleccionado(cliente);
                        setBusquedaCliente('');
                      }}
                      className="p-2 sm:p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium text-sm sm:text-base">
                        {cliente.nombres} {cliente.apellido_paterno} {cliente.apellido_materno}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {cliente.tipo_documento}: {cliente.numero_documento}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mensaje si no hay clientes */}
              {busquedaCliente && clientesFiltrados.length === 0 && (
                <div className="absolute z-20 w-full max-w-md mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="p-3 text-center">
                    <p className="text-gray-500 mb-2 text-sm">No se encontraron clientes</p>
                    <button
                      onClick={() => setMostrarModalCliente(true)}
                      className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      <FaUserPlus className="mr-2" />
                      Registrar Nuevo Cliente
                    </button>
                  </div>
                </div>
              )}

              {/* Cliente seleccionado */}
              {clienteSeleccionado && (
                <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-medium text-green-800 text-sm sm:text-base">
                    {clienteSeleccionado.nombres} {clienteSeleccionado.apellido_paterno} {clienteSeleccionado.apellido_materno}
                  </div>
                  <div className="text-xs sm:text-sm text-green-600">
                    {clienteSeleccionado.tipo_documento}: {clienteSeleccionado.numero_documento}
                  </div>
                  <button
                    onClick={() => setClienteSeleccionado(null)}
                    className="text-xs text-red-600 hover:text-red-800 mt-1"
                  >
                    Cambiar cliente
                  </button>
                </div>
              )}

              {/* Botón para registrar nuevo cliente */}
              {!clienteSeleccionado && !busquedaCliente && (
                <button
                  onClick={() => setMostrarModalCliente(true)}
                  className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors mt-2 text-sm sm:text-base"
                >
                  <FaUserPlus className="mr-2" />
                  Registrar Nuevo Cliente
                </button>
              )}
            </div>

            {/* Botón limpiar carrito */}
            {carrito.length > 0 && (
              <button 
                onClick={limpiarCarrito}
                className="flex items-center justify-center w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors mb-4 text-sm sm:text-base"
              >
                <FaTrash className="mr-2" />
                Limpiar Carrito
              </button>
            )}

            {/* Lista de productos en carrito */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 max-h-64 sm:max-h-96 overflow-y-auto">
              {carrito.length === 0 ? (
                <p className="text-gray-500 text-center py-4 text-sm sm:text-base">No hay productos en el carrito</p>
              ) : (
                carrito.map((item) => (
                  <div key={item.producto.id} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">{item.producto.nombre}</p>
                      <p className="text-xs text-gray-600">S/ {item.producto.precio.toFixed(2)} c/u</p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          actualizarCantidad(item.producto.id, item.cantidad - 1);
                        }}
                        className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        <FaMinus size={8} />
                      </button>
                      <span className="w-6 sm:w-8 text-center text-xs sm:text-sm">{item.cantidad}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          actualizarCantidad(item.producto.id, item.cantidad + 1);
                        }}
                        className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        <FaPlus size={8} />
                      </button>
                    </div>
                    <span className="font-semibold w-14 sm:w-20 text-right text-xs sm:text-sm">
                      S/ {item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Resumen de compra */}
            <div className="border-t pt-3 sm:pt-4">
              <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IGV (18%):</span>
                  <span>S/ {igv.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2 text-base sm:text-lg">
                  <span>Total:</span>
                  <span className="text-blue-600">S/ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modales */}
        <ModalCliente
          isOpen={mostrarModalCliente}
          onClose={() => setMostrarModalCliente(false)}
          onRegistrar={handleRegistrarCliente}
        />

        <ModalPago
          isOpen={mostrarModalPago}
          onClose={() => setMostrarModalPago(false)}
          onConfirmar={procesarVenta}
          cliente={clienteSeleccionado}
          total={total}
          metodosPago={metodosPago}
        />
      </div>
    </div>
  );
};

export default VentasList;