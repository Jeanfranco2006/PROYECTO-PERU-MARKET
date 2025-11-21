import { FiUser, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

export const UsuariosTab = ({ 
  usuarios, 
  searchTerm, 
  statusFilter,
  onVerDetalles,
  onEditar,
  onEliminar,
  getNombreCompleto,
  getEstadoColor,
  getRolColor
}: {
  usuarios: any[];
  searchTerm: string;
  statusFilter: string;
  onVerDetalles: (usuario: any) => void;
  onEditar: (usuario: any) => void;
  onEliminar: (usuario: any) => void;
  getNombreCompleto: (persona: any) => string;
  getEstadoColor: (estado: string) => string;
  getRolColor: (rolNombre: string) => string;
}) => {
  
  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchesSearch = usuario.persona?.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.persona?.correo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || usuario.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Información Personal</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Último Acceso</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-blue-600" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">@{usuario.username}</p>
                      <p className="text-sm text-gray-500">{usuario.persona?.correo}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{getNombreCompleto(usuario.persona!)}</p>
                  <p className="text-sm text-gray-500">{usuario.persona?.tipo_documento} {usuario.persona?.numero_documento}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRolColor(usuario.rol?.nombre || '')} text-white`}>
                    {usuario.rol?.nombre}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(usuario.estado)}`}>
                    {usuario.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{usuario.ultimoAcceso}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onVerDetalles(usuario)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Ver detalles"
                    >
                      <FiEye size={16} />
                    </button>
                    <button 
                      onClick={() => onEditar(usuario)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Editar"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button 
                      onClick={() => onEliminar(usuario)}
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
        {usuariosFiltrados.map((usuario) => (
          <div key={usuario.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUser className="text-blue-600" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">@{usuario.username}</p>
                  <p className="text-sm text-gray-500">{getNombreCompleto(usuario.persona!)}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(usuario.estado)}`}>
                {usuario.estado}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <p className="text-gray-500">Documento</p>
                <p className="font-medium">{usuario.persona?.tipo_documento} {usuario.persona?.numero_documento}</p>
              </div>
              <div>
                <p className="text-gray-500">Rol</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRolColor(usuario.rol?.nombre || '')} text-white`}>
                  {usuario.rol?.nombre}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => onVerDetalles(usuario)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <FiEye size={14} /> Ver
              </button>
              <button 
                onClick={() => onEditar(usuario)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <FiEdit size={14} /> Editar
              </button>
              <button 
                onClick={() => onEliminar(usuario)}
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