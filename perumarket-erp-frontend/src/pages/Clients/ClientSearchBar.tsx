import { 
  LuSearch, 
  LuCreditCard, 
  LuFilter, 
  LuUser, 
  LuBriefcase 
} from "react-icons/lu";
import type { ClienteFilters } from "../../types/clientes/Client";

interface Props {
  filters: ClienteFilters;
  onChange: (field: keyof ClienteFilters, value: string) => void;
}

export default function ClientsSearchBar({ filters, onChange }: Props) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* --- Campo 1: Búsqueda por Nombre (Ocupa más espacio) --- */}
        <div className="md:col-span-6 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LuSearch className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombres o apellidos..."
            className="block w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-3 py-2.5 text-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
            value={filters.texto}
            onChange={(e) => onChange("texto", e.target.value)}
          />
        </div>

        {/* --- Campo 2: Búsqueda por DNI --- */}
        <div className="md:col-span-3 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LuCreditCard className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Documento / DNI"
            className="block w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-3 py-2.5 text-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
            value={filters.dni}
            onChange={(e) => {
              // Opcional: Permitir solo números mientras escriben
              const val = e.target.value;
              if (/^\d*$/.test(val)) onChange("dni", val);
            }}
            maxLength={12} // Limitar longitud
          />
        </div>

        {/* --- Campo 3: Filtro por Tipo --- */}
        <div className="md:col-span-3 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LuFilter className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <select
            className="block w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-10 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
            value={filters.tipo}
            onChange={(e) => onChange("tipo", e.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="NATURAL">Persona Natural</option>
            <option value="JURIDICA">Persona Jurídica</option>
          </select>
          
          {/* Icono decorativo de flecha o indicador visual a la derecha */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
             {filters.tipo === 'NATURAL' && <LuUser className="h-4 w-4 text-emerald-500" />}
             {filters.tipo === 'JURIDICA' && <LuBriefcase className="h-4 w-4 text-indigo-500" />}
          </div>
        </div>

      </div>
    </div>
  );
}