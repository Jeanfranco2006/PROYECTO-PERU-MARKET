import { useEmployeeManagement } from "../../hooks/useEmployeeManagement";
import { useModalManagement } from "../../hooks/useModalManagement";
import type { Departament, Employee } from "../../types/Employee"; 

// Iconos para una interfaz de usuario limpia y consistente
import { LuUsers, LuFilter, LuPlus, LuLayoutList, LuCheck } from "react-icons/lu";
import { HiOutlineOfficeBuilding, HiOutlineUserAdd } from "react-icons/hi";
import { FiAlertCircle } from "react-icons/fi";

// Importación de componentes hijos refactorizados
import EmployeeSearchBar from "./EmployeeSearchBar";
import EmployeeCard from "./EmployeeCards";
import EmployeeForm from "./EmployeeForm";
import DeleteModal from "./EmployeeDeleteModal";
import DepartmentForm from "./DepartmentForm";

/**
 * Componente principal para la gestión de empleados
 * Presenta una interfaz completa con estadísticas, búsqueda y CRUD de empleados y departamentos
 */
export default function AppEmployees() {
  const {
    departamentos,
    loading,
    error,
    filters,
    stats,
    filteredEmployees,
    handleFilterChange, 
    clearFilters,
    handleSaveEmployee,
    handleDeleteEmployee,
    handleSaveDepartment,
  } = useEmployeeManagement();

  const {
    isFormVisible,
    isDepFormVisible,
    deletingEmployee,
    formEmployee,
    openForm,
    closeForm,
    openDepartmentForm,
    closeDepartmentForm,
    setDeletingEmployee,
    setFormEmployeeField,
  } = useModalManagement();

  // --- Lógica de Coordinación entre Capas ---

  /**
   * Maneja el guardado de empleado y cierre del formulario
   * @param emp - Objeto Employee a guardar
   * @returns Promise<void>
   */
  const handleSaveEmployeeAndClose = async (emp: Employee): Promise<void> => {
    const success = await handleSaveEmployee(emp);
    if (success) closeForm();
  };

  /**
   * Maneja el guardado de departamento y cierre del formulario
   * @param dep - Objeto Departament a guardar
   * @returns Promise<void>
   */
  const handleSaveDepartmentAndClose = async (dep: Departament): Promise<void> => {
    const success = await handleSaveDepartment(dep);
    if (success) closeDepartmentForm();
  };

  /**
   * Maneja la eliminación de empleado y cierre del modal
   * @returns Promise<void>
   */
  const handleDeleteEmployeeAndClose = async (): Promise<void> => {
    if (!deletingEmployee?.empleadoId) return;
    const success = await handleDeleteEmployee(deletingEmployee.empleadoId);
    if (success) setDeletingEmployee(null); 
  };

  /**
   * Confirma y ejecuta la eliminación del empleado
   */
  const handleConfirmDelete = (): void => {
    handleDeleteEmployeeAndClose();
  };

  // --- Renderizado de Estado de Carga (Skeleton Screen) ---
  if (loading && stats.total === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Esqueleto del Encabezado */}
          <div className="flex justify-between items-center animate-pulse">
            <div className="space-y-3 w-1/3">
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-slate-200 rounded"></div>
              <div className="h-10 w-32 bg-slate-200 rounded"></div>
            </div>
          </div>
          
          {/* Esqueleto de Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
          
          {/* Esqueleto de Búsqueda */}
          <div className="h-20 bg-slate-200 rounded-lg"></div>
          
          {/* Esqueleto de Tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-slate-200 rounded-lg shadow-sm border border-slate-100"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Componente de Presentación Principal ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Sección de Encabezado */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <LuLayoutList className="text-indigo-600" />
              Directorio de Empleados
            </h1>
            <p className="text-slate-500 mt-2 text-sm max-w-2xl leading-relaxed">
              Gestione el capital humano, administre departamentos y supervise el estado 
              de la plantilla laboral desde un panel centralizado y seguro.
            </p>
          </div>
          
          {/* Grupo de Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={openDepartmentForm}
              className="inline-flex items-center justify-center px-4 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <HiOutlineOfficeBuilding className="w-5 h-5 mr-2 text-slate-500" />
              Nuevo Departamento
            </button>

            <button
              onClick={() => openForm()}
              className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <HiOutlineUserAdd className="w-5 h-5 mr-2" />
              Nuevo Empleado
            </button>
          </div>
        </div>

        {/* Sección de KPIs / Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard 
            title="Total Empleados" 
            value={stats.total} 
            icon="users" 
          />
          <StatCard 
            title="Activos" 
            value={stats.activos} 
            color="text-emerald-600" 
            icon="check" 
          />
          <StatCard 
            title="Resultados Filtrados" 
            value={stats.filtered} 
            color="text-indigo-600" 
            icon="filter" 
          />
        </div>

        {/* Contenedor de Herramientas y Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-start justify-between">
              {/* Inyección del Componente de Búsqueda */}
              <div className="flex-1 w-full">
                <EmployeeSearchBar 
                  filters={filters} 
                  onChange={handleFilterChange} 
                />
              </div>

              {/* Información y Restablecimiento de Filtros */}
              <div className="flex flex-col items-end gap-2 min-w-max pt-1">
                <div className="text-sm text-slate-500">
                  Mostrando <span className="font-bold text-slate-900">{stats.filtered}</span> registros
                </div>
                <button
                  onClick={clearFilters}
                  disabled={!filters.texto && !filters.dni && !filters.estado}
                  className={`text-xs font-medium px-3 py-1.5 rounded transition-colors ${
                    !filters.texto && !filters.dni && !filters.estado
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-indigo-600 hover:bg-indigo-50 bg-white border border-indigo-100'
                  }`}
                >
                  Restablecer vista
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200 flex items-start gap-3">
            <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error de conexión</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Resultados en Grid */}
        {filteredEmployees.length === 0 ? (
          <EmptyState 
            isInitial={stats.total === 0} 
            onAction={() => openForm()} 
            onClear={clearFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEmployees.map((emp) => (
              <EmployeeCard
                key={emp.empleadoId}
                data={emp}
                onEdit={() => openForm(emp)}
                onDelete={() => setDeletingEmployee(emp)}
              />
            ))}
          </div>
        )}

        {/* --- Modales (Renderizado Condicional) --- */}
        
        {/* Modal de Empleado */}
        {isFormVisible && formEmployee && (
          <div 
            className="fixed inset-0 z-50 overflow-y-auto" 
            aria-labelledby="modal-title" 
            role="dialog" 
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Backdrop con efecto blur */}
              <div 
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                onClick={closeForm}
              ></div>
              
              <span 
                className="hidden sm:inline-block sm:align-middle sm:h-screen" 
                aria-hidden="true"
              >
                &#8203;
              </span>
              
              <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-slate-200">
                <EmployeeForm
                  state={formEmployee}
                  departamentos={departamentos}
                  onCancel={closeForm}
                  onSave={handleSaveEmployeeAndClose}
                  setField={setFormEmployeeField}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal de Departamento */}
        {isDepFormVisible && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div 
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                onClick={closeDepartmentForm}
              ></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-200">
                <DepartmentForm
                  state={{ id: undefined, nombre: "", descripcion: "" }} 
                  setField={() => {}} // Implementar según necesidad
                  onCancel={closeDepartmentForm}
                  onSave={handleSaveDepartmentAndClose}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmación de Eliminación */}
        <DeleteModal
          visible={!!deletingEmployee}
          message="Confirmar eliminación"
          subMessage={`¿Está seguro que desea dar de baja a ${deletingEmployee?.persona.nombres} ${deletingEmployee?.persona.apellidoPaterno}? Esta operación no es reversible.`}
          onCancel={() => setDeletingEmployee(null)}
          onConfirm={handleConfirmDelete} 
        />
      </div>
    </div>
  );
}

