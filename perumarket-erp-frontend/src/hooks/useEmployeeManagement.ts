import { useState, useEffect, useCallback, useMemo } from "react";
import { EmployeeService, DepartmentService } from "../services/employeeService";
import type { Employee, Departament, EmployeeFilters, EmployeeStats } from "../types/Employee";

const INITIAL_FILTERS: EmployeeFilters = { texto: "", dni: "", estado: "" };

export const useEmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departamentos, setDepartamentos] = useState<Departament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EmployeeFilters>(INITIAL_FILTERS);

  // --- Lógica de Carga (Delegada al servicio) ---
  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EmployeeService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      // El servicio ya lanza un objeto Error con el mensaje legible
      setError(err instanceof Error ? err.message : "Error desconocido al cargar empleados.");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDepartamentos = useCallback(async () => {
    try {
      const data = await DepartmentService.getAllDepartments();
      setDepartamentos(data);
    } catch (err) {
      console.warn("No se pudieron cargar los departamentos.");
      setDepartamentos([]);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
    loadDepartamentos();
  }, [loadEmployees, loadDepartamentos]);

  // --- Lógica de Mutación (Delegada al servicio) ---
  const handleSaveEmployee = async (emp: Employee): Promise<boolean> => {
    try {
      await EmployeeService.saveEmployee(emp);
      await loadEmployees();
      return true;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error desconocido al guardar.');
      return false;
    }
  };

  const handleSaveDepartment = async (dep: Departament): Promise<boolean> => {
    try {
      await DepartmentService.saveDepartment(dep);
      await loadDepartamentos();
      return true;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error desconocido al guardar departamento.');
      return false;
    }
  };

  const handleDeleteEmployee = async (empleadoId: number): Promise<boolean> => {
    try {
      await EmployeeService.deleteEmployee(empleadoId);
      await loadEmployees();
      return true;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error desconocido al eliminar.');
      return false;
    }
  };

  // --- Lógica de Filtros y Cálculos ---
  // ✅ CORRECCIÓN FINAL: Permite 'string' para compatibilidad con SearchBar y usa Type Assertion
  const handleFilterChange = (field: string, value: string) => {
    // Aseguramos que solo actualizamos claves válidas (resolviendo el error de clave en TS)
    if (field in INITIAL_FILTERS) { 
        setFilters(prev => ({ 
            ...prev, 
            [field as keyof EmployeeFilters]: value 
        }));
    }
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const fullName = `${emp.persona.nombres} ${emp.persona.apellidoPaterno} ${emp.persona.apellidoMaterno}`.toLowerCase();
      const matchesText = !filters.texto || fullName.includes(filters.texto.toLowerCase());
      const matchesDni = !filters.dni || emp.persona.numeroDocumento.includes(filters.dni);
      const matchesEstado = !filters.estado || emp.estado === filters.estado;
      return matchesText && matchesDni && matchesEstado;
    });
  }, [employees, filters]);

  const stats = useMemo<EmployeeStats>(() => ({
    total: employees.length,
    activos: employees.filter(emp => emp.estado === 'ACTIVO').length,
    inactivos: employees.filter(emp => emp.estado === 'INACTIVO').length,
    filtered: filteredEmployees.length
  }), [employees, filteredEmployees]);

  return {
    employees, departamentos, loading, error, filters, stats, filteredEmployees,
    loadEmployees, handleFilterChange, clearFilters, handleSaveEmployee, handleDeleteEmployee, handleSaveDepartment,
  };
};