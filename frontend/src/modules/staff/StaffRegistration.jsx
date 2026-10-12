import { useState } from "react";
import staffForm from "./staffForm.json";
import { createStaff } from "./api/staffAPI";

const StaffRegistration = () => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      data.append(key, value);
    }
  });

  try {
    const result = await createStaff(data);

    console.log("Staff Created:", result);

    alert("Staff registered successfully!");

    setFormData({});
  } catch (error) {
    console.error(error);
    alert("Failed to register staff.");
  }
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Staff Registration
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {staffForm.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>

              {/* Select */}
              {field.type === "select" && (
                <select
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">
                    Select {field.label}
                  </option>

                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {/* File / Picture */}
              {field.type === "file" && (
                <>
                  <input
                    type="file"
                    name={field.name}
                    onChange={handleChange}
                    required={field.required}
                    accept={field.accept}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />

                  {formData[field.name] && (
                    <img
                      src={URL.createObjectURL(formData[field.name])}
                      alt="Staff Preview"
                      className="mt-3 w-32 h-40 object-cover rounded border"
                    />
                  )}
                </>
              )}

              {/* Normal Input */}
              {field.type !== "select" &&
                field.type !== "file" && (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Save Staff
        </button>
      </form>
    </div>
  );
};

export default StaffRegistration;