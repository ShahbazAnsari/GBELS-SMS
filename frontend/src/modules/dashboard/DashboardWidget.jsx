function DashboardWidget({ title, value, onClose }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
        title="Hide widget"
      >
        ×
      </button>

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-gray-800 mt-2">
        {value}
      </h2>
    </div>
  );
}

export default DashboardWidget;