import fields from "./addressForm.json";

function AddressForm({ address, onChange, prefix = "address" }) {
  return (
    <>
      {fields.map((field) => {
        const inputName = `${prefix}.${field.name}`;

        return (
          <div key={field.name} className="min-w-0">
            <label
              htmlFor={inputName}
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              {field.label}

              {field.required && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </label>

            <input
              id={inputName}
              type="text"
              name={inputName}
              placeholder={field.placeholder || `Enter ${field.label}`}
              required={field.required}
              value={address?.[field.name] || ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        );
      })}
    </>
  );
}

export default AddressForm;
