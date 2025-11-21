import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    IoIosCube,
    IoIosStats,
    IoIosPulse,
    IoMdArrowDropdown,
    IoIosSearch,
    IoMdHome,
    IoMdAdd,
    IoMdCheckmarkCircle,
    IoIosCart,
    IoMdClipboard,
    IoIosPin,
    IoIosBuild,
    IoIosPeople,
    IoMdCreate,
    IoMdRefresh,
    IoMdTrash,
    IoIosArchive,
    IoIosBarcode
} from 'react-icons/io';

interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    status: 'Disponible' | 'Stock Bajo' | 'Sin Stock';
    price: number;
    sku: string;
    barcode: string;
    stock: number;
    minStock: number;
    maxStock: number;
    purchases: number;
    sales: number;
    orders: number;
    weight: number;
    unit: string;
    location: string;
    warehouse: string;
    supplier: string;
    cost: number;
}

const productData: Product[] = [
    {
        id: 1,
        name: "ANITA TALLARIN",
        description: "Ricos y deliciosos",
        category: "Fideos",
        status: "Disponible",
        price: 12.00,
        sku: "BULB-FA-001",
        barcode: "1234567890123",
        stock: 12,
        minStock: 5,
        maxStock: 50,
        purchases: 2,
        sales: 3,
        orders: 1,
        weight: 0.5,
        unit: "Unidad",
        location: "A-12-B-04",
        warehouse: "Almacén Principal",
        supplier: "BULB Industries",
        cost: 15.00,
    },
    {
        id: 2,
        name: "LENTEJA VERDE",
        description: "Menestra de alta calidad",
        category: "Menestras",
        status: "Stock Bajo",
        price: 8.50,
        sku: "MENS-LV-002",
        barcode: "9876543210987",
        stock: 4,
        minStock: 5,
        maxStock: 30,
        purchases: 5,
        sales: 10,
        orders: 2,
        weight: 1.0,
        unit: "Kilogramo",
        location: "B-01-C-10",
        warehouse: "Almacén Norte",
        supplier: "EFFRON Tools",
        cost: 6.00,
    },
    {
        id: 3,
        name: "RESISTENCIA M-10",
        description: "Resistencia electrónica 10 ohms",
        category: "Electrónicos",
        status: "Sin Stock",
        price: 5.00,
        sku: "ELEC-RM-003",
        barcode: "1122334455667",
        stock: 0,
        minStock: 10,
        maxStock: 100,
        purchases: 1,
        sales: 0,
        orders: 0,
        weight: 0.01,
        unit: "Unidad",
        location: "C-05-D-01",
        warehouse: "Almacén Sur",
        supplier: "E4fixe Technologies",
        cost: 3.50,
    },
];

const BarcodeDisplay = ({ barcode }: { barcode: string }) => {
    return (
        <div className="bg-white p-4 rounded-lg border border-gray-300">
            <div className="text-center mb-3">
                <div className="flex items-center justify-center gap-2 text-gray-700">
                    <IoIosBarcode className="w-5 h-5" />
                    <span className="font-semibold">Código de Barras</span>
                </div>
            </div>

            <div className="bg-white p-4 border-2 border-gray-400 rounded">
                <div className="flex justify-center items-center space-x-1 mb-2">
                    {barcode.split('').map((_, index) => (
                        <div
                            key={index}
                            className={`h-12 w-1 ${Math.random() > 0.3 ? 'bg-black' : 'bg-white'} border border-gray-300`}
                        />
                    ))}
                </div>

                <div className="text-center font-mono text-sm tracking-widest bg-white py-2">
                    {barcode.split('').map((digit, index) => (
                        <span
                            key={index}
                            className={`inline-block w-3 text-center ${index === 0 || index === barcode.length - 1 ? 'font-bold' : ''}`}
                        >
                            {digit}
                        </span>
                    ))}
                </div>

                <div className="text-center text-xs text-gray-600 mt-2 space-y-1">
                    <div>SKU: {productData.find(p => p.barcode === barcode)?.sku}</div>
                    <div>Formato: EAN-13</div>
                </div>
            </div>

            <div className="flex gap-2 mt-3">
                <button
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                    onClick={() => {
                        navigator.clipboard.writeText(barcode);
                        alert('Código copiado al portapapeles');
                    }}
                >
                    <span>Copiar Código</span>
                </button>
                <button
                    className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
                    onClick={() => window.print()}
                >
                    <span>Imprimir</span>
                </button>
            </div>
        </div>
    );
};

