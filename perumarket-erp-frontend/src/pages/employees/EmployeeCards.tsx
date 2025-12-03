import type { Employee } from "../../types/Employee";
import { formatDate } from "../../utils/format";
import { 
  FiMapPin, 
  FiCreditCard, 
  FiMail, 
  FiPhone, 
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiUser
} from "react-icons/fi";
import { useState, useMemo } from "react";

interface Props {
  data: Employee;
  onEdit: () => void;
  onDelete: () => void;
}

export default function EmployeeCard({ data, onEdit, onDelete }: Props) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Memoizar las iniciales para evitar cálculos innecesarios en cada render
  const iniciales = useMemo(() => {
    return `${
      data.persona?.nombres?.charAt(0)?.toUpperCase() || "?"
    }${
      data.persona?.apellidoPaterno?.charAt(0)?.toUpperCase() || "?"
    }`;
  }, [data.persona?.nombres, data.persona?.apellidoPaterno]);

  // Memoizar el nombre completo
  const nombreCompleto = useMemo(() => {
    return `${data.persona.nombres} ${data.persona.apellidoPaterno}`;
  }, [data.persona.nombres, data.persona.apellidoPaterno]);

  // Determinar si la foto es válida para mostrar
  // IMPORTANTE: No mostrar URLs blob en la lista de tarjetas
  const isValidFoto = useMemo(() => {
  if (!data.foto) return false;
  
  // NO mostrar URLs blob - solo son válidas temporalmente
  if (data.foto.startsWith('blob:')) {
    return false;
  }
    
    // Solo mostrar URLs HTTP/HTTPS válidas o data URLs de imágenes
    return (
      data.foto.startsWith('http://') || 
      data.foto.startsWith('https://') || 
      data.foto.startsWith('data:image/')
    );
  }, [data.foto]);

  // Función para manejar errores de carga de imagen
  const handleImageError = () => {
    setImageError(true);
  };

  // Badges con diseño moderno y mejor semántica
  const estadoInfo = useMemo(() => {
    const isActivo = data.estado === "ACTIVO" || data.estado === "activo";
    return {
      isActivo,
      label: isActivo ? 'Activo' : 'Inactivo',
      badgeClass: isActivo
        ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
        : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
      iconClass: isActivo ? "text-emerald-500" : "text-amber-500"
    };
  }, [data.estado]);

  // Formatear información de contacto para tooltips
  const contactInfo = useMemo(() => ({
    email: data.persona.correo || "No disponible",
    phone: data.persona.telefono || "No disponible",
    dni: data.persona.numeroDocumento || "No disponible",
    department: data.departamento?.nombre || "Sin departamento",
    hireDate: data.fechaContratacion ? formatDate(data.fechaContratacion) : "N/A"
  }), [data]);

  return (
    <div 
      className="bg-white overflow-hidden rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full hover:border-indigo-200 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* HEADER con gradiente sutil al hover */}
      <div className={`p-5 border-b border-slate-100 flex items-start justify-between transition-colors duration-300 ${
        isHovered ? 'bg-gradient-to-r from-white to-indigo-50/30' : ''
      }`}>
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 relative">
            {/* Avatar con anillo de estado */}
            <div className="relative">
              {isValidFoto && !imageError ? (
                <>
                  <img 
                    src={data.foto} 
                    alt={`Avatar de ${nombreCompleto}`} 
                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-300"
                    onError={handleImageError}
                    loading="lazy"
                  />
                  {/* Indicador de estado en el avatar */}
                  <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                    estadoInfo.isActivo ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}></div>
                </>
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <FiUser className="h-5 w-5" />
                </div>
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-slate-900 leading-tight truncate">
              {nombreCompleto}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5 truncate" title={data.puesto}>
              {data.puesto || "Sin puesto definido"}
            </p>
            {/* Información adicional en hover */}
            {isHovered && (
              <div className="mt-2 text-xs text-slate-400 opacity-0 animate-fade-in" style={{ animationDuration: '200ms' }}>
                ID: {data.empleadoId || 'Nuevo'}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${estadoInfo.badgeClass}`}>
            <div className={`h-1.5 w-1.5 rounded-full ${estadoInfo.iconClass}`}></div>
            {estadoInfo.label}
          </span>
        </div>
      </div>

      {/* INFO BODY */}
      <div className="px-5 py-5 flex-1 space-y-4">
        <div className="space-y-3">
          {/* Departamento */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FiMapPin className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-slate-500 font-medium">Departamento</div>
              <div className="text-sm font-medium text-slate-900 truncate" title={contactInfo.department}>
                {contactInfo.department}
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <FiMail className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-slate-500 font-medium">Email</div>
                <div className="text-sm font-medium text-slate-900 truncate" title={contactInfo.email}>
                  {contactInfo.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <FiPhone className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-slate-500 font-medium">Teléfono</div>
                <div className="text-sm font-medium text-slate-900" title={contactInfo.phone}>
                  {contactInfo.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-slate-100 text-slate-600">
                <FiCreditCard className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-xs text-slate-500">DNI</div>
                <div className="text-sm font-medium text-slate-900 font-mono">
                  {contactInfo.dni}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-purple-50 text-purple-600">
                <FiCalendar className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-xs text-slate-500">Ingreso</div>
                <div className="text-sm font-medium text-slate-900">
                  {contactInfo.hireDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS con efecto hover mejorado */}
      <div className="bg-gradient-to-t from-slate-50 to-white px-5 py-3.5 border-t border-slate-200 flex justify-between items-center">
        <div className="text-xs text-slate-500">
          Sueldo: <span className="font-semibold text-slate-700">S/. {data.sueldo?.toFixed(2) || "0.00"}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded-lg px-3 py-1.5 hover:bg-indigo-50"
            title="Editar empleado"
          >
            <FiEdit2 className="h-4 w-4" />
            <span className="hidden sm:inline">Editar</span>
          </button>
          <div className="h-4 w-px bg-slate-300"></div>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded-lg px-3 py-1.5 hover:bg-red-50"
            title="Eliminar empleado"
          >
            <FiTrash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
}