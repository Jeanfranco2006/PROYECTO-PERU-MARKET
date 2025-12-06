import type { Cliente } from "../../types/clientes/Client";
import { formatDate } from "../../utils/format";
import { 
  FiCreditCard, 
  FiMail, 
  FiPhone, 
  FiCalendar, 
  FiEdit3, 
  FiTrash2,
  FiBriefcase,
  FiUser,
  FiMapPin
} from "react-icons/fi";

interface Props {
  data: Cliente;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ClienteCard({ data, onEdit, onDelete }: Props) {
  // Lógica de iniciales segura
  const iniciales = `${
    data.persona?.nombres?.charAt(0)?.toUpperCase() || ""
  }${data.persona?.apellidoPaterno?.charAt(0)?.toUpperCase() || ""}`;

  const fechaRegistro = data.fechaCreacion ? formatDate(data.fechaCreacion) : "N/A";
  const esJuridica = data.tipo === 'JURIDICA';

  // Configuración de tema (Sutil y Profesional)
  const theme = esJuridica 
    ? { 
        badgeBg: 'bg-indigo-50', 
        badgeText: 'text-indigo-700', 
        badgeBorder: 'border-indigo-100',
        avatarBg: 'bg-indigo-100',
        avatarText: 'text-indigo-600',
        icon: <FiBriefcase /> 
      }
    : { 
        badgeBg: 'bg-emerald-50', 
        badgeText: 'text-emerald-700', 
        badgeBorder: 'border-emerald-100',
        avatarBg: 'bg-emerald-100',
        avatarText: 'text-emerald-600',
        icon: <FiUser /> 
      };

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* --- BODY --- */}
      <div className="p-5 flex-1 flex flex-col">
        
        {/* HEADER: Avatar y Títulos */}
        <div className="flex items-start gap-4 mb-5">
          <div className={`
            flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm 
            ${theme.avatarBg} ${theme.avatarText}
          `}>
            {iniciales || theme.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <span className={`
                inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border
                ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}
              `}>
                {theme.icon}
                <span className="ml-1.5">{data.tipo}</span>
              </span>
            </div>
            
            <h3 
              className="mt-2 text-base font-bold text-slate-800 leading-tight truncate group-hover:text-indigo-600 transition-colors" 
              title={`${data.persona.nombres} ${data.persona.apellidoPaterno} ${data.persona.apellidoMaterno}`}
            >
              {data.persona.nombres} {data.persona.apellidoPaterno}
            </h3>
            
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {data.persona.apellidoMaterno}
            </p>
          </div>
        </div>

        {/* Separador punteado */}
        <div className="border-t border-dashed border-slate-200 mb-5"></div>

        {/* GRID DE DATOS */}
        <div className="grid grid-cols-1 gap-y-3">
          
          <div className="grid grid-cols-2 gap-4">
            <InfoItem 
              icon={<FiCreditCard />} 
              label={data.persona.tipoDocumento} 
              value={data.persona.numeroDocumento} 
            />
            <InfoItem 
              icon={<FiPhone />} 
              label="Teléfono" 
              value={data.persona.telefono} 
            />
          </div>

          <InfoItem 
            icon={<FiMail />} 
            label="Email" 
            value={data.persona.correo} 
            isEmail
          />

          <div className="grid grid-cols-2 gap-4 pt-1">
             <InfoItem 
              icon={<FiMapPin />} 
              label="Dirección" 
              value={data.persona.direccion} 
              truncate
            />
            <InfoItem 
              icon={<FiCalendar />} 
              label="Alta" 
              value={fechaRegistro} 
            />
          </div>

        </div>
      </div>

      {/* --- FOOTER (Acciones) --- */}
      <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-100 flex items-center justify-between backdrop-blur-sm">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
           ID: {data.id?.toString().padStart(4, '0')}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-md transition-all border border-transparent hover:border-slate-200"
            title="Editar cliente"
          >
            <FiEdit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={onDelete}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all border border-transparent hover:border-red-100"
            title="Eliminar cliente"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Subcomponente optimizado
const InfoItem = ({ 
  icon, 
  label, 
  value, 
  isEmail, 
  truncate 
}: { 
  icon: any, 
  label: string, 
  value?: string, 
  isEmail?: boolean,
  truncate?: boolean
}) => (
  <div className="flex flex-col min-w-0">
    <div className="flex items-center gap-1.5 mb-0.5 text-slate-400 group-hover:text-slate-500 transition-colors">
      <span className="text-xs">{icon}</span>
      <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
    </div>
    <span 
      className={`text-sm font-medium text-slate-700 block ${truncate || isEmail ? 'truncate' : ''}`} 
      title={value}
    >
      {value || <span className="text-slate-300 italic text-xs">--</span>}
    </span>
  </div>
);