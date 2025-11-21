import { FiSettings, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

export const ModulosTab = ({ 
  modulos, 
  searchTerm,
  statusFilter,
  onVerDetalles,
  onEditar,
  onEliminar,
  getEstadoColor
}: {
  modulos: any[];
  searchTerm: string;
  statusFilter: string;
  onVerDetalles: (modulo: any) => void;
  onEditar: (modulo: any) => void;
  onEliminar: (modulo: any) => void;
  getEstadoColor: (estado: string) => string;
}) => {
  
  const modulosFiltrados = modulos.filter(modulo => {
    const matchesSearch = modulo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modulo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modulo.ruta.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || modulo.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Módulo</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ruta</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {modulosFiltrados.map((modulo) => (
              <tr key={modulo.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiSettings className="text-blue-600" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{modulo.nombre}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-600">{modulo.descripcion}</p>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">{modulo.ruta}</code>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(modulo.estado)}`}>
                    {modulo.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onVerDetalles(modulo)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Ver detalles"
                    >
                      <FiEye size={16} />
                    </button>
                    <button 
                      onClick={() => onEditar(modulo)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Editar"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button 
                      onClick={() => onEliminar(modulo)}
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
        {modulosFiltrados.map((modulo) => (
          <div key={modulo.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiSettings className="text-blue-600" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{modulo.nombre}</p>
                  <p className="text-sm text-gray-500">{modulo.descripcion}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(modulo.estado)}`}>
                {modulo.estado}
              </span>
            </div>
            
            <div className="mb-3">
              <p className="text-gray-500 text-sm">Ruta</p>
              <code className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">{modulo.ruta}</code>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => onVerDetalles(modulo)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <FiEye size={14} /> Ver
              </button>
              <button 
                onClick={() => onEditar(modulo)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <FiEdit size={14} /> Editar
              </button>
              <button 
                onClick={() => onEliminar(modulo)}
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