import React from 'react';
import { FaUserPlus } from 'react-icons/fa';

interface Cliente {
  id: number;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  telefono: string;
}

interface ModalClienteProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrar: (cliente: Omit<Cliente, 'id'>) => void;
}

const ModalCliente: React.FC<ModalClienteProps> = ({ isOpen, onClose, onRegistrar }) => {
  const [nuevoCliente, setNuevoCliente] = React.useState({
    tipo_documento: 'DNI',
    numero_documento: '',
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo: '',
    telefono: ''
  });

  const handleRegistrar = () => {
    if (!nuevoCliente.nombres || !nuevoCliente.apellido_paterno || !nuevoCliente.numero_documento) {
      alert('Por favor completa los campos obligatorios: Nombres, Apellido Paterno y Número de Documento');
      return;
    }

    onRegistrar(nuevoCliente);
    
    // Limpiar formulario
    setNuevoCliente({
      tipo_documento: 'DNI',
      numero_documento: '',
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
      correo: '',
      telefono: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaUserPlus className="mr-2" />
            Registrar Nuevo Cliente
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo Documento *
              </label>
              <select
                value={nuevoCliente.tipo_documento}
                onChange={(e) => setNuevoCliente({...nuevoCliente, tipo_documento: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
                <option value="CE">Carnet Extranjería</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número Documento *
              </label>
              <input
                type="text"
                value={nuevoCliente.numero_documento}
                onChange={(e) => setNuevoCliente({...nuevoCliente, numero_documento: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Ingrese número de documento"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombres *
              </label>
              <input
                type="text"
                value={nuevoCliente.nombres}
                onChange={(e) => setNuevoCliente({...nuevoCliente, nombres: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Ingrese nombres"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido Paterno *
                </label>
                <input
                  type="text"
                  value={nuevoCliente.apellido_paterno}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, apellido_paterno: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Apellido paterno"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido Materno
                </label>
                <input
                  type="text"
                  value={nuevoCliente.apellido_materno}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, apellido_materno: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Apellido materno"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={nuevoCliente.correo}
                onChange={(e) => setNuevoCliente({...nuevoCliente, correo: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                value={nuevoCliente.telefono}
                onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Número de teléfono"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4 sm:mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              onClick={handleRegistrar}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Registrar Cliente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCliente;