import { useState } from "react";
import { Employee } from "../types/Employee";
import { sampleEmployees } from "./exampleEmployees";

import SearchBar from "./EmployeeSearchBar";
import EmployeeCard from "./EmployeeCards";
import EmployeeForm from "./EmployeeForm";
import DeleteModal from "./EmployeeDeleteModal";
import DepartmentForm from "./DepartmentForm";

export default function AppEmployees() {
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);

  // -------------------------
  // ESTADO DE FILTROS
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
        empleadoId: "",
        persona: {
          id: "",
          tipoDocumento: "DNI",
          numeroDocumento: "",
          nombres: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          correo: "",
          telefono: "",
          direccion: "",
        },
        departamento: null,
        puesto: "",
        sueldo: 0,
        fechaContratacion: new Date().toISOString().substring(0, 10),
        estado: "activo",
        foto: "",
        cv: "",
      });
    }
    setIsFormVisible(true);
  };

  const handleSaveEmployee = (emp: Employee) => {
    if (emp.empleadoId) {
      setEmployees((prev) =>
        prev.map((e) => (e.empleadoId === emp.empleadoId ? emp : e))
      );
    } else {
      setEmployees((prev) => [
        ...prev,
        { ...emp, empleadoId: Date.now().toString() },
      ]);
    }

    setIsFormVisible(false);
    setFormEmployee(null);
  };

  // -------------------------
  // DEPARTAMENTO
  // -------------------------
  const [isDepFormVisible, setIsDepFormVisible] = useState(false);
  const [department, setDepartment] = useState({
    id: "",
    nombre: "",
    descripcion: "",
  });

  const openDepartmentForm = () => {
    setDepartment({ id: "", nombre: "", descripcion: "" });
    setIsDepFormVisible(true);
  };

  const handleSaveDepartment = (dep: any) => {
    console.log("Guardado Departamento:", dep);
    setIsDepFormVisible(false);
  };

  // -------------------------
  // ELIMINACIÓN
  // -------------------------
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const handleDeleteEmployee = () => {
    if (!deletingEmployee) return;

    setEmployees((prev) =>
      prev.filter((e) => e.empleadoId !== deletingEmployee.empleadoId)
    );

    setDeletingEmployee(null);
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => openForm()}
          >
            Registrar Empleado
          </button>

          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            onClick={openDepartmentForm}
          >
            Registrar Departamento
          </button>
        </div>
      </div>

      {/* LISTA */}
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

      {/* MODAL EMPLEADO */}
      {isFormVisible && formEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl">
            <EmployeeForm
              state={formEmployee}
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
              setField={(f, v) => setDepartment((prev) => ({ ...prev, [f]: v }))}
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
