import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Accesos from "./pages/accesos/Accesos";
import Proveedores from "./pages/proveedores/proveedores";
import VentasList from "./pages/ventas/ventaslist";
import PedidosList from "./pages/pedidos/pedidosList";
import Reportes from "./pages/reportes/reportes";
import Inventory from "./pages/Inventory/Inventory";
import InventoryAddProduct from "./pages/Inventory/InventoryAddProduct";
import InventoryMovements from "./pages/Inventory/InventoryMovements";
import WarehouseManagement from "./pages/Inventory/InventoryAlmacenes";
import InventoryAddAlmacenes from "./pages/Inventory/InventoryAddAlmacenes";
import InventoryEditProduct from "./pages/Inventory/InventoryEditProduct";
import Envios from "./pages/envios/envios";
import PurchaseHistory from "./pages/Purchase/PurchaseHistory";
import PurchaseList from "./pages/Purchase/PurchaseList";
import NewPurchase from "./pages/Purchase/Purchase";
import InventoryStockPorAlmacen from "./pages/Inventory/InventoryStockPorAlmacen";
import AppClientes from "./pages/Clients/AppClients";
import AppEmployees from "./pages/employees/AppEmployees";
// Importa el nuevo componente de prueba
import TestConnection from "./pages/TestConnection";

function App() {
  const location = useLocation();
  const hideLayout = location.pathname === "/login" || location.pathname === "/";

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Mostrar Sidebar solo si NO estamos en Login */}
      {!hideLayout && <Sidebar />}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header también oculto en Login */}
        {!hideLayout && <Header />}

        {/* Contenedor principal sin padding cuando es login */}
        <div className={hideLayout ? "" : "p-4 overflow-auto flex-1"}>

          <Routes>
            {/* Redirección por defecto al login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* LOGIN */}
            <Route path="/login" element={<Login />} />

            {/* RUTA DE PRUEBA - No necesita protección para probar conexión */}
            <Route path="/test-connection" element={<TestConnection />} />

            {/* RUTAS PROTEGIDAS */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/accesos"
              element={
                <ProtectedRoute>
                  <Accesos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/proveedores"
              element={
                <ProtectedRoute>
                  <Proveedores />
                </ProtectedRoute>
              }
            />

            <Route
              path="/clientes"
              element={
                <ProtectedRoute>
                  <AppClientes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/empleados"
              element={
                <ProtectedRoute>
                  <AppEmployees />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ventas"
              element={
                <ProtectedRoute>
                  <VentasList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pedidos"
              element={
                <ProtectedRoute>
                  <PedidosList />
                </ProtectedRoute>
              }
            />
           

            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <Reportes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inventario"
              element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/envios"
              element={
                <ProtectedRoute>
                  <Envios />
                </ProtectedRoute>
              }
            />

            <Route
              path="/compras"
              element={
                <ProtectedRoute>
                  <PurchaseHistory />
                </ProtectedRoute>
              }
            />

            <Route path="/compras/historial" element={<PurchaseList />} /> 
            <Route path="/compras/nueva" element={<NewPurchase />} /> 

            <Route path="/inventario/nuevo" element={<InventoryAddProduct />} />
            <Route path="/inventario/editar/:id" element={<InventoryEditProduct />} />
            <Route path="/inventario/movimientos/:id" element={<InventoryMovements />} />
            <Route path="/inventario/almacenes" element={<WarehouseManagement />} />
            <Route path="/inventario/almacenes/nuevo" element={<InventoryAddAlmacenes />} />
            <Route path="/inventario/stock/:id" element={<InventoryStockPorAlmacen />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;