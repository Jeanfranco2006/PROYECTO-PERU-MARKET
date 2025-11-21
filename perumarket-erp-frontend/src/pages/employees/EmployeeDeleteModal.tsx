interface Props {
  visible: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}
export default function DeleteModal({ visible, message, onCancel, onConfirm }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300">
      <div className="bg-white p-6 rounded shadow-lg w-80 transform transition-transform duration-300 scale-100">
        <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
        <p className="text-sm mb-4">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
