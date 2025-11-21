import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import {
  IoMdArrowBack,
  IoIosCloudUpload,
  IoIosCash,
  IoIosCube,
  IoIosBarcode,
  IoIosCheckmarkCircle,
  IoIosWarning
} from 'react-icons/io';

export default function InventoryAddProduct() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [barcode, setBarcode] = useState('');
  const [showNotification, setShowNotification] = useState(false);
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

    console.log('Producto guardado');

    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
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

  const copyBarcode = () => {
    if (barcode) {
      navigator.clipboard.writeText(barcode);
      alert('Código de barras copiado al portapapeles');
    }
  };

  const printBarcode = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <IoIosCheckmarkCircle className="w-5 h-5" />
          <span>¡Producto guardado exitosamente!</span>
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
          <Link to="/inventario">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <IoMdArrowBack className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agregar Producto</h1>
            <p className="text-gray-600">Complete la información del nuevo producto</p>
          </div>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <IoIosCube className="w-5 h-5" />
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
                  {imagePreview ? 'Imagen seleccionada' : 'Sin imagen'}
                </p>
              </div>

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors mb-4"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <IoIosCloudUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Arrastra o haz click para subir</p>
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
                  Seleccionar archivo
                </label>
              </div>

              {/* Información del producto - Similar a Edit pero para nuevo producto */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Nuevo Producto</h4>
                  <p className="text-sm text-gray-600">Información básica</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">S/0.00</span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">NUEVO</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Stock: 0 unidades</div>
                  <div>SKU: Por asignar</div>
                  <div>Proveedor: Por seleccionar</div>
                  <div>Almacén: Por seleccionar</div>
                  <div>Ubicación: Por asignar</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto *</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                  <select
                    name="categoria"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="Materiales">Materiales</option>
                    <option value="Herramientas">Herramientas</option>
                    <option value="Farmacéuticos">Farmacéuticos</option>
                    <option value="Electrónicos">Electrónicos</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    name="sku"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor *</label>
                  <select
                    name="proveedor"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar proveedor</option>
                    <option value="BULB Industries">BULB Industries</option>
                    <option value="EFFRON Tools">EFFRON Tools</option>
                    <option value="EFFRON Pharma">EFFRON Pharma</option>
                    <option value="E4fixe Technologies">E4fixe Technologies</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    name="descripcion"
                    rows={3}
                    placeholder="Describe las características del producto..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* SECCIÓN: Código de Barras */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <IoIosBarcode className="w-5 h-5" />
                Código de Barras
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras *</label>
                  <input
                    type="text"
                    name="codigo_barras"
                    required
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Ej: 1234567890123"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ingrese el código de barras EAN-13</p>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={generateBarcode}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    Generar Automático
                  </button>
                </div>
              </div>

              {barcode && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="flex justify-center items-center space-x-1 mb-2">
                      {barcode.split('').map((_, index) => (
                        <div
                          key={index}
                          className="h-8 w-1 bg-black border border-gray-300"
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 font-mono tracking-widest">
                      {barcode}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Vista previa del código de barras</p>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={copyBarcode}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Copiar Código
                    </button>
                    <button
                      type="button"
                      onClick={printBarcode}
                      className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700 transition-colors"
                    >
                      Imprimir
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <IoIosCash className="w-5 h-5" />
                Precios y Stock
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Venta (S/)</label>
                  <input type="number" step="0.01" name="precio_venta" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Compra (S/)</label>
                  <input type="number" step="0.01" name="precio_compra" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
                  <input type="number" name="stock" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
                  <input type="number" name="stock_minimo" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Máximo</label>
                  <input type="number" name="stock_maximo" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <IoIosCube className="w-5 h-5" />
                Especificaciones
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Medida</label>
                  <select name="unidad_medida" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                    <option value="Unidad">Unidad</option>
                    <option value="Caja">Caja</option>
                    <option value="Frasco">Frasco</option>
                    <option value="Paquete">Paquete</option>
                    <option value="Kit">Kit</option>
                    <option value="Litro">Litro</option>
                    <option value="Kilogramo">Kilogramo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                  <input type="number" step="0.001" name="peso_kg" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Almacén</label>
                  <select name="almacen" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                    <option value="Almacén Principal">Almacén Principal</option>
                    <option value="Almacén Norte">Almacén Norte</option>
                    <option value="Almacén Sur">Almacén Sur</option>
                    <option value="Almacén Este">Almacén Este</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <input type="text" name="ubicacion" placeholder="Ej: A-12-B-04" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center pt-6">
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform active:scale-[0.98]"
                >
                  Guardar Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}