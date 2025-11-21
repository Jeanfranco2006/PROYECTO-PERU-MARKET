import { FiLock, FiEye, FiEdit, FiTrash2, FiShield } from "react-icons/fi";

export const RolesTab = ({ 
  roles, 
  searchTerm,
  onVerDetalles,
  onEditar,
  onEliminar,
  onGestionarPermisos
}: {
  roles: any[];
  searchTerm: string;
  onVerDetalles: (rol: any) => void;
  onEditar: (rol: any) => void;
  onEliminar: (rol: any) => void;
  onGestionarPermisos: (rol: any) => void;
}) => {
  
  const rolesFiltrados = roles.filter(rol =>
    rol.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rol.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuarios</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Módulos Activos</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rolesFiltrados.map((rol) => (
              <tr key={rol.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiLock className="text-blue-600" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{rol.nombre}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-600">{rol.descripcion}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {rol.usuarios_count || 0} usuarios
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {rol.modulos_activos || 0} módulos
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onVerDetalles(rol)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Ver detalles"
                    >
                      <FiEye size={16} />
                    </button>
                    <button 
                      onClick={() => onGestionarPermisos(rol)}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      title="Gestionar permisos"
                    >
                      <FiShield size={16} />
                    </button>
                    <button 
                      onClick={() => onEditar(rol)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Editar"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button 
                      onClick={() => onEliminar(rol)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden p-4 space-y-4">
        {rolesFiltrados.map((rol) => (
          <div key={rol.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiLock className="text-blue-600" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{rol.nombre}</p>
                  <p className="text-sm text-gray-500">{rol.descripcion}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <p className="text-gray-500">Usuarios</p>
                <p className="font-medium">{rol.usuarios_count || 0} usuarios</p>
              </div>
              <div>
                <p className="text-gray-500">Módulos Activos</p>
                <p className="font-medium">{rol.modulos_activos || 0} módulos</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => onVerDetalles(rol)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <FiEye size={14} /> Ver
              </button>
              <button 
                onClick={() => onGestionarPermisos(rol)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <FiShield size={14} /> Permisos
              </button>
              <button 
                onClick={() => onEditar(rol)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <FiEdit size={14} /> Editar
              </button>
              <button 
                onClick={() => onEliminar(rol)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <FiTrash2 size={14} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};