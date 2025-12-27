import React from "react";
import type { Envio } from "../../types/envios/envio";

interface Props {
  show: boolean;
  envio: Envio | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ModalEliminarEnvio({
  show,
  envio,
  onClose,
  onConfirm
}: Props) {
  if (!show || !envio) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Eliminar Envío</h3>

        <p>
          ¿Estás seguro de eliminar el envío del pedido{" "}
          <strong>{envio.pedido.id}</strong>?
        </p>

        <p className="text-sm text-gray-500">
          Esta acción no se puede deshacer.
        </p>

        <div className="modal-actions">
          <button
            className="btn-danger"
            onClick={onConfirm}
          >
            Eliminar
          </button>

          <button
            className="btn-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
