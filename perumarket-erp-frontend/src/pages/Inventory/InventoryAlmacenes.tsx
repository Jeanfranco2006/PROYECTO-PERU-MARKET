import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  IoMdArrowRoundBack,
  IoMdAdd,
  IoIosPin,
  IoIosPeople,
  IoIosCube,
  IoIosStats
} from 'react-icons/io';

interface Warehouse {
  id: number;
  name: string;
  code: string;
  status: 'ACTIVO' | 'INACTIVO';
  address: string;
  responsible: string;
  productsCount: number;
  capacityTotal: number;
  capacityUsed: number;
}

const warehouseData: Warehouse[] = [
  {
    id: 1,
    name: "Almacén Principal",
    code: "ALM-PRIN",
    status: "ACTIVO",
    address: "Av. Industrial 123, Zona Industrial",
    responsible: "Juan Pérez",
    productsCount: 45,
    capacityTotal: 500,
    capacityUsed: 325,
  },
  {
    id: 2,
    name: "Almacén Norte",
    code: "ALM-NORTE",
    status: "ACTIVO",
    address: "Av. Norte 456, Distrito Norte",
    responsible: "María López",
    productsCount: 22,
    capacityTotal: 300,
    capacityUsed: 90,
  },
  {
    id: 3,
    name: "Almacén Sur",
    code: "ALM-SUR",
    status: "ACTIVO",
    address: "Calle Sur 789, Urbanización Sur",
    responsible: "Carlos Rodríguez",
    productsCount: 18,
    capacityTotal: 200,
    capacityUsed: 90,
  },
];

export default function WarehouseManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const totalCapacity = warehouseData.reduce((sum, w) => sum + w.capacityTotal, 0);

  const filteredWarehouses = useMemo(() => {
    return warehouseData.filter(warehouse =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalProducts = warehouseData.reduce((sum, w) => sum + w.productsCount, 0);
  const activeWarehouses = warehouseData.filter(w => w.status === 'ACTIVO').length;


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Link to="/inventario" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <IoMdArrowRoundBack className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Almacenes</h1>
            <p className="text-gray-600">Administre las ubicaciones de almacenamiento</p>
          </div>
        </div>
        <Link to="/inventario/almacenes/nuevo" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform active:scale-[0.98]">
          <IoMdAdd className="w-5 h-5" />
          Nuevo Almacén
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{warehouseData.length}</div>
          <div className="text-gray-600 flex items-center gap-2">
            <IoIosPin className="w-4 h-4" />
            Total Almacenes
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
          <div className="text-gray-600 flex items-center gap-2">
            <IoIosCube className="w-4 h-4" />
            Productos Total
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{activeWarehouses}</div>
          <div className="text-gray-600 flex items-center gap-2">
            <IoIosPeople className="w-4 h-4" />
            Almacenes Activos
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{totalCapacity} m³</div>
          <div className="text-gray-600">Capacidad Total</div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 col-span-1 md:col-span-4 mb-6">
        <input
          placeholder="Buscar Almacén por nombre o código..."
          className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredWarehouses.map((warehouse) => {
          const capacityPercentage = Math.round((warehouse.capacityUsed / warehouse.capacityTotal) * 100);
          const progressBarColor = capacityPercentage > 80 ? 'bg-red-500' : capacityPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500';

          return (
            <div key={warehouse.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{warehouse.name}</h3>
                  <p className="text-sm text-gray-600">Código: {warehouse.code}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${warehouse.status === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {warehouse.status}
                </span>
              </div>
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <IoIosPin className="w-4 h-4" />
                    {warehouse.address}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <IoIosPeople className="w-4 h-4" />
                    Responsable: {warehouse.responsible}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <IoIosCube className="w-4 h-4" />
                    Productos: {warehouse.productsCount}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Capacidad Ocupada</span>
                    <span>{capacityPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${progressBarColor}`} style={{ width: `${capacityPercentage}%` }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{warehouse.capacityUsed} m³ de {warehouse.capacityTotal} m³</div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/inventario/stock/${warehouse.id}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform active:scale-[0.98] text-sm"
                  >
                    <IoIosStats className="w-4 h-4" />
                    Ver Stock
                  </Link>
                  <button
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 hover:bg-green-700 active:bg-green-800 transition-all duration-200 transform active:scale-[0.98] text-sm"
                  >
                    <IoIosPin className="w-4 h-4" />
                    Ubicaciones
                  </button>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}