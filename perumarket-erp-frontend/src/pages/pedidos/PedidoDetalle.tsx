import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaUser, FaInfoCircle, FaBox, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

interface ProductoPedido {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

interface Pedido {
  id: number;
  cliente: string;
  fechaPedido: string;
  estado: 'pendiente' | 'procesando' | 'completado' | 'cancelado';
  total: number;
  productos: ProductoPedido[];
}

interface PedidoDetalleProps {
  pedido: Pedido;
  onClose: () => void;
}

const PedidoDetalle: React.FC<PedidoDetalleProps> = ({ pedido, onClose }) => {
  const navigate = useNavigate();

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completado': return 'bg-green-100 text-green-800';
      case 'procesando': return 'bg-blue-100 text-blue-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'completado': return 'Completado';
      case 'procesando': return 'Procesando';
      case 'pendiente': return 'Pendiente';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Pedido #{pedido.id.toString().padStart(3, '0')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              <FaTimes />
            </button>
          </div>

          {/* Información general */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center">
                <FaUser className="mr-2" />
                Información del Cliente
              </h3>
              <p><strong>Cliente:</strong> {pedido.cliente}</p>
              <p><strong>Fecha del Pedido:</strong> {pedido.fechaPedido}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center">
                <FaInfoCircle className="mr-2" />
                Estado del Pedido
              </h3>
              <p><strong>Estado:</strong>
                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(pedido.estado)}`}>
                  {getEstadoTexto(pedido.estado)}
                </span>
              </p>
              <p><strong>Total:</strong> S/ {pedido.total.toFixed(2)}</p>
            </div>
          </div>

          {/* Productos del pedido */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <FaBox className="mr-2" />
              Productos del Pedido
            </h3>
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Unitario</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pedido.productos.map((producto, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm">{producto.nombre}</td>
                      <td className="px-4 py-3 text-sm">S/ {producto.precio.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{producto.cantidad}</td>
                      <td className="px-4 py-3 text-sm font-semibold">S/ {producto.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onClose}
              className="flex items-center bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              <FaTimes className="mr-2" />
              Cerrar
            </button>
            {pedido.estado === 'pendiente' && (
              <button
                onClick={() => {
                  // Lógica para procesar pedido
                  console.log('Procesar pedido:', pedido.id);
                  alert('Pedido procesado exitosamente');
                  onClose();
                }}
                className="flex items-center bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
              >
                <FaCheckCircle className="mr-2" />
                Procesar Pedido
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoDetalle;