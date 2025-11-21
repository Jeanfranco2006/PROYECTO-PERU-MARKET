import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  IoMdArrowRoundBack, 
  IoIosDocument, 
  IoIosCash,
  IoIosPrint,
  IoIosCloudDownload,
  IoIosInformationCircle,
  IoIosPeople,
  IoIosList
} from "react-icons/io";

interface Compra {
  id: string;
  numero: string;
  proveedor: string;
  ruc: string;
  fecha: string;
  tipoComprobante: string;
  estado: string;
  subtotalBruto: number;
  descuentoTotal: number;
  subtotalNeto: number;
  igv: number;
  total: number;
  productos: Producto[];
  metodoPago: string;
  fechaVencimiento?: string;
  observaciones?: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  descuento: number;
  subtotal: number;
}

export default function PurchaseHistory() {
  const { id } = useParams<{ id: string }>();
  const [compra, setCompra] = useState<Compra | null>(null);
  const [error, setError] = useState<string | null>(null);

  const comprasMock: Compra[] = [
    {
      id: '1',
      numero: 'F001-0000000933',
      proveedor: 'Tecnolimport SA',
      ruc: '20123456789',
      fecha: '2024-11-15',
      tipoComprobante: 'Factura',
      estado: 'COMPLETADO',
      subtotalBruto: 2655.00,
      descuentoTotal: 14.50,
      subtotalNeto: 2640.50,
      igv: 490.75,
      total: 3131.25,
      metodoPago: 'Contado',
      productos: [
        { id: 1, nombre: 'Laptop HP 15"', precio_unitario: 1200, cantidad: 2, descuento: 0, subtotal: 2400.00 },
        { id: 2, nombre: 'Teclado Mecánico', precio_unitario: 85, cantidad: 3, descuento: 14.50, subtotal: 255.00 },
      ],
      observaciones: 'Compra realizada con descuento por volumen'
    },
    {
      id: '2',
      numero: 'B002-0000105',
      proveedor: 'ElectroPeru S.R.L.',
      ruc: '20198765432',
      fecha: '2024-11-10',
      tipoComprobante: 'Boleta',
      estado: 'PENDIENTE',
      subtotalBruto: 890.50,
      descuentoTotal: 0,
      subtotalNeto: 890.50,
      igv: 160.29,
      total: 1050.79,
      metodoPago: 'Crédito',
      fechaVencimiento: '2024-12-10',
      productos: [
        { id: 3, nombre: 'Mouse Inalámbrico', precio_unitario: 25, cantidad: 5, descuento: 0, subtotal: 125.00 },
        { id: 4, nombre: 'Pad Mouse', precio_unitario: 15, cantidad: 3, descuento: 0, subtotal: 45.00 },
      ]
    },
    {
      id: '3',
      numero: 'F001-0000002',
      proveedor: 'Distribuidora XYZ',
      ruc: '20345678901',
      fecha: '2024-11-01',
      tipoComprobante: 'Factura',
      estado: 'COMPLETADO',
      subtotalBruto: 12500.00,
      descuentoTotal: 250.00,
      subtotalNeto: 12250.00,
      igv: 2205.00,
      total: 14455.00,
      metodoPago: 'Crédito',
      fechaVencimiento: '2024-12-01',
      productos: [
        { id: 5, nombre: 'Monitor 24"', precio_unitario: 300, cantidad: 5, descuento: 250.00, subtotal: 1500.00 },
        { id: 6, nombre: 'Silla Gamer', precio_unitario: 350, cantidad: 2, descuento: 0, subtotal: 700.00 },
      ]
    }
  ];

  useEffect(() => {
    const cargarCompra = () => {
      try {
        if (id) {
          const compraEncontrada = comprasMock.find(c => c.id === id);
          if (compraEncontrada) {
            setCompra(compraEncontrada);
            setError(null);
          } else {
            setError('Compra no encontrada');
          }
        } else {
          setCompra(comprasMock[0]);
        }
      } catch (err) {
        setError('Error al cargar los datos de la compra');
      }
    };

    cargarCompra();
  }, [id]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleImprimir = () => {
    const confirmar = window.confirm('¿Desea imprimir el detalle de esta compra?');
    if (confirmar) {
      window.print();
    }
  };

  const handleExportarPDF = () => {
    const confirmar = window.confirm('¿Desea exportar esta compra a PDF?');
    if (confirmar) {
      alert(`Generando PDF para la compra ${compra?.numero}...`);
      console.log('Exportando a PDF:', compra);
    }
  };

  const getEstadoStyles = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO':
        return 'Completado';
      case 'PENDIENTE':
        return 'Pendiente';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return estado;
    }
  };

  if (error || !compra) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <IoIosInformationCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'No se pudo cargar la compra'}</p>
          <Link 
            to="/compras/historial" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Historial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 print:p-0">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl p-6 md:p-8 print:shadow-none print:rounded-none">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 border-b pb-4 print:border-b-0">
          <div className="flex items-center mb-4 lg:mb-0">
            <Link 
              to="/compras/historial" 
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mr-4 print:hidden"
            >
              <IoMdArrowRoundBack className="h-5 w-5 mr-2" />
              Volver al Historial
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-800 flex items-center">
                <IoIosInformationCircle className="h-6 w-6 lg:h-7 lg:w-7 mr-3 text-blue-600" />
                Detalle de Compra
              </h1>
              <p className="text-blue-600 font-semibold text-lg mt-1">#{compra.numero}</p>
            </div>
          </div>
          
          {/* Estado de la compra */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 font-medium">Estado:</span>
            <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full border ${getEstadoStyles(compra.estado)}`}>
              {getEstadoTexto(compra.estado)}
            </span>
          </div>
        </div>

        {/* Información General */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Datos del Proveedor */}
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 flex items-center mb-4">
              <IoIosPeople className="h-5 w-5 mr-2" />
              Datos del Proveedor
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Proveedor:</span>
                <span className="text-sm font-medium text-right">{compra.proveedor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">RUC:</span>
                <span className="text-sm font-medium">{compra.ruc}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fecha Compra:</span>
                <span className="text-sm font-medium">{formatearFecha(compra.fecha)}</span>
              </div>
            </div>
          </div>

          {/* Comprobante */}
          <div className="bg-white border rounded-lg p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
              <IoIosDocument className="h-5 w-5 mr-2" />
              Comprobante
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tipo:</span>
                <span className="text-sm font-medium">{compra.tipoComprobante}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Número:</span>
                <span className="text-sm font-medium">{compra.numero}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Método Pago:</span>
                <span className="text-sm font-medium">{compra.metodoPago}</span>
              </div>
              {compra.fechaVencimiento && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Vencimiento:</span>
                  <span className="text-sm font-medium">{formatearFecha(compra.fechaVencimiento)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Resumen Económico */}
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-green-800 flex items-center mb-4">
              <IoIosCash className="h-5 w-5 mr-2" />
              Resumen Económico
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-800">Subtotal Bruto:</span>
                <span className="text-sm font-medium">${compra.subtotalBruto.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-800">Descuento Total:</span>
                <span className="text-sm font-semibold text-red-600">-${compra.descuentoTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-800">Subtotal Neto:</span>
                <span className="text-sm font-medium">${compra.subtotalNeto.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-800">IGV (18%):</span>
                <span className="text-sm font-medium">${compra.igv.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-green-300 pt-3 mt-2">
                <span className="text-lg font-bold text-gray-800">TOTAL:</span>
                <span className="text-xl font-extrabold text-green-700">${compra.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        {compra.observaciones && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2">Observaciones</h4>
            <p className="text-sm text-gray-700">{compra.observaciones}</p>
          </div>
        )}

        {/* Tabla de Productos */}
        <div className="bg-white border rounded-lg shadow-lg mb-8 overflow-hidden">
          <h3 className="text-xl font-semibold p-4 bg-gray-100 border-b text-gray-700 flex items-center">
            <IoIosList className="h-5 w-5 mr-2 text-blue-500" />
            Detalle de Productos ({compra.productos.length} productos)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">P. Unitario</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {compra.productos.map((producto, index) => (
                  <tr key={producto.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{producto.nombre}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">${producto.precio_unitario.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{producto.cantidad}</td>
                    <td className="px-4 py-3 text-sm text-right text-red-600 font-semibold">
                      {producto.descuento > 0 ? `-$${producto.descuento.toFixed(2)}` : '$0.00'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">${producto.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-right text-gray-700">
                    Total:
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-right text-green-700">
                    ${compra.total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6 print:hidden">
          <div className="text-sm text-gray-500">
            <p>Compra registrada el {formatearFecha(compra.fecha)}</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              className="flex items-center px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              onClick={handleImprimir}
            >
              <IoIosPrint className="h-5 w-5 mr-2" />
              Imprimir
            </button>
            <button 
              className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              onClick={handleExportarPDF}
            >
              <IoIosCloudDownload className="h-5 w-5 mr-2" />
              Exportar PDF
            </button>
          </div>
        </div>

        {/* Información para impresión */}
        <div className="hidden print:block">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Detalle de Compra #{compra.numero}</h1>
            <p className="text-gray-600">Emitido el {new Date().toLocaleDateString('es-ES')}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <strong>Proveedor:</strong> {compra.proveedor}
            </div>
            <div>
              <strong>RUC:</strong> {compra.ruc}
            </div>
            <div>
              <strong>Fecha:</strong> {formatearFecha(compra.fecha)}
            </div>
            <div>
              <strong>Estado:</strong> {getEstadoTexto(compra.estado)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}