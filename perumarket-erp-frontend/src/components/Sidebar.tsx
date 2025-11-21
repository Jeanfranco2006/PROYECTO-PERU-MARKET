import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FiHome,
  FiUsers,
  FiMenu,
  FiUserCheck,
  FiUser,
  FiBox,
  FiShoppingCart,
  FiClipboard,
  FiTruck,
  FiArchive,
  FiBarChart2,
  FiLogOut,
  FiX
} from "react-icons/fi";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  // Configuración de touch para deslizar
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && mobileOpen) {
      setMobileOpen(false);
    }
    if (isRightSwipe && !mobileOpen) {
      setMobileOpen(true);
    }
  };

  // Cerrar sidebar móvil al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileOpen]);

  // Cerrar sidebar móvil al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  // Agregar event listener para gestos en toda la pantalla
  useEffect(() => {
    const handleGlobalTouchStart = (e) => {
      if (!mobileOpen) {
        setTouchEnd(null);
        setTouchStart(e.touches[0].clientX);
      }
    };

    const handleGlobalTouchMove = (e) => {
      if (!mobileOpen) {
        setTouchEnd(e.touches[0].clientX);
      }
    };

    const handleGlobalTouchEnd = () => {
      if (!mobileOpen && touchStart && touchEnd) {
        const distance = touchStart - touchEnd;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isRightSwipe) {
          setMobileOpen(true);
        }
      }
    };

    document.addEventListener('touchstart', handleGlobalTouchStart);
    document.addEventListener('touchmove', handleGlobalTouchMove);
    document.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleGlobalTouchStart);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [mobileOpen, touchStart, touchEnd]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { to: "/dashboard", icon: FiHome, label: "Dashboard" },
    { to: "/accesos", icon: FiUsers, label: "Accesos" },
    { to: "/empleados", icon: FiUserCheck, label: "Empleados" },
    { to: "/clientes", icon: FiUser, label: "Clientes" },
    { to: "/inventario", icon: FiBox, label: "Inventario" },
    { to: "/ventas", icon: FiShoppingCart, label: "Ventas" },
    { to: "/pedidos", icon: FiClipboard, label: "Pedidos" },
    { to: "/compras", icon: FiArchive, label: "Compras" },
    { to: "/proveedores", icon: FiUsers, label: "Proveedores" },
    { to: "/envios", icon: FiTruck, label: "Envíos" },
    { to: "/report", icon: FiBarChart2, label: "Reportes" },
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar para desktop */}
      <div className="hidden lg:block">
        <div
          className={`bg-black text-white h-screen p-4 flex flex-col justify-between transition-all duration-300 ${
            open ? "w-64" : "w-20"
          }`}
        >
          {/* ----- TOP SECTION ----- */}
          <div>
            <button
              onClick={() => setOpen(!open)}
              className="text-white mb-6 text-xl hover:bg-gray-800 p-2 rounded-lg transition-colors"
            >
              <FiMenu />
            </button>

            <div className="flex items-center gap-3 mb-10">
              <img src="/logo.png" className="w-10 h-10 rounded-full" alt="Logo" />
              {open && <h1 className="text-xl font-bold">PERU MARKET</h1>}
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link 
                  key={item.to}
                  to={item.to} 
                  className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {open && <span className="group-hover:text-gray-200">{item.label}</span>}
                </Link>
              ))}
            </nav>
          </div>

          {/* ----- LOGOUT BOTTOM SECTION ----- */}
          <div className="mt-8">
            <button
              onClick={logout}
              className="flex items-center gap-3 p-3 w-full hover:bg-red-600 bg-red-500 rounded-lg transition-colors group"
            >
              <FiLogOut size={20} className="flex-shrink-0" />
              {open && <span className="group-hover:text-white">Cerrar sesión</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar para móvil */}
      <div className="lg:hidden">
        {/* Botón flotante para abrir sidebar en móvil */}
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-30 bg-black text-white p-3 rounded-full shadow-lg lg:hidden"
        >
          <FiMenu size={20} />
        </button>

        {/* Sidebar móvil */}
        <div
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-full bg-black text-white z-50 flex flex-col justify-between transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          } w-64`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex flex-col h-full">
            {/* ----- TOP SECTION ----- */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                {/* Header móvil */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" className="w-8 h-8 rounded-full" alt="Logo" />
                    <h1 className="text-lg font-bold">PERU MARKET</h1>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Menú móvil */}
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <Link 
                      key={item.to}
                      to={item.to} 
                      className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors group"
                      onClick={() => setMobileOpen(false)}
                    >
                      <item.icon size={18} className="flex-shrink-0" />
                      <span className="group-hover:text-gray-200 text-sm">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* ----- LOGOUT BOTTOM SECTION ----- */}
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={logout}
                className="flex items-center justify-center gap-3 p-3 w-full hover:bg-red-600 bg-red-500 rounded-lg transition-colors group"
              >
                <FiLogOut size={18} className="flex-shrink-0" />
                <span className="group-hover:text-white text-sm">Cerrar sesión</span>
              </button>
            </div>
          </div>

          {/* Indicador de deslizamiento */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-gray-500 rounded-l-lg">
            <div className="w-full h-full bg-gray-300 rounded-l-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Indicador de swipe para móvil - Solo mostrar cuando el menú está cerrado */}
      {!mobileOpen && (
        <div className="lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-4 py-2 rounded-full text-xs">
          ← Desliza desde el borde para abrir →
        </div>
      )}
    </>
  );
}