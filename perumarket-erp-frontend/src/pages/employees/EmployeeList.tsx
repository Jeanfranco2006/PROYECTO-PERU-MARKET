import { useState } from "react";
import type { Employee } from "../../types/Employee";
import { BsPencil, BsTrash } from "react-icons/bs";

interface Props {
  employees: Employee[];
  departamentos: { id: string | number; nombre: string }[];
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
  // ...otros props de acciones
}

export default function EmployeeList({ employees, onEdit, onDelete }: Props) {
  
  // Asumiendo que el filtrado principal viene desde el hook en el padre,
  // aquí solo renderizamos la tabla por simplicidad visual
  
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-slate-300">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Empleado</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Documento</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Departamento</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Estado</th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {employees.map((emp) => (
            <tr key={emp.empleadoId} className="hover:bg-slate-50 transition-colors">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                        {emp.persona.nombres.charAt(0)}{emp.persona.apellidoPaterno.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-slate-900">{emp.persona.nombres} {emp.persona.apellidoPaterno}</div>
                    <div className="text-slate-500">{emp.persona.correo}</div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                <div className="text-slate-900">{emp.persona.numeroDocumento}</div>
                <div className="text-xs text-slate-400">{emp.persona.tipoDocumento}</div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                {emp.departamento?.nombre || <span className="text-slate-400 italic">No asignado</span>}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  emp.estado === 'ACTIVO' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-red-100 text-red-800'
                }`}>
                  {emp.estado}
                </span>
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button 
                    onClick={() => onEdit(emp)} 
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                    Editar
                </button>
                <button 
                    onClick={() => onDelete(emp)} 
                    className="text-red-600 hover:text-red-900"
                >
                    Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}