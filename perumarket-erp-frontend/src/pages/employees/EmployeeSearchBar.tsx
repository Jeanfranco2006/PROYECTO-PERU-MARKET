import type { EmployeeFilters } from "../../types/Employee";

interface Props {
  filters: EmployeeFilters;
  onChange: (field: keyof EmployeeFilters, value: string) => void;
}

export default function EmployeeSearchBar({ filters, onChange }: Props) {
  return (
    <div className="space-y-4">
      {/* Búsqueda por texto general */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Buscar empleado
        </label>
        <input
          type="text"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors"
          placeholder="Buscar por nombre, apellido, puesto o correo..."
          value={filters.texto}
          onChange={(e) => onChange('texto', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Filtro por DNI */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            N° Documento
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors"
            placeholder="Ej: 12345678"
            value={filters.dni}
            onChange={(e) => onChange('dni', e.target.value)}
          />
        </div>

        {/* Filtro por estado */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Estado
          </label>
          <select
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors bg-white"
            value={filters.estado}
            onChange={(e) => onChange('estado', e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
            <option value="PENDIENTE">Pendiente</option>
          </select>
        </div>
      </div>
    </div>
  );
}