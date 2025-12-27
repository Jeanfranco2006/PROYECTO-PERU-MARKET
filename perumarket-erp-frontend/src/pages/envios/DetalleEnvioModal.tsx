import React from "react";
import type { Envio } from "../../types/envios/envio";

interface Props {
  envio: Envio;
  onClose: () => void;
}

export default function ModalDetalleEnvio({ envio, onClose }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Detalle del Envío</h3>

        <p><b>Pedido:</b> {envio.pedido.id}</p>
        <p><b>Dirección:</b> {envio.direccionEnvio}</p>
        <p><b>Estado:</b> {envio.estado}</p>

        <p><b>Vehículo:</b> {envio.vehiculo?.placa || "No asignado"}</p>
        <p><b>Conductor:</b> {envio.conductor?.licencia || "No asignado"}</p>
        <p><b>Ruta:</b> {envio.ruta?.nombre || "No asignada"}</p>

        <p><b>Costo:</b> S/ {envio.costoTransporte ?? "-"}</p>
        <p><b>Observaciones:</b> {envio.observaciones || "-"}</p>

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
