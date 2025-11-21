import { FiSearch, FiDownload, FiPlus } from "react-icons/fi";

// Componente de búsqueda y filtros
export const SearchAndFilters = ({ 
  searchTerm, 
  onSearchChange, 
  filterOptions, 
  onFilterChange, 
  onAddNew, 
  addButtonText 
}: { 
  searchTerm: string; 
  onSearchChange: (value: string) => void; 
  filterOptions?: React.ReactNode; 
  onFilterChange?: (value: string) => void; 
  onAddNew: () => void; 
  addButtonText: string 
}) => (
  <div className="flex flex-col lg:flex-row gap-4 mb-6">
    <div className="flex-1 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {filterOptions && (
        <select 
          onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
          className="w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {filterOptions}
        </select>
      )}
    </div>
    <div className="flex gap-3">
      <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        <FiDownload size={16} />
        <span className="hidden sm:block">Exportar</span>
      </button>
      <button 
        onClick={onAddNew}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <FiPlus size={16} />
        {addButtonText}
      </button>
    </div>
  </div>
);