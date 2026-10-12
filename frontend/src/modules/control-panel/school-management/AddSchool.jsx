import { useState, useRef } from "react";
import schoolForm from "./schoolForm.json";
import { createSchool, createAddress } from "./api/schoolAPI";

function AddSchool() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value, files, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "file" ? files[0] : value,
    }));
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const addressData = new FormData();

    const addressFields = [
      "province",
      "district",
      "taluka",
      "union_council",
      "city_town",
      "area_locality",
      "house_no_street",
      "postal_code",
    ];

    addressFields.forEach((field) => {
      const value = formData[field];

      if (value !== undefined && value !== null && value !== "") {
        addressData.append(field, value);
      }
    });

    // Create Address first
    const address = await createAddress(addressData);

    // Create School
    const schoolData = new FormData();

    const schoolFields = [
      "school_name",
      "semis_code",
      "school_short_name",
      "branch_identifier",
      "school_type",
      "phone",
      "email",
      "logo",
      "status",
    ];

    schoolFields.forEach((field) => {
      const value = formData[field];

      if (value !== undefined && value !== null && value !== "") {
        schoolData.append(field, value);
      }
    });

    // Connect Address with School
    schoolData.append("address", address.id);

    await createSchool(schoolData);

    setMessage("School added successfully.");

    setFormData({});
    formRef.current.reset();

    setTimeout(() => {
      setMessage("");
    }, 3000);
  } catch (error) {
    console.error("Failed to create school:", error);
    setMessage("Failed to add school.");
  }
};

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Add New School
      </h2>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700">
          {message}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit}>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schoolForm.map((field) => (
            <div
              key={field.name}
              className={
                field.type === "textarea"
                  ? "md:col-span-2"
                  : ""
              }
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  placeholder={field.placeholder || ""}
                  required={field.required || false}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  required={field.required || false}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">
                    Select {field.label}
                  </option>

                  {field.options?.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  placeholder={field.placeholder || ""}
                  required={field.required || false}
                  accept={field.accept || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Add School
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddSchool;
