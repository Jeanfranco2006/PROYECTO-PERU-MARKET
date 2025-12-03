import { useState, useRef, useEffect } from 'react';
import type { Employee, Persona } from '../types/Employee';

const getInitialEmployeeState = (): Employee => ({
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

export const useModalManagement = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDepFormVisible, setIsDepFormVisible] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [formEmployee, setFormEmployee] = useState<Employee | null>(null);
  
  // Referencia para mantener las URLs blob activas
  const blobUrlsRef = useRef<Set<string>>(new Set());

  // Limpiar URLs blob cuando se desmonta
  useEffect(() => {
    return () => {
      cleanupBlobUrls();
    };
  }, []);

  const cleanupBlobUrls = () => {
    blobUrlsRef.current.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    blobUrlsRef.current.clear();
  };

  const openForm = (emp?: Employee) => {
    // Limpiar URLs blob anteriores
    cleanupBlobUrls();
    
    // Crear nueva copia del empleado sin URLs blob
    const employeeToEdit = emp ? { 
      ...emp,
      foto: emp.foto && !emp.foto.startsWith('blob:') ? emp.foto : ""
    } : getInitialEmployeeState();
    
    setFormEmployee(employeeToEdit);
    setIsFormVisible(true);
  };

  const closeForm = () => {
    // Limpiar URLs blob al cerrar
    cleanupBlobUrls();
    setIsFormVisible(false);
    setFormEmployee(null);
  };

  const openDepartmentForm = () => {
    setIsDepFormVisible(true);
  };

  const closeDepartmentForm = () => {
    setIsDepFormVisible(false);
  };

  const setFormEmployeeField = (field: string, value: any) => {
    setFormEmployee((prev) => {
      if (!prev) return null;

      // Manejar campos anidados
      if (field.startsWith("persona.")) {
        const key = field.replace("persona.", "") as keyof Persona;
        return {
          ...prev,
          persona: { ...prev.persona, [key]: value },
        } as Employee;
      }
      
      // Si es un campo de archivo (foto blob)
      if (field === "foto" && typeof value === "string" && value.startsWith("blob:")) {
        // Registrar la nueva URL blob
        blobUrlsRef.current.add(value);
      }
      
      return { ...prev, [field]: value } as Employee;
    });
  };

  return {
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
  };
};