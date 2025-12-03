import { FaSearch, FaIdCard, FaFilter, FaTimes } from "react-icons/fa";

interface Props {
  filters: {
    texto: string;
    estado: string;
    dni: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function EmployeeSearchBar({ filters, onChange }: Props) {
  
  const inputClass = "w-full pl-10 pr-8 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-slate-400 text-slate-900 bg-white shadow-sm transition-all";
  const iconClass = "h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Input Texto Principal */}
        <div className="md:col-span-2 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className={iconClass} />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            className={inputClass}
            value={filters.texto}
            onChange={(e) => onChange("texto", e.target.value)}
          />
          {filters.texto && (
            <button onClick={() => onChange("texto", "")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
               <FaTimes className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Input DNI */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaIdCard className={iconClass} />
          </div>
          <input
            type="text"
            placeholder="N° Documento"
            className={inputClass}
            value={filters.dni}
            onChange={(e) => onChange("dni", e.target.value)}
            maxLength={12}
          />
        </div>

        {/* Select Estado */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFilter className={iconClass} />
          </div>
          <select
            className={`${inputClass} appearance-none`}
            value={filters.estado}
            onChange={(e) => onChange("estado", e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
             <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* Badges de filtros activos (Solo si hay alguno) */}
      {(filters.texto || filters.dni || filters.estado) && (
        <div className="flex items-center flex-wrap gap-2 text-sm pt-2">
          <span className="text-slate-500 text-xs font-medium uppercase tracking-wide mr-1">Filtros aplicados:</span>
          
          {filters.texto && (
            <FilterBadge label="Nombre" value={filters.texto} onRemove={() => onChange("texto", "")} />
          )}
          {filters.dni && (
            <FilterBadge label="DNI" value={filters.dni} onRemove={() => onChange("dni", "")} />
          )}
          {filters.estado && (
            <FilterBadge label="Estado" value={filters.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'} onRemove={() => onChange("estado", "")} />
          )}
        </div>
      )}
    </div>
  );
}

// Subcomponente interno para limpieza
const FilterBadge = ({ label, value, onRemove }: { label: string, value: string, onRemove: () => void }) => (
  <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
    {label}: <strong className="ml-1 font-semibold">{value}</strong>
    <button onClick={onRemove} className="ml-2 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-500 hover:bg-indigo-200 hover:text-indigo-600 focus:outline-none">
      <span className="sr-only">Remover filtro {label}</span>
      <FaTimes className="h-3 w-3" />
    </button>
  </span>
);