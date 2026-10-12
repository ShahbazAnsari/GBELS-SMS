//  Confirm Modal for delete
const ConfirmModal = ({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Yes, Delete",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        {/* Icon + Title + Message */}
        <div className="flex flex-col items-center px-6 pt-7">

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <span className="text-3xl">🗑️</span>
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-800">
            {title}
          </h2>

          <p className="mt-2 text-center text-sm text-gray-500">
            {message}
          </p>

        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 px-6 py-6">

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            {confirmText}
          </button>

        </div>

      </div>
    </div>
  );
};

export default ConfirmModal;