export default function Inventory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showBarcodeModal, setShowBarcodeModal] = useState(false);

    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(productData.map(p => p.category)));
        return ['all', ...uniqueCategories];
    }, []);

    const filteredProducts = useMemo(() => {
        return productData.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.barcode.includes(searchTerm);

            const matchesCategory = filterCategory === 'all' || product.category === filterCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, filterCategory]);

    const totalValue = productData.reduce((sum, p) => sum + p.stock * p.price, 0);
    const lowStockCount = productData.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
    const outOfStockCount = productData.filter(p => p.stock === 0).length;

    const handleShowBarcode = (product: Product) => {
        setSelectedProduct(product);
        setShowBarcodeModal(true);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">INVENTARIO</h1>

            {showBarcodeModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Código de Barras - {selectedProduct.name}</h3>
                            <button
                                onClick={() => setShowBarcodeModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <BarcodeDisplay barcode={selectedProduct.barcode} />
                            <div className="mt-4 text-sm text-gray-600">
                                <p><strong>Producto:</strong> {selectedProduct.name}</p>
                                <p><strong>SKU:</strong> {selectedProduct.sku}</p>
                                <p><strong>Categoría:</strong> {selectedProduct.category}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{productData.length}</div>
                    <div className="flex items-center gap-2">
                        <IoIosCube className="w-6 h-6 text-purple-500" />
                        <span>Productos</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">S/{totalValue.toFixed(2)}</div>
                    <div className="flex items-center gap-2">
                        <IoIosStats className="w-6 h-6 text-blue-600" />
                        <span>Valor Total</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{lowStockCount}</div>
                    <div className="flex items-center gap-2">
                        <IoIosPulse className="w-6 h-6 text-amber-300" />
                        <span>Stock Bajo</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{outOfStockCount}</div>
                    <div className="flex items-center gap-2">
                        <IoMdArrowDropdown className="w-6 h-6 text-amber-500" />
                        <span>Sin Stock</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 col-span-1 md:col-span-4">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                        <div className="flex-1 relative">
                            <IoIosSearch className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                            <input
                                placeholder="Buscar Producto, SKU o Código de Barras..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="all">Filtrar por categoría</option>
                            {categories.filter(c => c !== 'all').map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <Link
                            to="/inventario/almacenes"
                            className="px-4 py-2 rounded-lg bg-blue-400 text-white flex items-center gap-2 hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 transform active:scale-[0.98]"
                        >
                            <IoMdHome className="w-6 h-6 text-white" />
                            <span>Almacenes</span>
                        </Link>

                        <Link
                            to="/inventario/nuevo"
                            className="px-4 py-2 rounded-lg bg-emerald-500 text-white flex items-center gap-2 hover:bg-emerald-600 active:bg-emerald-700 transition-all duration-200 transform active:scale-[0.98]"
                        >
                            <IoMdAdd className="w-6 h-6 text-white" />
                            <span>Nuevo Producto</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                    const margin = ((product.price - product.cost) / product.cost) * 100;
                    const statusColor = product.status === 'Disponible' ? 'bg-green-100 text-green-700' :
                        product.status === 'Stock Bajo' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700';

                    return (
                        <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="h-24 bg-gray-100 rounded-lg relative flex items-center justify-center">
                                <div className="absolute top-2 left-2">
                                    <span className="text-xs font-medium text-gray-700 bg-white/90 px-2 py-1 rounded border">
                                        {product.category}
                                    </span>
                                </div>
                                <div className={`absolute top-2 right-2 flex items-center gap-1 ${statusColor} px-2 py-1 rounded-full text-xs font-medium`}>
                                    <IoMdCheckmarkCircle className="w-4 h-4" />
                                    {product.status}
                                </div>
                                <span className="text-gray-400 text-xs">SIN IMAGEN</span>
                            </div>

                            <div className="mt-4">
                                <h3 className="font-bold text-gray-900">{product.name}</h3>
                                <p className="text-sm text-gray-600">{product.description}</p>
                            </div>

                            <div className="flex justify-between items-center mt-3">
                                <span className="text-2xl font-bold text-gray-900">S/{product.price.toFixed(2)}</span>
                                <div className="text-right">
                                    <div className="text-sm text-gray-600">SKU: {product.sku}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <IoIosBarcode className="w-3 h-3" />
                                        {product.barcode}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg mt-3 border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <IoIosBarcode className="w-4 h-4" />
                                        Código de Barras
                                    </span>
                                    <button
                                        onClick={() => handleShowBarcode(product)}
                                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Ver
                                    </button>
                                </div>
                                <div className="text-xs font-mono bg-white p-2 rounded border text-center">
                                    {product.barcode}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <div className="bg-blue-50 p-3 rounded text-center">
                                    <div className="text-xl font-bold text-blue-700">{product.stock}</div>
                                    <div className="text-xs text-blue-600">Stock Actual</div>
                                </div>
                                <div className="bg-orange-50 p-3 rounded text-center">
                                    <div className="text-lg font-bold text-orange-700">{product.minStock}</div>
                                    <div className="text-xs text-orange-600">Mínimo</div>
                                </div>
                                <div className="bg-green-50 p-3 rounded text-center">
                                    <div className="text-lg font-bold text-green-700">{product.maxStock}</div>
                                    <div className="text-xs text-green-600">Máximo</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <div className="bg-purple-50 p-2 rounded text-center">
                                    <IoIosCart className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                                    <div className="text-sm font-bold text-purple-700">{product.purchases}</div>
                                    <div className="text-xs text-purple-600">Compras</div>
                                </div>
                                <div className="bg-indigo-50 p-2 rounded text-center">
                                    <IoMdClipboard className="w-5 h-5 mx-auto text-indigo-600 mb-1" />
                                    <div className="text-sm font-bold text-indigo-700">{product.sales}</div>
                                    <div className="text-xs text-indigo-600">Ventas</div>
                                </div>
                                <div className="bg-teal-50 p-2 rounded text-center">
                                    <IoIosArchive className="w-5 h-5 mx-auto text-teal-600 mb-1" />
                                    <div className="text-sm font-bold text-teal-700">{product.orders}</div>
                                    <div className="text-xs text-teal-600">Pedidos</div>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 mt-4">
                                <div className="flex justify-between items-center">
                                    <span>Peso:</span>
                                    <span className="font-medium">{product.weight} kg</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Unidad:</span>
                                    <span className="font-medium">{product.unit}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1">
                                        <IoIosPin className="w-4 h-4" /> Ubicación:
                                    </span>
                                    <span className="font-medium">{product.location}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1">
                                        <IoIosBuild className="w-4 h-4" /> Almacén:
                                    </span>
                                    <span className="font-medium text-blue-600">{product.warehouse}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1">
                                        <IoIosPeople className="w-4 h-4" /> Proveedor:
                                    </span>
                                    <span className="font-medium">{product.supplier}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg mt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Costo:</span>
                                    <span className="font-bold text-gray-900">S/{product.cost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-gray-600">Margen:</span>
                                    <span className="font-bold text-green-600">{margin.toFixed(1)}%</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Link
                                    to={`/inventario/editar/${product.id}`}
                                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform active:scale-[0.98] text-sm"
                                >
                                    <IoMdCreate className="w-5 h-5" />
                                    Editar
                                </Link>
                                <Link
                                    to={`/inventario/movimientos/${product.id}`}
                                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 active:bg-green-800 transition-all duration-200 transform active:scale-[0.98] text-sm"
                                >
                                    <IoMdRefresh className="w-5 h-5" />
                                    Movimientos
                                </Link>
                                <button
                                    className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 active:bg-red-800 transition-all duration-200 transform active:scale-[0.98] text-sm"
                                >
                                    <IoMdTrash className="w-5 h-5" />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}