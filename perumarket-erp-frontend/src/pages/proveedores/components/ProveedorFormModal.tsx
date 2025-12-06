import React, { useState, useEffect } from 'react';
import { FaFileSignature, FaUser, FaPhone, FaEnvelope, FaExclamationCircle } from 'react-icons/fa';
import type { ProveedorData } from '../../../types/proveedor/proveedorType';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProveedorData) => Promise<void>;
  initialData?: ProveedorData;
  isEditing: boolean;
  existingProviders?: ProveedorData[];
}

const DEFAULT_DATA: ProveedorData = {
  ruc: '', razon_social: '', contacto: '', telefono: '', correo: '', direccion: '', estado: 'ACTIVO'
};

export default function ProveedorFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  isEditing,
  existingProviders = [] 
}: Props) {
  const [formData, setFormData] = useState<ProveedorData>(DEFAULT_DATA);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || DEFAULT_DATA);
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'ruc' || name === 'telefono') {
      const soloNumeros = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({ ...prev, [name]: soloNumeros }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.ruc.trim() || !formData.razon_social.trim() || !formData.contacto.trim() || !formData.telefono.trim()) {
      setError('⚠️ Por favor complete todos los campos obligatorios.');
      return false;
    }

    if (existingProviders && existingProviders.length > 0) {
      const normalizedRuc = formData.ruc.trim();
      const duplicate = existingProviders.find(p => {
        if (isEditing && String(p.id) === String(formData.id)) return false;
        return String(p.ruc) === normalizedRuc;
      });

      if (duplicate) {
        setError(`⛔ El RUC ${normalizedRuc} ya existe en el sistema.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (err) {
      setError('Error al guardar. Intente nuevamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
      
      {/* CAMBIOS REALIZADOS EN EL CLASSNAME DE ABAJO:
          1. [&::-webkit-scrollbar]:hidden -> Oculta scrollbar en Chrome/Safari
          2. [-ms-overflow-style:none] -> Oculta en IE
          3. [scrollbar-width:none] -> Oculta en Firefox
      */}
      <div className="
          bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] 
          overflow-y-auto animate-fadeInUp flex flex-col relative
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
      ">
        
        {/* Header (Sticky Top) */}
        <div className="bg-indigo-600 p-4 md:p-6 flex justify-between items-center text-white sticky top-0 z-30 shadow-md">
           <h2 className="text-lg md:text-xl font-bold flex items-center gap-3 uppercase tracking-wide">
             <FaFileSignature className="text-slate-400"/>
             {isEditing ? 'Editar Ficha' : 'Nueva Ficha'}
           </h2>
           <div className="text-xs font-mono opacity-50 bg-indigo-800 px-2 py-1 rounded">
             ID: {isEditing ? formData.id : 'NEW'}
           </div>
        </div>

        {error && (
          <div className="mx-4 md:mx-8 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-sm font-bold animate-pulse">
            <FaExclamationCircle className="text-xl shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-white">
           
           <div className="md:col-span-2 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">
             Información Fiscal
           </div>
           
           <div className="space-y-1">
             <label className="text-xs font-bold text-slate-700">RUC <span className="text-red-500">*</span></label>
             <input 
                type="text"
                inputMode="numeric"
                name="ruc"                   
                value={formData.ruc} 
                onChange={handleChange} 
                maxLength={20}
                placeholder="Solo números"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-base md:text-sm font-bold font-mono transition-all"
             />
             <p className="text-[10px] text-slate-400 text-right">{formData.ruc.length}/20</p>
           </div>
           
           <div className="space-y-1">
             <label className="text-xs font-bold text-slate-700">Razón Social <span className="text-red-500">*</span></label>
             <input type="text" name="razon_social" value={formData.razon_social} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-base md:text-sm font-bold transition-all"/>
           </div>

           <div className="md:col-span-2 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2 mt-4">
             Contacto
           </div>

           <div className="relative">
             <FaUser className="absolute top-3.5 left-3 text-slate-400"/>
             <input type="text" name="contacto" value={formData.contacto} onChange={handleChange} placeholder="Nombre Contacto *" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-slate-900 outline-none text-base md:text-sm font-medium"/>
           </div>
           
           <div className="relative">
             <FaPhone className="absolute top-3.5 left-3 text-slate-400"/>
             <input 
                type="text"
                inputMode="tel"
                name="telefono" 
                value={formData.telefono} 
                onChange={handleChange} 
                placeholder="Teléfono (Máx 9 dígitos) *" 
                maxLength={9} 
                className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-slate-900 outline-none text-base md:text-sm font-medium"
             />
           </div>
           
           <div className="relative md:col-span-2">
             <FaEnvelope className="absolute top-3.5 left-3 text-slate-400"/>
             <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="Correo Electrónico" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-slate-900 outline-none text-base md:text-sm font-medium"/>
           </div>
           
           <div className="relative md:col-span-2">
             <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección Fiscal Completa" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-slate-900 outline-none text-base md:text-sm font-medium"/>
           </div>

           <div className="md:col-span-2 mt-2">
             <label className="text-xs font-bold text-slate-700 block mb-1">Estado</label>
             <select name="estado" value={formData.estado} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-slate-900 outline-none text-sm font-bold cursor-pointer">
               <option value="ACTIVO">ACTIVO</option>
               <option value="INACTIVO">INACTIVO</option>
             </select>
           </div>

           {/* Footer: Sticky en móvil, estático en Desktop */}
           <div className="
              md:col-span-2 flex items-center justify-end gap-3
              sticky bottom-0 left-0 right-0 z-20 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]
              -mx-4 px-4 py-4 mb-[-1rem]
              
              md:static md:bg-transparent md:border-none md:shadow-none md:mx-0 md:px-0 md:py-0 md:mb-0 md:mt-6
           ">
               <button type="button" onClick={onClose} className="flex-1 md:flex-none px-6 py-3 rounded-lg font-bold text-slate-500 bg-slate-200 hover:bg-slate-300 transition-colors text-sm">
                 Cancelar
               </button>
               <button type="submit" className="flex-1 md:flex-none px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition shadow-lg">
                 Guardar
               </button>
           </div>
        </form>
      </div>
    </div>
  );
}