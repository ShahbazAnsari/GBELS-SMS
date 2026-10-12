function ViewModal({
  title = "Details",
  data = {},
  fields = [],
  onClose,
}) {
  const imageField = fields.find(
    (field) =>
      field.type === "file" &&
      data[field.name]
  );

  const detailFields = fields.filter(
    (field) => field.type !== "file"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">

          {/* Logo */}
          {imageField && (
            <div className="flex justify-center mb-8">
              <img
                src={data[imageField.name]}
                alt={imageField.label}
                className="w-24 h-24 object-contain rounded-xl p-2"
              />
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {detailFields.map((field) => (
              <div key={field.name}>
                <p className="text-sm font-medium text-gray-500">
                  {field.label}
                </p>

                <div className="mt-1 text-gray-800">
                  {field.render
                    ? field.render(
                        data[field.name],
                        data
                      )
                    : data[field.name] ?? "-"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-5 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default ViewModal;