// --- Componentes UI Auxiliares Refinados ---

/**
 * Componente para mostrar tarjetas de estadísticas
 */
interface StatCardProps {
  title: string;
  value: number;
  color?: string;
  icon: 'users' | 'check' | 'filter';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  color = "text-slate-900", 
  icon 
}) => {
  // Selección dinámica de icono
  const Icon = icon === 'users' ? LuUsers : icon === 'check' ? LuCheck : LuFilter;
  
  // Clases condicionales para el fondo
  const bgClass = color === 'text-slate-900' 
    ? 'bg-slate-100 text-slate-600' 
    : color === 'text-emerald-600' 
      ? 'bg-emerald-50 text-emerald-600' 
      : 'bg-indigo-50 text-indigo-600';

  return (
    <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-slate-200 hover:border-indigo-200 transition-colors">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-md ${bgClass}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-slate-500 truncate">
                {title}
              </dt>
              <dd>
                <div className={`text-2xl font-bold tracking-tight ${color}`}>
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente para estado vacío (sin datos o sin resultados)
 */
interface EmptyStateProps {
  isInitial: boolean;
  onAction: () => void;
  onClear: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  isInitial, 
  onAction, 
  onClear 
}) => {
  return (
    <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-slate-300">
      <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        {isInitial ? (
          <LuPlus className="h-8 w-8 text-slate-400" />
        ) : (
          <LuFilter className="h-8 w-8 text-slate-400" />
        )}
      </div>
      <h3 className="mt-2 text-base font-semibold text-slate-900">
        {isInitial ? 'Base de datos vacía' : 'Sin coincidencias'}
      </h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
        {isInitial 
          ? 'Aún no hay empleados registrados en el sistema. Comience agregando su primer colaborador.' 
          : 'No se encontraron empleados con los filtros actuales. Intente ajustar los criterios de búsqueda.'}
      </p>
      <div className="mt-6">
        {isInitial ? (
          <button
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <LuPlus className="-ml-1 mr-2 h-5 w-5" />
            Registrar Primer Empleado
          </button>
        ) : (
          <button
            onClick={onClear}
            className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Limpiar todos los filtros
          </button>
        )}
      </div>
    </div>
  );
};