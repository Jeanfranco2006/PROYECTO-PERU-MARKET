import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalVentas: 0,
    totalClientes: 0,
    stockBajo: 0,
    ventasHoy: 0,
    productosSinCodigo: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);

  // Datos de ejemplo (en un caso real vendrían de la API)
  useEffect(() => {
    // Simular carga de datos
    setStats({
      totalProductos: 156,
      totalVentas: 23450,
      totalClientes: 89,
      stockBajo: 12,
      ventasHoy: 3450,
      productosSinCodigo: 8
    });

    setRecentActivities([
      { id: 1, action: 'Nueva venta registrada', user: 'Juan Pérez', time: 'Hace 5 min', type: 'venta' },
      { id: 2, action: 'Producto agregado al inventario', user: 'María García', time: 'Hace 15 min', type: 'inventario' },
      { id: 3, action: 'Código de barras generado', user: 'Carlos López', time: 'Hace 30 min', type: 'codigo' },
      { id: 4, action: 'Compra desde proveedor', user: 'Ana Torres', time: 'Hace 1 hora', type: 'compra' }
    ]);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'venta': return '💰';
      case 'inventario': return '📦';
      case 'codigo': return '📊';
      case 'compra': return '🛒';
      default: return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'venta': return 'bg-green-100 text-green-800';
      case 'inventario': return 'bg-blue-100 text-blue-800';
      case 'codigo': return 'bg-purple-100 text-purple-800';
      case 'compra': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard PeruMarket ERP</h1>
        <p className="text-gray-600 mt-2">Sistema integrado de gestión empresarial con códigos de barras</p>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Productos */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProductos}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">📦</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">En inventario activo</p>
        </div>

        {/* Ventas del Día */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas Hoy</p>
              <p className="text-2xl font-bold text-gray-900">S/. {stats.ventasHoy.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Ingresos del día de hoy</p>
        </div>

        {/* Total Clientes */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClientes}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Clientes registrados</p>
        </div>

        {/* Stock Bajo */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
              <p className="text-2xl font-bold text-gray-900">{stats.stockBajo}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Productos por reabastecer</p>
        </div>

        {/* Productos sin Código */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sin Código Barras</p>
              <p className="text-2xl font-bold text-gray-900">{stats.productosSinCodigo}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <span className="text-2xl">📋</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Requieren código de barras</p>
        </div>

        {/* Total Ventas */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas Totales</p>
              <p className="text-2xl font-bold text-gray-900">S/. {stats.totalVentas.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Acumulado mensual</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Actividad Reciente */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
            <span className="text-sm text-gray-500">Últimas 24 horas</span>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  <span className="text-lg">{getActivityIcon(activity.type)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Módulos del Sistema */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Módulos del Sistema</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Inventario */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📦</span>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Inventario</h3>
                  <p className="text-xs text-blue-700">Gestión de stock</p>
                </div>
              </div>
            </div>

            {/* Códigos de Barras */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900">Códigos Barras</h3>
                  <p className="text-xs text-purple-700">Generación y escaneo</p>
                </div>
              </div>
            </div>

            {/* Ventas */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">💰</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Ventas</h3>
                  <p className="text-xs text-green-700">Punto de venta</p>
                </div>
              </div>
            </div>

            {/* Compras */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🛒</span>
                </div>
                <div>
                  <h3 className="font-semibold text-orange-900">Compras</h3>
                  <p className="text-xs text-orange-700">Gestión proveedores</p>
                </div>
              </div>
            </div>

            {/* Clientes */}
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">👥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-900">Clientes</h3>
                  <p className="text-xs text-indigo-700">Gestión de clientes</p>
                </div>
              </div>
            </div>

            {/* Reportes */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📈</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900">Reportes</h3>
                  <p className="text-xs text-red-700">Análisis y métricas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Nueva Venta
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            Registrar Producto
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
            Generar Códigos
          </button>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
            Nueva Compra
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
            Ver Reportes
          </button>
        </div>
      </div>
    </div>
  );
}