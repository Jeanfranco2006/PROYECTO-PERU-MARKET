import React from 'react';
import { FaTrash, FaCreditCard, FaMoneyBillWave, FaUniversity, FaMobileAlt } from 'react-icons/fa';
import type { Cliente } from '../../types/clientes/Client';
import type { DetallePago, MetodoPago } from '../../types/ventas/ventas';

interface ModalPagoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (detallesPago: DetallePago[]) => void;
  cliente: Cliente | null;
  total: number;
  metodosPago: MetodoPago[];
}

const ModalPago: React.FC<ModalPagoProps> = ({ isOpen, onClose, onConfirmar, cliente, total, metodosPago }) => {
  const inicializarPago = () => ({
    id_metodo_pago: metodosPago[0]?.id || 0,
    monto: total,
    referencia: '',
    numero_tarjeta: '',
    fecha_vencimiento: '',
    cvv: '',
    numero_transferencia: '',
    banco: '',
    numero_operacion: ''
  });

  const [pagoActual, setPagoActual] = React.useState<DetallePago>(inicializarPago());
  const [detallesPago, setDetallesPago] = React.useState<DetallePago[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setPagoActual(inicializarPago());
      setDetallesPago([]);
    }
  }, [isOpen, total, metodosPago]);

  const metodosConIconos = [
    { id: 1, nombre: 'Efectivo', icono: FaMoneyBillWave, color: 'text-green-600' },
    { id: 2, nombre: 'Tarjeta Débito', icono: FaCreditCard, color: 'text-blue-600' },
    { id: 3, nombre: 'Tarjeta Crédito', icono: FaCreditCard, color: 'text-purple-600' },
    { id: 4, nombre: 'Transferencia', icono: FaUniversity, color: 'text-indigo-600' },
    { id: 5, nombre: 'Yape', icono: FaMobileAlt, color: 'text-purple-500' },
    { id: 6, nombre: 'Plin', icono: FaMobileAlt, color: 'text-blue-500' }
  ];

  const getMetodoPagoNombre = (id: number) =>
    metodosPago.find(mp => mp.id === id)?.nombre || 'Desconocido';

  const getIconoMetodo = (id: number) => {
    const metodo = metodosConIconos.find(mp => mp.id === id);
    return metodo ? { Icono: metodo.icono, color: metodo.color } : { Icono: FaCreditCard, color: 'text-gray-600' };
  };

  const validarCamposPago = () => {
    const m = pagoActual.id_metodo_pago;
    if (!pagoActual.monto || pagoActual.monto <= 0) {
      alert('El monto debe ser mayor a 0');
      return false;
    }
    switch (m) {
      case 2:
      case 3:
        if (!pagoActual.numero_tarjeta || !pagoActual.fecha_vencimiento || !pagoActual.cvv) {
          alert('Completa todos los datos de la tarjeta');
          return false;
        }
        break;
      case 4:
        if (!pagoActual.numero_transferencia || !pagoActual.banco) {
          alert('Completa los datos de la transferencia');
          return false;
        }
        break;
      case 5:
      case 6:
        if (!pagoActual.numero_operacion || !pagoActual.referencia) {
          alert('Completa los datos del pago móvil');
          return false;
        }
        break;
    }
    return true;
  };

  const agregarPago = () => {
    if (!validarCamposPago()) return;
    setDetallesPago([...detallesPago, { ...pagoActual }]);
    setPagoActual(inicializarPago());
  };

  const eliminarPago = (index: number) => {
    setDetallesPago(detallesPago.filter((_, i) => i !== index));
  };

  const getTotalPagado = () => detallesPago.reduce((sum, pago) => sum + pago.monto, 0);
  const totalPagado = getTotalPagado();
  const cambio = totalPagado - total;

  const handleConfirmar = () => {
    if (detallesPago.length === 0) {
      alert('Agrega al menos un método de pago');
      return;
    }
    if (totalPagado < total) {
      alert(`El total pagado (S/ ${totalPagado.toFixed(2)}) es menor al total de la venta (S/ ${total.toFixed(2)})`);
      return;
    }
    onConfirmar(detallesPago);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaCreditCard className="mr-2" /> Medios de Pago
          </h3>

          {/* Resumen venta */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Resumen de Venta</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Cliente:</span>
                <p className="font-medium">
                  {cliente?.persona.nombres} {cliente?.persona.apellidoPaterno} {cliente?.persona.apellidoMaterno}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Total a Pagar:</span>
                <p className="font-bold text-blue-600">S/ {total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Formulario de pago */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-3">Agregar Pago</h4>

            {/* Método */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {metodosConIconos.map((metodo) => {
                  const { Icono, color } = getIconoMetodo(metodo.id);
                  return (
                    <button
                      key={metodo.id}
                      onClick={() => setPagoActual({ ...pagoActual, id_metodo_pago: metodo.id })}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        pagoActual.id_metodo_pago === metodo.id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <Icono className={`mx-auto mb-1 ${color}`} size={20} />
                      <span className="text-xs font-medium">{metodo.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Monto editable */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto a Pagar</label>
              <input
                type="number"
                value={pagoActual.monto}
                onChange={(e) => setPagoActual({ ...pagoActual, monto: parseFloat(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                min={0}
                step={0.01}
              />
            </div>

            {/* Campos dinámicos */}
            <div className="mb-3">
              {(() => {
                switch (pagoActual.id_metodo_pago) {
                  case 1:
                    return (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Referencia (Opcional)</label>
                        <input
                          type="text"
                          value={pagoActual.referencia || ''}
                          onChange={(e) => setPagoActual({ ...pagoActual, referencia: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Ej: Pago en efectivo"
                        />
                      </div>
                    );
                  case 2:
                  case 3:
                    return (
                      <div className="grid grid-cols-1 gap-3">
                        <input
                          type="text"
                          value={pagoActual.numero_tarjeta || ''}
                          onChange={(e) => setPagoActual({ ...pagoActual, numero_tarjeta: e.target.value })}
                          placeholder="Número de Tarjeta"
                          className="w-full border rounded px-3 py-2 text-sm"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={pagoActual.fecha_vencimiento || ''}
                            onChange={(e) => setPagoActual({ ...pagoActual, fecha_vencimiento: e.target.value })}
                            placeholder="MM/AA"
                            className="w-full border rounded px-3 py-2 text-sm"
                          />
                          <input
                            type="text"
                            value={pagoActual.cvv || ''}
                            onChange={(e) => setPagoActual({ ...pagoActual, cvv: e.target.value })}
                            placeholder="CVV"
                            className="w-full border rounded px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    );
                  case 4:
                    return (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={pagoActual.numero_transferencia || ''}
                          onChange={(e) => setPagoActual({ ...pagoActual, numero_transferencia: e.target.value })}
                          placeholder="Número de operación"
                          className="w-full border rounded px-3 py-2 text-sm"
                        />
                        <select
                          value={pagoActual.banco || ''}
                          onChange={(e) => setPagoActual({ ...pagoActual, banco: e.target.value })}
                          className="w-full border rounded px-3 py-2 text-sm"
                        >
                          <option value="">Seleccionar banco</option>
                          <option value="BCP">BCP</option>
                          <option value="Interbank">Interbank</option>
                          <option value="BBVA">BBVA</option>
                          <option value="Scotiabank">Scotiabank</option>
                          <option value="Banco de la Nación">Banco de la Nación</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                    );
                  case 5:
                  case 6:
                    return (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={pagoActual.numero_operacion || ''}
                          onChange={(e) => setPagoActual({ ...pagoActual, numero_operacion: e.target.value })}
                          placeholder="Número de operación Yape/Plin"
                          className="w-full border rounded px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          value={pagoActual.referencia || ''}
                          onChange={(e) => setPagoActual({ ...pagoActual, referencia: e.target.value })}
                          placeholder="Teléfono asociado"
                          className="w-full border rounded px-3 py-2 text-sm"
                        />
                      </div>
                    );
                  default:
                    return null;
                }
              })()}
            </div>

            <button
              onClick={agregarPago}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Agregar Pago
            </button>
          </div>

          {/* Pagos registrados */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-3">Pagos Registrados</h4>
            {detallesPago.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">No hay pagos registrados</p>
            ) : (
              <div className="space-y-2">
                {detallesPago.map((pago, index) => {
                  const { Icono, color } = getIconoMetodo(pago.id_metodo_pago);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center flex-1">
                        <Icono className={`mr-3 ${color}`} size={18} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{getMetodoPagoNombre(pago.id_metodo_pago)}</div>
                          {pago.referencia && <div className="text-xs text-gray-600">Ref: {pago.referencia}</div>}
                          {pago.numero_operacion && <div className="text-xs text-gray-600">Op: {pago.numero_operacion}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm">S/ {pago.monto.toFixed(2)}</span>
                        <button onClick={() => eliminarPago(index)} className="text-red-500 hover:text-red-700 text-sm">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Resumen final */}
          <div className="border-t pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total a Pagar:</span>
                <span className="font-semibold">S/ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Pagado:</span>
                <span className="font-semibold">S/ {totalPagado.toFixed(2)}</span>
              </div>
              {cambio !== 0 && (
                <div className={`flex justify-between ${cambio > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{cambio > 0 ? 'Cambio:' : 'Falta pagar:'}</span>
                  <span className="font-semibold">S/ {Math.abs(cambio).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Botones modal */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              disabled={totalPagado < total}
              className={`flex-1 py-2 rounded transition-colors text-sm sm:text-base ${
                totalPagado >= total ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              Confirmar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPago;
