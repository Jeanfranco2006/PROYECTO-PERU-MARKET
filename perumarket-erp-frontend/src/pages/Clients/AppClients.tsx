// pages/Clients/AppClients.tsx
import { useState, useEffect, useCallback } from "react";
import ClientsSearchBar from "./ClientSearchBar";
import ClienteDeleteModal from "./ClientDeleteModal";
import ClienteCard from "./ClientCards";
import ClienteForm from "./ClientFrom";
import { useClienteManagement } from "../../hooks/clientes/useClienteManagement";

// Iconos
import { 
  LuUsers, 
  LuFilter, 
  LuPlus, 
  LuCheck,
  LuUserPlus,
  LuX,
  LuRefreshCw,
  LuSearch
} from "react-icons/lu";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export default function AppClients() {
  const {
    // Estados
    loading,
    error: hookError, // Errores que vienen del hook (ej: 409 o mensaje de desactivación fallida)
    filters,
    stats,
    filteredClientes,
    isFormVisible,
    formCliente,
    deletingCliente,
    
    // Handlers
    handleFilterChange,
    clearFilters,
    handleSaveCliente,
    handleDeleteCliente,
    openForm,
    closeForm,
    setDeletingCliente,
    setFormField,
    closeDeleteModal,
    refreshData,
    clearError: clearHookError
  } = useClienteManagement();

  // Estados para UI locales
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Combinar errores del hook y locales para mostrar en la alerta roja
  const error = hookError || localError;

  const clearErrors = useCallback(() => {
    clearHookError();
    setLocalError(null);
  }, [clearHookError]);

  // Auto-cerrar mensaje de éxito
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // --- Lógica de Guardado ---
  const handleSaveClienteAndClose = async (cli: any): Promise<void> => {
    setSaving(true);
    clearErrors();
    setSuccessMessage(null);
    
    try {
      const success = await handleSaveCliente(cli);
      if (success) {
        const message = cli.id 
          ? `Cliente actualizado correctamente.`
          : `Cliente registrado exitosamente.`;
        setSuccessMessage(message);
        closeForm();
      }
    } catch (err: any) {
      console.error('❌ Error en save:', err);
      // El hook ya setea su error, pero por si acaso capturamos excepciones no controladas
      if (!hookError) setLocalError('Ocurrió un error inesperado al guardar.');
    } finally {
      setSaving(false);
    }
  };

  // --- Lógica de Eliminación (Con soporte para Conflicto 409) ---
  const handleConfirmDelete = async (): Promise<void> => {
    if (!deletingCliente?.id) return;
    
    setDeleting(true);
    clearErrors();
    
    try {
      // Llamamos al hook. Él se encarga de:
      // 1. Intentar borrar físico.
      // 2. Si es 409, mostrar window.confirm() para desactivar.
      // 3. Retornar true si alguna de las dos funcionó.
      const success = await handleDeleteCliente(deletingCliente.id);
      
      if (success) {
        // Verificamos si el cliente sigue existiendo en la lista (significa que fue desactivado, no borrado)
        // O si ya no está (borrado físico).
        // Como no tenemos acceso fácil a la lista nueva aquí mismo, ponemos un mensaje genérico seguro.
        setSuccessMessage("Operación realizada correctamente.");
        closeDeleteModal(); 
      }
    } catch (err: any) {
      // Errores graves no manejados por el hook
      setLocalError('Error crítico al procesar la eliminación.');
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseForm = () => {
    clearErrors();
    closeForm();
  };

  const generateClientKey = (cli: any, index: number): string => {
    if (cli.id) return `cliente-${cli.id}`;
    const dniKey = cli.persona?.numeroDocumento 
      ? cli.persona.numeroDocumento.replace(/\s+/g, '-')
      : `no-dni-${index}`;
    return `cliente-new-${dniKey}-${index}`;
  };

  // --- Skeleton Loading ---
  if (loading && stats.total === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-10 bg-slate-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
          </div>
          <div className="h-16 bg-slate-200 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-slate-200 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans pb-20 selection:bg-indigo-100 selection:text-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* --- ENCABEZADO --- */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <span className="p-2 bg-indigo-600 rounded-lg text-white shadow-md shadow-indigo-200">
                <LuUsers className="w-6 h-6" />
              </span>
              Directorio de Clientes
            </h1>
            <p className="text-slate-500 mt-2 text-sm max-w-2xl leading-relaxed">
              Administre la información comercial, historial y estado de su cartera de clientes de manera centralizada.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { clearErrors(); refreshData(); }}
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <LuRefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Sincronizando...' : 'Actualizar'}
            </button>
            
            <ActionButton 
              onClick={() => { clearErrors(); openForm(); }} 
              icon={<LuUserPlus className="w-5 h-5 mr-2" />}
              label="Nuevo Cliente"
              variant="primary"
            />
          </div>
        </div>

        {/* --- ALERTAS Y MENSAJES (UI Feedback) --- */}
        <div className="space-y-4">
          {/* Mensaje de Éxito */}
          {successMessage && (
            <div className="rounded-lg bg-emerald-50 border-l-4 border-emerald-500 p-4 flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
              <FiCheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-emerald-800">Operación Exitosa</h3>
                <p className="text-sm text-emerald-700 mt-0.5">{successMessage}</p>
              </div>
              <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-800">
                <LuX className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Mensaje de Error */}
          {error && (
            <div className="rounded-lg bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
              <FiAlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-red-800">Atención</h3>
                <p className="text-sm text-red-700 mt-0.5 whitespace-pre-line">{error}</p>
              </div>
              <button onClick={clearErrors} className="text-red-500 hover:text-red-800">
                <LuX className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* --- KPIs (STAT CARDS) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard 
            title="Total Clientes" 
            value={stats.total} 
            icon="users" 
            color="slate"
          />
          <StatCard 
            title="Clientes Activos" 
            value={stats.activos} 
            color="emerald" 
            icon="check" 
          />
          <StatCard 
            title="Resultados Filtro" 
            value={stats.filtrados} 
            color="indigo" 
            icon="filter" 
          />
        </div>

        {/* --- BARRA DE FILTROS --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-1">
            <div className="flex flex-col lg:flex-row gap-4 p-4 lg:items-start justify-between">
              <div className="flex-1 w-full">
                <ClientsSearchBar 
                  filters={filters} 
                  onChange={handleFilterChange} 
                />
              </div>
              
              <div className="flex flex-col items-end gap-2 pt-1 min-w-max">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Registros encontrados
                </div>
                <div className="text-2xl font-bold text-slate-900 leading-none">
                  {stats.filtrados}
                </div>
                
                <button
                  onClick={() => { clearErrors(); clearFilters(); }}
                  disabled={!filters.texto && !filters.dni && !filters.tipo}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all mt-1 ${
                    !filters.texto && !filters.dni && !filters.tipo
                      ? 'text-slate-400 bg-slate-100 cursor-not-allowed'
                      : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 cursor-pointer'
                  }`}
                >
                  Limpiar búsqueda
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- GRID DE RESULTADOS --- */}
        {filteredClientes.length === 0 ? (
          <EmptyState
            isInitial={stats.total === 0}
            onAction={() => { clearErrors(); openForm(); }}
            onClear={() => { clearErrors(); clearFilters(); }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClientes.map((cli, index) => (
              <ClienteCard
                key={generateClientKey(cli, index)}
                data={cli}
                onEdit={() => { clearErrors(); openForm(cli); }}
                onDelete={() => { clearErrors(); setDeletingCliente(cli); }}
              />
            ))}
          </div>
        )}

        {/* --- MODALES --- */}

        {/* Modal Formulario (Glassmorphism) */}
        {isFormVisible && formCliente && (
          <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
                onClick={handleCloseForm}
              ></div>
              
              {/* Panel */}
              <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:w-full sm:max-w-4xl max-h-[90vh] flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200">
                <div className="absolute top-4 right-4 z-10">
                   <button 
                    onClick={handleCloseForm}
                    className="p-2 bg-white/80 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100"
                  >
                    <LuX className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                  <ClienteForm
                    state={formCliente}
                    setField={setFormField}
                    onCancel={handleCloseForm}
                    onSave={handleSaveClienteAndClose}
                    loading={saving}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Eliminación */}
        {deletingCliente && (
          <ClienteDeleteModal
            visible={!!deletingCliente}
            message={`¿Está seguro que desea eliminar a ${deletingCliente.persona.nombres}?`}
            onCancel={closeDeleteModal}
            onConfirm={handleConfirmDelete}
            loading={deleting}
          />
        )}
      </div>
    </div>
  );
}

// --- Componentes UI Auxiliares ---

const ActionButton = ({ onClick, icon, label, variant }: any) => {
  const baseClass = "inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";
  const variants = {
    primary: "border border-transparent text-white bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 focus:ring-indigo-500",
    secondary: "border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-500"
  };
  
  return (
    <button onClick={onClick} className={`${baseClass} ${variant === 'primary' ? variants.primary : variants.secondary}`}>
      {icon} {label}
    </button>
  );
};

const StatCard = ({ title, value, color = "slate", icon }: any) => {
  const colors: any = {
    slate: { bg: "bg-slate-100", text: "text-slate-600", val: "text-slate-900", border: "border-slate-200" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600", val: "text-emerald-900", border: "border-emerald-100" },
    indigo: { bg: "bg-indigo-100", text: "text-indigo-600", val: "text-indigo-900", border: "border-indigo-100" },
  };
  
  const Icon = icon === 'users' ? LuUsers : icon === 'check' ? LuCheck : LuFilter;
  const theme = colors[color] || colors.slate;

  return (
    <div className={`bg-white rounded-xl p-5 border ${theme.border} shadow-sm flex items-center gap-4 hover:shadow-md transition-all group`}>
      <div className={`p-3 rounded-lg ${theme.bg} ${theme.text} group-hover:scale-110 transition-transform`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className={`text-2xl font-extrabold ${theme.val}`}>{value.toLocaleString()}</p>
      </div>
    </div>
  );
};

const EmptyState = ({ isInitial, onAction, onClear }: any) => (
  <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
    <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 ring-1 ring-slate-100 shadow-sm">
      {isInitial ? (
        <LuUserPlus className="h-8 w-8 text-slate-400" />
      ) : (
        <LuSearch className="h-8 w-8 text-slate-400" />
      )}
    </div>
    <h3 className="mt-2 text-lg font-bold text-slate-900">
      {isInitial ? 'Base de datos vacía' : 'Sin resultados'}
    </h3>
    <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
      {isInitial 
        ? 'No hay clientes registrados en el sistema. Comience agregando su primer contacto comercial.' 
        : 'No se encontraron clientes que coincidan con los filtros aplicados.'}
    </p>
    {isInitial ? (
      <ActionButton 
        onClick={onAction} 
        icon={<LuPlus className="w-5 h-5 mr-2" />} 
        label="Registrar Primer Cliente" 
        variant="primary" 
      />
    ) : (
      <button 
        onClick={onClear} 
        className="text-indigo-600 font-bold hover:text-indigo-800 text-sm hover:underline transition-colors"
      >
        Limpiar todos los filtros
      </button>
    )}
  </div>
);