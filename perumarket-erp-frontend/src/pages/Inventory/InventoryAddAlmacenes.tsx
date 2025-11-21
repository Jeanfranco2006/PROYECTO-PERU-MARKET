import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
    IoMdArrowRoundBack,
    IoIosPin,
    IoIosPeople,
    IoIosSave,
    IoIosCheckmarkCircle,
    IoIosWarning
} from 'react-icons/io';

export default function InventoryAddAlmacenes() {
    const [showNotification, setShowNotification] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        console.log('Almacén guardado');

        setShowNotification(true);

        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    };

    const handleCancel = () => {
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {showNotification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
                    <IoIosCheckmarkCircle className="w-5 h-5" />
                    <span>¡Almacén guardado correctamente!</span>
                </div>
            )}

            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-yellow-100 p-2 rounded-full">
                                    <IoIosWarning className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Cancelar Creación</h3>
                                    <p className="text-sm text-gray-600">¿Estás seguro de que quieres cancelar? Se perderán todos los datos no guardados.</p>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Continuar Editando
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <IoIosWarning className="w-4 h-4" />
                                    Sí, Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <Link to="/inventario/almacenes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors transform active:scale-[0.95]">
                        <IoMdArrowRoundBack className="w-5 h-5 text-gray-700" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Agregar Nuevo Almacén</h1>
                        <p className="text-gray-600">Registre la información de la nueva ubicación de almacenamiento.</p>
                    </div>
                </div>
            </div>

            <form id="almacen-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <IoIosPin className="w-5 h-5 text-red-500" />
                            Detalles del Almacén
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Asegúrese de ingresar un <strong>Código</strong> único y definir claramente la <strong>Capacidad Total</strong> para una gestión de inventario eficiente.
                        </p>
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="font-semibold text-gray-800">Estado Inicial:</p>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                ACTIVO
                            </span>
                            <p className="text-xs text-gray-500 mt-2">El almacén será creado en estado Activo por defecto.</p>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">Información General</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Almacén *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Ej: Almacén Principal A-01"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código Único *</label>
                                <input
                                    type="text"
                                    name="code"
                                    required
                                    placeholder="Ej: ALM-001"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                            <input
                                type="text"
                                name="address"
                                required
                                placeholder="Av. Los Tulipanes 123, Urb. Primavera"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <IoIosPeople className="w-5 h-5" />
                            Capacidad y Responsable
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                                <input
                                    type="text"
                                    name="responsible"
                                    placeholder="Nombre del encargado"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Total (m³)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="capacityTotal"
                                    placeholder="0.00"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowCancelModal(true)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 transform active:scale-[0.98]"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform active:scale-[0.98] font-medium"
                        >
                            <IoIosSave className="w-5 h-5" />
                            Guardar Almacén
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}