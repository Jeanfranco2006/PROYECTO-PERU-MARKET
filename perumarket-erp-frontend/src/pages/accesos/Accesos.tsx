// Accesos.tsx - VERSIÓN CONECTADA AL BACKEND
import { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiMenu, FiX, FiUser, FiLock, FiSettings, FiShield } from "react-icons/fi";
import { ModalDetalles, ModalEditar, ModalConfirmar, ModalPermisos } from "./AccesosModals";
import { SearchAndFilters } from "./AccesosComponents";
import { UsuariosTab } from "./AccesosUsuarios";
import { RolesTab } from "./AccesosRoles";
import { ModulosTab } from "./AccesosModulos";
import { accesosService } from "../../services/accesosService";

export default function Accesos() {
  const [tab, setTab] = useState("usuarios");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para datos reales del backend
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [modulos, setModulos] = useState<any[]>([]);
  const [roleModulePermissions, setRoleModulePermissions] = useState<any[]>([]);

  // Agregar este estado para roles del dropdown
const [rolesDropdown, setRolesDropdown] = useState<any[]>([]);

  // Estados para modales
  const [modalDetalles, setModalDetalles] = useState({ 
    isOpen: false, 
    titulo: "", 
    children: null as React.ReactNode 
  });
  
  const [modalEditar, setModalEditar] = useState({ 
    isOpen: false, 
    titulo: "", 
    fields: {} as any, 
    tipo: "" 
  });
  
  const [modalConfirmar, setModalConfirmar] = useState({ 
    isOpen: false, 
    titulo: "", 
    mensaje: "", 
    onConfirm: () => {}, 
    tipo: "eliminar" 
  });

  const [modalPermisos, setModalPermisos] = useState({ 
    isOpen: false, 
    rol: null as any, 
    permisos: [] as any[] 
  });

  // Cargar datos iniciales
useEffect(() => {
  cargarDatosIniciales();
}, []);

  const cargarDatosIniciales = async () => {
  setLoading(true);
  try {
    console.log('📥 Cargando datos del backend...');
    
    const [usuariosData, rolesData, modulosData, rolesDropdownData] = await Promise.all([
      accesosService.getUsuarios(),
      accesosService.getRoles(),
      accesosService.getModulos(),
      accesosService.getRolesForDropdown() // Nuevo: cargar roles para dropdown
    ]);

    console.log('✅ Datos cargados:', {
      usuarios: usuariosData.length,
      roles: rolesData.length,
      modulos: modulosData.length,
      rolesDropdown: rolesDropdownData.length
    });

    setUsuarios(usuariosData);
    setRoles(rolesData);
    setModulos(modulosData);
    setRolesDropdown(rolesDropdownData);

  } catch (error) {
    console.error('❌ Error cargando datos:', error);
    alert('Error al cargar los datos del servidor');
  } finally {
    setLoading(false);
  }
};

  const tabs = [
    { id: "usuarios", nombre: "Usuarios", icon: FiUser, count: usuarios.length },
    { id: "roles", nombre: "Roles", icon: FiLock, count: roles.length },
    { id: "modulos", nombre: "Módulos", icon: FiSettings, count: modulos.length }
  ];

  // Funciones de utilidad
  const getEstadoColor = (estado: string) => 
    estado === 'ACTIVO' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';
  
  const getRolColor = (rolNombre: string) => {
    const colors: { [key: string]: string } = {
      'Administrador': 'bg-blue-500',
      'Vendedor': 'bg-green-500',
      'Almacenero': 'bg-yellow-500',
      'Almacén': 'bg-yellow-500'
    };
    return colors[rolNombre] || 'bg-gray-500';
  };

  const getNombreCompleto = (persona: any) => 
    `${persona.nombres} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`;

  // ========== FUNCIONES USUARIOS ==========
  const verDetallesUsuario = (usuario: any) => {
    const p = usuario.persona;
    setModalDetalles({
      isOpen: true,
      titulo: `Detalles del Usuario`,
      children: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Información Personal</h3>
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                <p className="text-lg font-semibold">{getNombreCompleto(p)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Documento</label>
                  <p>{p?.tipoDocumento} - {p?.numeroDocumento}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha Nacimiento</label>
                  <p>{p?.fechaNacimiento}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Información de Contacto</h3>
              <div>
                <label className="text-sm font-medium text-gray-600">Correo Electrónico</label>
                <p className="text-blue-600">{p?.correo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Teléfono</label>
                <p>{p?.telefono}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Dirección</label>
                <p>{p?.direccion}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Información de Cuenta</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Usuario</label>
                  <p className="font-mono">@{usuario.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Rol</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRolColor(usuario.rol?.nombre || '')} text-white`}>
                    {usuario.rol?.nombre}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Estado</h3>
              <div>
                <label className="text-sm font-medium text-gray-600">Estado</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(usuario.estado)}`}>
                  {usuario.estado}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    });
  };

  const crearUsuario = () => {
  setModalEditar({
    isOpen: true,
    titulo: "Crear Nuevo Usuario",
    fields: {
      username: "",
      idRol: "",
      password: "",
      estado: "ACTIVO",
      tipoDocumento: "DNI",
      numeroDocumento: "",
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      correo: "",
      telefono: "",
      fechaNacimiento: "",
      direccion: ""
    },
    tipo: "usuario"
  });
};

  // Actualizar la función editarUsuario
const editarUsuario = (usuario: any) => {
  setModalEditar({
    isOpen: true,
    titulo: "Editar Usuario",
    fields: {
      id: usuario.id,
      username: usuario.username,
      idRol: usuario.rol.id, // Usar rol.id en lugar de id_rol
      password: "", // Se deja vacío para no mostrar la contraseña actual
      estado: usuario.estado,
      tipoDocumento: usuario.persona?.tipoDocumento || "DNI",
      numeroDocumento: usuario.persona?.numeroDocumento || "",
      nombres: usuario.persona?.nombres || "",
      apellidoPaterno: usuario.persona?.apellidoPaterno || "",
      apellidoMaterno: usuario.persona?.apellidoMaterno || "",
      correo: usuario.persona?.correo || "",
      telefono: usuario.persona?.telefono || "",
      fechaNacimiento: usuario.persona?.fechaNacimiento || "",
      direccion: usuario.persona?.direccion || ""
    },
    tipo: "usuario"
  });
};

  const guardarUsuario = async (formData: any) => {
    try {
      setLoading(true);
      
      if (formData.id) {
        // Actualizar usuario existente
        const usuarioActualizado = await accesosService.updateUsuario(formData.id, formData);
        setUsuarios(prev => prev.map(u => u.id === formData.id ? usuarioActualizado : u));
      } else {
        // Crear nuevo usuario
        const nuevoUsuario = await accesosService.createUsuario(formData);
        setUsuarios(prev => [...prev, nuevoUsuario]);
      }
      
      console.log('✅ Usuario guardado exitosamente');
    } catch (error: any) {
      console.error('❌ Error guardando usuario:', error);
      alert('Error al guardar usuario: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminarUsuario = (usuario: any) => {
    setModalConfirmar({
      isOpen: true,
      titulo: "Eliminar Usuario",
      mensaje: `¿Estás seguro de que deseas eliminar al usuario "${getNombreCompleto(usuario.persona!)}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        try {
          await accesosService.deleteUsuario(usuario.id);
          setUsuarios(prev => prev.filter(u => u.id !== usuario.id));
          console.log('✅ Usuario eliminado exitosamente');
        } catch (error: any) {
          console.error('❌ Error eliminando usuario:', error);
          alert('Error al eliminar usuario: ' + error.message);
        }
      },
      tipo: "eliminar"
    });
  };

  // ========== FUNCIONES ROLES ==========
  const verDetallesRol = (rol: any) => {
  setModalDetalles({
    isOpen: true,
    titulo: `Detalles del Rol`,
    children: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">Información del Rol</h3>
            <div>
              <label className="text-sm font-medium text-gray-600">Nombre del Rol</label>
              <p className="text-lg font-semibold">{rol.nombre}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Descripción</label>
              <p className="text-gray-700">{rol.descripcion}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">Estadísticas</h3>
            <div>
              <label className="text-sm font-medium text-gray-600">Usuarios con este Rol</label>
              <p className="text-2xl font-bold text-blue-600">{rol.usuariosCount || 0}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Módulos con Acceso</label>
              <p className="text-2xl font-bold text-green-600">{rol.modulosActivosCount || 0}</p>
            </div>
          </div>
        </div>
      </div>
    )
  });
};
  const crearRol = () => {
    setModalEditar({
      isOpen: true,
      titulo: "Crear Nuevo Rol",
      fields: {
        nombre: "",
        descripcion: ""
      },
      tipo: "rol"
    });
  };

  const editarRol = (rol: any) => {
  setModalEditar({
    isOpen: true,
    titulo: "Editar Rol",
    fields: {
      id: rol.id,
      nombre: rol.nombre,
      descripcion: rol.descripcion
    },
    tipo: "rol"
  });
};

  const guardarRol = async (formData: any) => {
  try {
    setLoading(true);
    
    if (formData.id) {
      // Actualizar rol existente
      const rolActualizado = await accesosService.updateRol(formData.id, formData);
      setRoles(prev => prev.map(r => r.id === formData.id ? rolActualizado : r));
    } else {
      // Crear nuevo rol
      const nuevoRol = await accesosService.createRol(formData);
      setRoles(prev => [...prev, nuevoRol]);
      // Actualizar también el dropdown de roles
      const nuevosRolesDropdown = await accesosService.getRolesForDropdown();
      setRolesDropdown(nuevosRolesDropdown);
    }
    
    console.log('✅ Rol guardado exitosamente');
  } catch (error: any) {
    console.error('❌ Error guardando rol:', error);
    alert('Error al guardar rol: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  const confirmarEliminarRol = (rol: any) => {
  setModalConfirmar({
    isOpen: true,
    titulo: "Eliminar Rol",
    mensaje: `¿Estás seguro de que deseas eliminar el rol "${rol.nombre}"? Los usuarios con este rol quedarán sin rol asignado.`,
    onConfirm: async () => {
      try {
        await accesosService.deleteRol(rol.id);
        setRoles(prev => prev.filter(r => r.id !== rol.id));
        // Actualizar también el dropdown de roles
        const nuevosRolesDropdown = await accesosService.getRolesForDropdown();
        setRolesDropdown(nuevosRolesDropdown);
        console.log('✅ Rol eliminado exitosamente');
      } catch (error: any) {
        console.error('❌ Error eliminando rol:', error);
        alert('Error al eliminar rol: ' + error.message);
      }
    },
    tipo: "eliminar"
  });
};

  // ========== FUNCIONES PERMISOS ==========
  const gestionarPermisos = async (rol: any) => {
  try {
    setLoading(true);
    const permisos = await accesosService.getPermissionsByRol(rol.id);
    
    setModalPermisos({
      isOpen: true,
      rol,
      permisos
    });
  } catch (error: any) {
    console.error('❌ Error cargando permisos:', error);
    alert('Error al cargar permisos: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  const guardarPermisos = async (permisos: any[]) => {
  try {
    setLoading(true);
    
    const request = {
      idRol: modalPermisos.rol.id,
      permissions: permisos
    };
    
    await accesosService.updatePermissions(request);
    
    // Actualizar el contador de módulos activos en el rol
    const modulosActivos = permisos.filter(p => p.hasAccess).length;
    setRoles(prev => prev.map(r => 
      r.id === modalPermisos.rol.id 
        ? { ...r, modulosActivosCount: modulosActivos }
        : r
    ));
    
    console.log('✅ Permisos guardados exitosamente');
  } catch (error: any) {
    console.error('❌ Error guardando permisos:', error);
    alert('Error al guardar permisos: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  // ========== FUNCIONES MÓDULOS ==========
  const verDetallesModulo = (modulo: any) => {
    setModalDetalles({
      isOpen: true,
      titulo: `Detalles del Módulo`,
      children: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Información del Módulo</h3>
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre</label>
                <p className="text-lg font-semibold">{modulo.nombre}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Descripción</label>
                <p className="text-gray-700">{modulo.descripcion}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Configuración</h3>
              <div>
                <label className="text-sm font-medium text-gray-600">Ruta</label>
                <p className="font-mono text-blue-600">{modulo.ruta}</p>
              </div>
            </div>
          </div>
        </div>
      )
    });
  };

  const crearModulo = () => {
    setModalEditar({
      isOpen: true,
      titulo: "Crear Nuevo Módulo",
      fields: {
        nombre: "",
        descripcion: "",
        ruta: ""
      },
      tipo: "modulo"
    });
  };

  const editarModulo = (modulo: any) => {
    setModalEditar({
      isOpen: true,
      titulo: "Editar Módulo",
      fields: {
        id: modulo.id,
        nombre: modulo.nombre,
        descripcion: modulo.descripcion,
        ruta: modulo.ruta
      },
      tipo: "modulo"
    });
  };

  const guardarModulo = async (formData: any) => {
    try {
      setLoading(true);
      
      if (formData.id) {
        const moduloActualizado = await accesosService.updateModulo(formData.id, formData);
        setModulos(prev => prev.map(m => m.id === formData.id ? moduloActualizado : m));
      } else {
        const nuevoModulo = await accesosService.createModulo(formData);
        setModulos(prev => [...prev, nuevoModulo]);
      }
      
      console.log('✅ Módulo guardado exitosamente');
    } catch (error: any) {
      console.error('❌ Error guardando módulo:', error);
      alert('Error al guardar módulo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminarModulo = (modulo: any) => {
    setModalConfirmar({
      isOpen: true,
      titulo: "Eliminar Módulo",
      mensaje: `¿Estás seguro de que deseas eliminar el módulo "${modulo.nombre}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        try {
          await accesosService.deleteModulo(modulo.id);
          setModulos(prev => prev.filter(m => m.id !== modulo.id));
          console.log('✅ Módulo eliminado exitosamente');
        } catch (error: any) {
          console.error('❌ Error eliminando módulo:', error);
          alert('Error al eliminar módulo: ' + error.message);
        }
      },
      tipo: "eliminar"
    });
  };

  // Función general para guardar
  const handleSaveFromModal = (formData: any) => {
    if (modalEditar.tipo === "usuario") guardarUsuario(formData);
    if (modalEditar.tipo === "rol") guardarRol(formData);
    if (modalEditar.tipo === "modulo") guardarModulo(formData);
  };

  if (loading && usuarios.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Accesos</h1>
            <p className="text-gray-600">Administra usuarios, roles y permisos del sistema</p>
          </div>
          
          {/* Botón de prueba de conexión */}
          <button 
            onClick={async () => {
              try {
                const result = await accesosService.testConnection();
                alert(result);
              } catch (error: any) {
                alert('Error: ' + error.message);
              }
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4 lg:mt-0"
          >
            Probar Conexión
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden mt-4 p-2 border rounded-lg hover:bg-gray-100 self-start"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-col lg:flex-row gap-2 mb-8">
          <div className="hidden lg:flex gap-2 bg-white p-2 rounded-lg shadow-sm border">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                  tab === t.id 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <t.icon size={18} />
                <span className="font-medium">{t.nombre}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  tab === t.id ? "bg-blue-500" : "bg-gray-200"
                }`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Mobile Tabs */}
          {mobileMenuOpen && (
            <div className="lg:hidden flex flex-col gap-2 bg-white p-4 rounded-lg shadow-lg border">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                    tab === t.id 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <t.icon size={18} />
                  <span className="font-medium">{t.nombre}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tab === t.id ? "bg-blue-500" : "bg-gray-200"
                  }`}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Guardando...</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-8">
          {/* USUARIOS */}
          {tab === "usuarios" && (
            <div>
              <SearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterOptions={
                  <>
                    <option value="">Todos los estados</option>
                    <option value="ACTIVO">Activos</option>
                    <option value="INACTIVO">Inactivos</option>
                  </>
                }
                onFilterChange={setStatusFilter}
                onAddNew={crearUsuario}
                addButtonText="Nuevo Usuario"
              />
              
              <UsuariosTab
                usuarios={usuarios}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onVerDetalles={verDetallesUsuario}
                onEditar={editarUsuario}
                onEliminar={confirmarEliminarUsuario}
                getNombreCompleto={getNombreCompleto}
                getEstadoColor={getEstadoColor}
                getRolColor={getRolColor}
              />
            </div>
          )}

          {/* ROLES */}
          {tab === "roles" && (
            <div>
              <SearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddNew={crearRol}
                addButtonText="Nuevo Rol"
              />
              
              <RolesTab
                roles={roles}
                searchTerm={searchTerm}
                onVerDetalles={verDetallesRol}
                onEditar={editarRol}
                onEliminar={confirmarEliminarRol}
                onGestionarPermisos={gestionarPermisos}
              />
            </div>
          )}

          {/* MÓDULOS */}
          {tab === "modulos" && (
            <div>
              <SearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddNew={crearModulo}
                addButtonText="Nuevo Módulo"
              />
              
              <ModulosTab
                modulos={modulos}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onVerDetalles={verDetallesModulo}
                onEditar={editarModulo}
                onEliminar={confirmarEliminarModulo}
                getEstadoColor={getEstadoColor}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <ModalDetalles
        isOpen={modalDetalles.isOpen}
        titulo={modalDetalles.titulo}
        children={modalDetalles.children}
        onClose={() => setModalDetalles({ isOpen: false, titulo: "", children: null })}
      />

      <ModalEditar
  isOpen={modalEditar.isOpen}
  titulo={modalEditar.titulo}
  fields={modalEditar.fields}
  onSave={handleSaveFromModal}
  onClose={() => setModalEditar({ isOpen: false, titulo: "", fields: {}, tipo: "" })}
  type={modalEditar.tipo}
  rolesDropdown={rolesDropdown} // Pasar los roles del dropdown
/>

      <ModalConfirmar
        isOpen={modalConfirmar.isOpen}
        titulo={modalConfirmar.titulo}
        mensaje={modalConfirmar.mensaje}
        onConfirm={modalConfirmar.onConfirm}
        onCancel={() => setModalConfirmar({ isOpen: false, titulo: "", mensaje: "", onConfirm: () => {}, tipo: "eliminar" })}
        tipo={modalConfirmar.tipo}
      />

      <ModalPermisos
        isOpen={modalPermisos.isOpen}
        rol={modalPermisos.rol}
        modulos={modulos}
        permisos={modalPermisos.permisos}
        onSave={guardarPermisos}
        onClose={() => setModalPermisos({ isOpen: false, rol: null, permisos: [] })}
      />
    </div>
  );
}