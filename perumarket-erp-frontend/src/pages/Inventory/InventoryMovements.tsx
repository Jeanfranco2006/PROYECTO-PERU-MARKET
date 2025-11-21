import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function InventoryMovements() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <a href="/inventario">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
            </button>
          </a>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Movimientos de Inventario</h1>
            <p className="text-gray-600">Producto #2 - FIBRE AIRS Professional</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 transform active:scale-[0.98]"
          >
            Filtrar
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 transform active:scale-[0.98]"
          >
            Exportar
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">120</div>
          <div className="text-gray-600">Total Movimientos</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">+80</div>
          <div className="text-gray-600">Entradas</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">-25</div>
          <div className="text-gray-600">Salidas</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">55</div>
          <div className="text-gray-600">Stock Actual</div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 divide-y divide-gray-200">
        <div className="py-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                ENTRADA
              </span>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                COMPRA
              </span>
            </div>
            <span className="text-sm text-gray-500">2024-11-15 10:30:00</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
            <div>
              <span className="text-sm text-gray-600">Cantidad:</span>
              <div className="font-semibold text-green-600">+10</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Stock Anterior:</span>
              <div className="font-semibold">45</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Stock Nuevo:</span>
              <div className="font-semibold">55</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Usuario:</span>
              <div className="font-semibold">almacenero01</div>
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Nota:</span>
            <p className="text-gray-800 text-sm italic">Ingreso de la OC #902, recibida por el proveedor A. Lote: LOTE-2024-11</p>
          </div>
        </div>

        <div className="py-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                SALIDA
              </span>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                VENTAS
              </span>
            </div>
            <span className="text-sm text-gray-500">2024-11-14 15:15:00</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
            <div>
              <span className="text-sm text-gray-600">Cantidad:</span>
              <div className="font-semibold text-red-600">-10</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Stock Anterior:</span>
              <div className="font-semibold">90</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Stock Nuevo:</span>
              <div className="font-semibold">80</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Usuario:</span>
              <div className="font-semibold">vendedor01</div>
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Nota:</span>
            <p className="text-gray-800 text-sm italic">Despacho de venta a cliente X. Comprobante V001-00123.</p>
          </div>
        </div>
      </div>
    </div>
  );
}