import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { 
  IoMdAdd,
  IoIosEye,
  IoIosList,
  IoIosPeople,
  IoIosSearch,
  IoIosDocument,
  IoIosCash,
  IoIosCalendar
} from "react-icons/io";

const purchaseData = [
  { 
    id: '1', 
    numero: 'F001-0000001', 
    proveedor: 'Tecnolimport SA', 
    fecha: '2024-11-15', 
    total: 3131.25, 
    estado: 'COMPLETADO',
    tipo_comprobante: 'Factura',
    almacen: 'Almacén Principal'
  },
  { 
    id: '2', 
    numero: 'B002-0000105', 
    proveedor: 'ElectroPeru S.R.L.', 
    fecha: '2024-11-10', 
    total: 890.50, 
    estado: 'PENDIENTE',
    tipo_comprobante: 'Boleta',
    almacen: 'Almacén Norte'
  },
  { 
    id: '3', 
    numero: 'F001-0000002', 
    proveedor: 'Distribuidora XYZ', 
    fecha: '2024-11-01', 
    total: 12500.00, 
    estado: 'COMPLETADO',
    tipo_comprobante: 'Factura',
    almacen: 'Almacén Sur'
  },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'COMPLETADO':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'PENDIENTE':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'CANCELADO':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function PurchaseList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('all');

  const comprasFiltradas = useMemo(() => {
    return purchaseData.filter(compra =>
      (compra.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
       compra.proveedor.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterEstado === 'all' || compra.estado === filterEstado)
    );
  }, [searchTerm, filterEstado]);

  const totalCompras = purchaseData.reduce((sum, c) => sum + c.total, 0);
  const comprasCompletadas = purchaseData.filter(c => c.estado === 'COMPLETADO').length;
  const comprasPendientes = purchaseData.filter(c => c.estado === 'PENDIENTE').length;

  const handleAdministrarProveedores = () => {
    alert('Redirigiendo a gestión de proveedores...');
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl p-6">

        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-extrabold text-blue-700 flex items-center">
            <IoIosList className="mr-3 w-8 h-8" /> Historial de Compras
          </h1>
          <Link 
            to="/compras/nueva" 
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center shadow-md hover:bg-green-700 transition-all"
          >
            <IoMdAdd className="mr-2 w-5 h-5" /> Nueva Compra
          </Link>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{purchaseData.length}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <IoIosDocument className="w-4 h-4" />
              <span>Total Compras</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">S/{totalCompras.toFixed(2)}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <IoIosCash className="w-4 h-4" />
              <span>Valor Total</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{comprasCompletadas}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <IoIosCalendar className="w-4 h-4" />
              <span>Completadas</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">{comprasPendientes}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <IoIosCalendar className="w-4 h-4" />
              <span>Pendientes</span>
            </div>
          </div>
        </div>

        {/* Controles y búsqueda */}
        <div className='flex justify-between items-center mb-4'>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <IoIosSearch className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder='Buscar por N° Comprobante o Proveedor...'
                className='w-80 pl-10 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="COMPLETADO">Completado</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
          <button 
            onClick={handleAdministrarProveedores}
            className='text-sm text-blue-600 hover:text-blue-800 flex items-center'
          >
            <IoIosPeople className='mr-1 w-4 h-4' /> Administrar Proveedores
          </button>
        </div>

        <div className="overflow-x-auto border rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Comprobante</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Almacén</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comprasFiltradas.map((compra) => (
                <tr key={compra.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{compra.numero}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{compra.proveedor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{compra.tipo_comprobante}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{compra.almacen}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{compra.fecha}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">S/{compra.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${getStatusStyles(compra.estado)}`}>
                      {compra.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <Link 
                      to={`/compras/historial/${compra.id}`} 
                      className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition"
                      title="Ver Detalle"
                    >
                      <IoIosEye className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}