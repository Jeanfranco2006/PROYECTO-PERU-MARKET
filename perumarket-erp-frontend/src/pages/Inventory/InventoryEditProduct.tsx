import React, { useState, useRef } from "react";
import { Link } from 'react-router-dom';
import {
  IoMdArrowRoundBack,
  IoIosSave,
  IoIosCube,
  IoIosClock,
  IoIosCash,
  IoIosArchive,
  IoIosBarcode,
  IoIosCloudUpload,
  IoIosCheckmarkCircle,
  IoIosWarning
} from "react-icons/io";

const ProductForm: React.FC = () => {
  const productId = 2;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [barcode, setBarcode] = useState("1234567890123");
  const [showNotification, setShowNotification] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateBarcode = () => {
    const base = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(base[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checksum = (10 - (sum % 10)) % 10;
    const newBarcode = base + checksum;
    setBarcode(newBarcode);
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Producto actualizado');
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };


  const handleDeactivateProduct = () => {
    console.log('Producto desactivado');
    setShowDeactivateModal(false);

  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;

        const changeEvent = new Event('change', { bubbles: true });
        input.dispatchEvent(changeEvent);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <IoIosCheckmarkCircle className="w-5 h-5" />
          <span>¡Producto actualizado exitosamente!</span>
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
                  <h3 className="text-lg font-semibold text-gray-900">Cancelar Edición</h3>
                  <p className="text-sm text-gray-600">¿Estás seguro de que quieres cancelar? Se perderán todos los cambios no guardados.</p>
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
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <IoIosWarning className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Desactivar Producto</h3>
                  <p className="text-sm text-gray-600">¿Estás seguro de que quieres desactivar este producto?</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> El producto ya no estará disponible para ventas y se ocultará del inventario activo.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeactivateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeactivateProduct}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <IoIosWarning className="w-4 h-4" />
                  Sí, Desactivar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Link to="/inventario" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <IoMdArrowRoundBack className="h-5 w-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Producto #{productId}</h1>
            <p className="text-gray-600">Modifique la información del producto</p>
          </div>
        </div>
      </div>

      <form id="edit-product-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <IoIosCube className="h-5 w-5" />
                Vista Previa
              </h3>
              <div className="text-center mb-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="w-32 h-32 rounded-lg mx-auto mb-3 object-cover border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors transform translate-x-1/2 -translate-y-1/2"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-blue-50 rounded-lg mx-auto mb-3 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                    <IoIosCube className="h-8 w-8 text-blue-400" />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {imagePreview ? 'Imagen actualizada' : 'Sin imagen'}
                </p>
              </div>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors mb-4"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <IoIosCloudUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Arrastra o haz click para cambiar</p>
                <p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                <input
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  id="imagen-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="imagen-upload"
                  className="mt-2 bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 cursor-pointer inline-block"
                >
                  Cambiar imagen
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">FIBRE AIRS Professional</h4>
                  <p className="text-sm text-gray-600">Materiales</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">S/20.00</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">DISPONIBLE</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Stock: 12 unidades</div>
                  <div>SKU: BULB-FA-001</div>
                  <div>Proveedor: BULB Industries</div>
                  <div>Almacén: Almacén Principal</div>
                  <div>Ubicación: A-12-B-04</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <IoIosClock className="h-5 w-5" />
                Historial de Cambios
              </h3>
              <div className="space-y-3">
                <div className="border-l-2 border-blue-500 pl-3 py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">Stock actualizado</p>
                      <p className="text-xs text-gray-600">12 unidades</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">15 nov 2024, 9:55 PM</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Por: Admin</p>
                </div>
                <div className="border-l-2 border-blue-500 pl-3 py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">Precio modificado</p>
                      <p className="text-xs text-gray-600">S/18 → S/20</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">10 nov 2024, 2:30 PM</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Por: Admin</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold mb-4">Información del Producto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    type="text"
                    defaultValue="FIBRE AIRS Professional"
                    name="nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" name="categoria" defaultValue="Materiales">
                    <option value="Materiales">Materiales</option>
                    <option value="Herramientas">Herramientas</option>
                    <option value="Farmacéuticos">Farmacéuticos</option>
                    <option value="Electrónicos">Electrónicos</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    type="text"
                    defaultValue="BULB-FA-001"
                    name="sku"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
                  <div className="flex gap-2">
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      name="barcode"
                    />
                    <button
                      type="button"
                      onClick={generateBarcode}
                      className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm whitespace-nowrap"
                    >
                      Generar
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <IoIosBarcode className="w-4 h-4" />
                  Vista Previa del Código de Barras
                </h4>
                <div className="bg-white p-4 rounded border">
                  <div className="flex justify-center items-center space-x-1 mb-2">
                    {barcode.split('').map((_, index) => (
                      <div
                        key={index}
                        className="h-10 w-1 bg-black border border-gray-300"
                      />
                    ))}
                  </div>
                  <div className="text-center font-mono text-sm tracking-widest">
                    {barcode}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(barcode)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Copiar Código
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    Imprimir
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <IoIosCash className="h-5 w-5" />
                Precios y Stock
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Venta (S/)</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    type="number"
                    defaultValue={20}
                    step={0.01}
                    name="precio_venta"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Compra (S/)</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    type="number"
                    defaultValue={15}
                    step={0.01}
                    name="precio_compra"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Actual</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    type="number"
                    defaultValue={12}
                    name="stock"
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <IoIosArchive className="h-5 w-5" />
                Especificaciones
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Medida</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" name="unidad_medida" defaultValue="Unidad">
                    <option value="Unidad">Unidad</option>
                    <option value="Caja">Caja</option>
                    <option value="Frasco">Frasco</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    type="number"
                    step={0.001}
                    defaultValue={0.5}
                    name="peso_kg"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(true)}
                className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <IoIosWarning className="w-4 h-4" />
                Desactivar Producto
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                  <IoIosSave className="h-5 w-5" />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;