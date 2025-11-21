import { useEffect, useState } from "react";

// IMPORTAR EJEMPLOS
import { sampleEmployees } from "./exampleEmployees";
import SearchBar from "./EmployeeSearchBar";
import EmployeeCard from "./EmployeeCards";
import EmployeeForm from "./EmployeeForm";
import DeleteModal from "./EmployeeDeleteModal";
import DepartmentForm from "./DepartmentForm";
import { sampleDepartments } from "./exampleDepartment";
import type { Departament, Employee } from "../../types/Employee";

export default function AppEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departamentos, setDepartamentos] = useState<Departament[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    loadEmployees();
    loadDepartamentos();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/empleados');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error cargando empleados:', error);
      // En caso de error, usar datos de ejemplo
      setEmployees(sampleEmployees);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartamentos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/departamentos');
      const data = await response.json();
      setDepartamentos(data);
    } catch (error) {
      console.error('Error cargando departamentos:', error);
      // En caso de error, usar datos de ejemplo
      setDepartamentos(sampleDepartments);
    }
  };

  // -------------------------
  // FILTROS
  // -------------------------
  const [filters, setFilters] = useState({
    texto: "",
    dni: "",
    estado: "",
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // -------------------------
  // FORMULARIO EMPLEADO
  // -------------------------
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formEmployee, setFormEmployee] = useState<Employee | null>(null);

  const openForm = (emp?: Employee) => {
    if (emp) {
      setFormEmployee({ ...emp });
    } else {
      setFormEmployee({
        empleadoId: undefined,
        persona: {
          id: undefined,
          tipoDocumento: "DNI",
          numeroDocumento: "",
          nombres: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          correo: "",
          telefono: "",
          direccion: "",
          fechaNacimiento: "",
        },
        departamento: null,
        puesto: "",
        sueldo: 0,
        fechaContratacion: new Date().toISOString().substring(0, 10),
        estado: "ACTIVO",
        foto: "",
        cv: "",
      });
    }
    setIsFormVisible(true);
  };

  const handleSaveEmployee = async (emp: Employee) => {
    try {
      // Preparar los datos para enviar al backend
      const employeeToSend = {
        ...emp,
        // Asegurarse de que el departamento tenga el formato correcto
        departamento: emp.departamento?.id ? {
          id: emp.departamento.id,
          nombre: emp.departamento.nombre,
          descripcion: emp.departamento.descripcion
        } : null
      };

      const url = emp.empleadoId 
        ? `http://localhost:8080/api/empleados/${emp.empleadoId}`
        : 'http://localhost:8080/api/empleados';
      
      const method = emp.empleadoId ? 'PUT' : 'POST';

      console.log('Enviando empleado:', employeeToSend);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeToSend),
      });

      if (response.ok) {
        await loadEmployees(); // Recargar la lista
        setIsFormVisible(false);
        setFormEmployee(null);
      } else {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        alert('Error al guardar empleado: ' + errorText);
      }
    } catch (error) {
      console.error('Error guardando empleado:', error);
      alert('Error de conexión al guardar empleado');
    }
  };

  // -------------------------
  // FORMULARIO DEPARTAMENTO
  // -------------------------
  const [isDepFormVisible, setIsDepFormVisible] = useState(false);
  const [department, setDepartment] = useState<Departament>({
    id: undefined,
    nombre: "",
    descripcion: "",
  });

  const openDepartmentForm = () => {
    setDepartment({ id: undefined, nombre: "", descripcion: "" });
    setIsDepFormVisible(true);
  };

  const handleSaveDepartment = async (dep: Departament) => {
    try {
      const response = await fetch('http://localhost:8080/api/departamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dep),
      });

      if (response.ok) {
        await loadDepartamentos(); // Recargar departamentos
        setIsDepFormVisible(false);
      } else {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        alert('Error al guardar departamento: ' + errorText);
      }
    } catch (error) {
      console.error('Error guardando departamento:', error);
      alert('Error de conexión al guardar departamento');
    }
  };

  // -------------------------
  // ELIMINACIÓN
  // -------------------------
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const handleDeleteEmployee = async () => {
    if (!deletingEmployee || !deletingEmployee.empleadoId) return;

    try {
      const response = await fetch(`http://localhost:8080/api/empleados/${deletingEmployee.empleadoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadEmployees(); // Recargar la lista completa
        setDeletingEmployee(null);
      } else {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        alert('Error al eliminar empleado: ' + errorText);
      }
    } catch (error) {
      console.error('Error eliminando empleado:', error);
      alert('Error de conexión al eliminar empleado');
    }
  };

  // -------------------------
  // FILTROS COMBINADOS
  // -------------------------
  const filteredEmployees = employees.filter((e) => {
    const fullName = `${e.persona.nombres} ${e.persona.apellidoPaterno} ${e.persona.apellidoMaterno}`.toLowerCase();

    const matchesText =
      filters.texto === "" || fullName.includes(filters.texto.toLowerCase());

    const matchesDni =
      filters.dni === "" ||
      e.persona.numeroDocumento.includes(filters.dni);

    const matchesEstado =
      filters.estado === "" || e.estado === filters.estado;

    return matchesText && matchesDni && matchesEstado;
  });

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="text-lg">Cargando empleados...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Gestión de Empleados</h1>

      {/* FILTROS + BOTONES DERECHA */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* BARRA DE BÚSQUEDA */}
        <SearchBar filters={filters} onChange={handleFilterChange} />

        {/* BOTONES */}
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => openForm()}
          >
            Registrar Empleado
          </button>

          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            onClick={openDepartmentForm}
          >
            Registrar Departamento
          </button>
        </div>
      </div>

      {/* CONTADOR DE RESULTADOS */}
      <div className="text-sm text-gray-600">
        Mostrando {filteredEmployees.length} de {employees.length} empleados
      </div>

      {/* LISTA */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No se encontraron empleados que coincidan con los filtros
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* MODAL EMPLEADO */}
      {isFormVisible && formEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <EmployeeForm
              state={formEmployee}
              departamentos={departamentos}
              onCancel={() => setIsFormVisible(false)}
              onSave={handleSaveEmployee}
              setField={(field, value) => {
                if (field.startsWith("persona.")) {
                  const key = field.replace("persona.", "");
                  setFormEmployee((prev) => ({
                    ...prev!,
                    persona: { ...prev!.persona, [key]: value },
                  }));
                } else {
                  setFormEmployee((prev) => ({ ...prev!, [field]: value }));
                }
              }}
            />
          </div>
        </div>
      )}

      {/* MODAL DEPARTAMENTO */}
      {isDepFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <DepartmentForm
              state={department}
              setField={(f, v) =>
                setDepartment((prev) => ({ ...prev, [f]: v }))
              }
              onCancel={() => setIsDepFormVisible(false)}
              onSave={handleSaveDepartment}
            />
          </div>
        </div>
      )}

      {/* CONFIRMAR ELIMINACIÓN */}
      <DeleteModal
        visible={!!deletingEmployee}
        message={`¿Deseas eliminar a ${deletingEmployee?.persona.nombres} ${deletingEmployee?.persona.apellidoPaterno}?`}
        onCancel={() => setDeletingEmployee(null)}
        onConfirm={handleDeleteEmployee}
      />
    </div>
  );
}