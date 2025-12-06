import { useMemo, useState } from "react";
import type { Employee } from "../../types/Employee";
import { formatDate } from "../../utils/format";
import { 
  FiMapPin, 
  FiMail, 
  FiPhone, 
  FiCalendar,
  FiEdit3,
  FiTrash2,
  FiCreditCard,
  FiBriefcase,
  FiMoreHorizontal
} from "react-icons/fi";

interface Props {
  data: Employee;
  onEdit: () => void;
  onDelete: () => void;
}

export default function EmployeeCard({ data, onEdit, onDelete }: Props) {
  const [imageError, setImageError] = useState(false);

  // --- Lógica Original (Intacta) ---
  const nombreCompleto = useMemo(() => 
    `${data.persona.nombres} ${data.persona.apellidoPaterno}`, 
  [data.persona]);

  const isValidFoto = useMemo(() => {
    if (!data.foto || imageError) return false;
    if (data.foto.startsWith('blob:')) return false; 
    return (data.foto.startsWith('http') || data.foto.startsWith('data:image/'));
  }, [data.foto, imageError]);

  const estadoInfo = useMemo(() => {
    const estado = data.estado?.toLowerCase();
    switch(estado) {
      case "activo":
        return { label: 'Activo', color: "text-emerald-700 bg-emerald-50 border-emerald-100 ring-emerald-500/20" };
      case "inactivo":
        return { label: 'Inactivo', color: "text-slate-600 bg-slate-50 border-slate-200 ring-slate-500/20" };
      case "vacaciones":
        return { label: 'Vacaciones', color: "text-blue-700 bg-blue-50 border-blue-100 ring-blue-500/20" };
      case "licencia":
        return { label: 'Licencia', color: "text-amber-700 bg-amber-50 border-amber-100 ring-amber-500/20" };
      default:
        return { label: 'Desconocido', color: "text-slate-500 bg-slate-50 border-slate-200 ring-slate-500/20" };
    }
  }, [data.estado]);

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      
      {/* --- HEADER VISUAL (Cover) --- */}
      <div className="h-28 w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 relative">
        {/* Patrón decorativo moderno */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        {/* Badge Flotante (Glassmorphism) */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border shadow-sm ring-1 backdrop-blur-md ${estadoInfo.color}`}>
            {estadoInfo.label}
          </span>
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="px-6 flex-1 flex flex-col relative">
        
        {/* Avatar Superpuesto con anillo grueso */}
        <div className="-mt-12 mb-4 flex justify-between items-end">
          <div className="relative rounded-2xl p-1 bg-white shadow-sm ring-1 ring-slate-100">
            <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-50 relative">
              {isValidFoto ? (
                <img 
                  src={data.foto} 
                  alt={nombreCompleto} 
                  onError={() => setImageError(true)}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400">
                  <span className="text-2xl font-bold tracking-tight">
                    {data.persona.nombres.charAt(0)}{data.persona.apellidoPaterno.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Sueldo (Pill discreto al lado del avatar) */}
          {data.sueldo && (
             <div className="mb-1 hidden sm:block">
               <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                 S/. {data.sueldo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
               </span>
             </div>
          )}
        </div>

        {/* Info Principal: Nombre y Cargo */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors truncate" title={nombreCompleto}>
            {nombreCompleto}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-slate-500">
            <FiBriefcase className="w-4 h-4 text-indigo-400" />
            <p className="text-sm font-medium truncate">{data.puesto || "Sin cargo asignado"}</p>
          </div>
        </div>

        {/* Separador punteado */}
        <div className="border-t border-dashed border-slate-200 mb-5"></div>

        {/* Grid de Datos (Layout más limpio) */}
        <div className="space-y-4">
          
          {/* Fila 1: Departamento & DNI */}
          <div className="grid grid-cols-2 gap-4">
            <InfoItem 
              icon={<FiMapPin />} 
              label="Área" 
              value={data.departamento?.nombre} 
              delay="0"
            />
            <InfoItem 
              icon={<FiCreditCard />} 
              label="DNI" 
              value={data.persona.numeroDocumento} 
              mono
              delay="75"
            />
          </div>

          {/* Fila 2: Contacto */}
          <div className="space-y-3">
             <InfoItem 
                icon={<FiMail />} 
                label="Email Corporativo" 
                value={data.persona.correo} 
                isEmail
                delay="150"
             />
             <div className="grid grid-cols-2 gap-4">
                <InfoItem 
                  icon={<FiPhone />} 
                  label="Teléfono" 
                  value={data.persona.telefono} 
                  delay="225"
                />
                <InfoItem 
                  icon={<FiCalendar />} 
                  label="Ingreso" 
                  value={data.fechaContratacion ? formatDate(data.fechaContratacion) : "N/A"} 
                  delay="300"
                />
             </div>
          </div>
        </div>

        {/* Espaciador flexible para empujar el footer al fondo si el card crece */}
        <div className="flex-grow min-h-[20px]"></div>
      </div>

      {/* --- FOOTER DE ACCIONES --- */}
      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center gap-3 backdrop-blur-sm">
        <button
          onClick={onEdit}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg shadow-sm hover:bg-indigo-600 hover:shadow-indigo-200 hover:shadow-md transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiEdit3 className="w-4 h-4 mr-2" />
          Administrar
        </button>

        <button
          onClick={onDelete}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          title="Eliminar registro"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// --- Subcomponente de Info Modernizado ---
const InfoItem = ({ icon, label, value, isEmail, mono, delay }: any) => (
  <div 
    className="flex items-start gap-3 group/item"
  >
    {/* Icono encapsulado con fondo suave */}
    <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:text-indigo-500 group-hover/item:border-indigo-100 group-hover/item:bg-indigo-50 transition-colors">
      <div className="w-3.5 h-3.5">{icon}</div>
    </div>
    
    <div className="min-w-0 flex-1">
      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">
        {label}
      </p>
      <p 
        className={`text-sm font-medium text-slate-700 leading-tight
          ${isEmail ? 'truncate hover:text-clip hover:whitespace-normal break-all' : 'truncate'}
          ${mono ? 'font-mono tracking-tight text-slate-600' : ''}
        `} 
        title={value || ""}
      >
        {value || <span className="text-slate-300 italic text-xs">Sin datos</span>}
      </p>
    </div>
  </div>
);