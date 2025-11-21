import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  IoMdArrowRoundBack,
  IoIosPin,
  IoIosCube,
  IoIosStats,
  IoIosSearch
} from 'react-icons/io';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  status: 'Disponible' | 'Stock Bajo' | 'Sin Stock';
  price: number;
  sku: string;
  barcode: string;
  stock: number;
  minStock: number;
  maxStock: number;
  warehouse: string;
  location: string;
  cost: number;
  unit: string;
}

interface Warehouse {
  id: number;
  name: string;
  code: string;
  status: 'ACTIVO' | 'INACTIVO';
  address?: string;
}

const productData: Product[] = [
  {
    id: 1,
    name: "ANITA TALLARIN",
    description: "Ricos y deliciosos",
    category: "Fideos",
    status: "Disponible",
    price: 12.00,
    sku: "BULB-FA-001",
    barcode: "1234567890123",
    stock: 12,
    minStock: 5,
    maxStock: 50,
    warehouse: "Almacén Principal",
    location: "A-12-B-04",
    cost: 15.00,
    unit: "Unidad",
  },
  {
    id: 2,
    name: "LENTEJA VERDE",
    description: "Menestra de alta calidad",
    category: "Menestras",
    status: "Stock Bajo",
    price: 8.50,
    sku: "MENS-LV-002",
    barcode: "9876543210987",
    stock: 4,
    minStock: 5,
    maxStock: 30,
    warehouse: "Almacén Norte",
    location: "B-01-C-10",
    cost: 6.00,
    unit: "Kilogramo",
  },
  {
    id: 3,
    name: "RESISTENCIA M-10",
    description: "Resistencia electrónica 10 ohms",
    category: "Electrónicos",
    status: "Sin Stock",
    price: 5.00,
    sku: "ELEC-RM-003",
    barcode: "1122334455667",
    stock: 0,
    minStock: 10,
    maxStock: 100,
    warehouse: "Almacén Sur",
    location: "C-05-D-01",
    cost: 3.50,
    unit: "Unidad",
  },
];

const warehouseData: Warehouse[] = [
  { id: 1, name: "Almacén Principal", code: "ALM-PRIN", status: "ACTIVO", address: "Av. Industrial 123, Zona Industrial" },
  { id: 2, name: "Almacén Norte", code: "ALM-NORTE", status: "ACTIVO", address: "Av. Norte 456, Distrito Norte" },
  { id: 3, name: "Almacén Sur", code: "ALM-SUR", status: "ACTIVO", address: "Calle Sur 789, Urbanización Sur" },
];

export default function InventoryStockPorAlmacen() {
  const { id: warehouseIdParam } = useParams<{ id: string }>();
  const initialWarehouse = useMemo(() => {
    const id = warehouseIdParam ? parseInt(warehouseIdParam) : 1;
    return warehouseData.find(w => w.id === id) || warehouseData[0];
  }, [warehouseIdParam]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>(initialWarehouse);


  const filteredProducts = useMemo(() => {
    return productData.filter(product => {
      const matchesWarehouse = product.warehouse === selectedWarehouse?.name;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesWarehouse && matchesSearch;
    });
  }, [searchTerm, selectedWarehouse]);

  const totalStock = filteredProducts.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = filteredProducts.reduce((sum, p) => sum + p.stock * p.price, 0);

  const getStatusClasses = (stock: number, minStock: number): { text: string; color: string; } => {
    if (stock === 0) return { text: 'Sin Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= minStock) return { text: 'Stock Bajo', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Disponible', color: 'bg-green-100 text-green-800' };
  };

  const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    const newWarehouse = warehouseData.find(w => w.id === selectedId);
    if (newWarehouse) {
      setSelectedWarehouse(newWarehouse);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Link to="/inventario/almacenes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors transform active:scale-[0.95]">
            <IoMdArrowRoundBack className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock por Almacén</h1>
            <p className="text-gray-600">
              Visualización detallada de inventario en: <span className="font-semibold text-blue-600">{selectedWarehouse?.name || 'N/A'}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{filteredProducts.length}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IoIosCube className="w-5 h-5 text-purple-500" />
            <span>Productos Almacenados</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{totalStock}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IoIosStats className="w-5 h-5 text-indigo-600" />
            <span>Unidades Totales</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">S/{totalValue.toFixed(2)}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IoIosStats className="w-5 h-5 text-blue-600" />
            <span>Valor Total de Stock</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Ubicación principal</div>
          <div className="flex items-center gap-2 mt-1">
            <IoIosPin className="w-5 h-5 text-red-500" />
            <span className="text-lg font-bold text-gray-900">{selectedWarehouse?.code || 'N/A'}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{selectedWarehouse?.address || 'Sin dirección registrada'}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex items-center gap-3">
            <label className="block text-sm font-medium text-gray-700">Filtrar por Almacén:</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={selectedWarehouse?.id}
              onChange={handleWarehouseChange}
            >
              {warehouseData.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.code})
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 max-w-sm relative">
            <IoIosSearch className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              placeholder="Buscar Producto, SKU..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Mínimo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const status = getStatusClasses(product.stock, product.minStock);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                      <div className="text-xs text-gray-500">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                      {product.stock} {product.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-blue-600 font-semibold">
                      {product.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{product.minStock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-lg">
                  No se encontraron productos en el almacén "{selectedWarehouse?.name || 'N/A'}" con los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}