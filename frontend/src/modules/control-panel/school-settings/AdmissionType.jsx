import { useEffect, useState } from "react";
import ConfirmModal from "../../../components/ConfirmModal";

import {
  getAdmissionTypes,
  createAdmissionType,
  updateAdmissionType,
  deleteAdmissionType,
  toggleAdmissionTypeActive,
} from "./api/admissionTypeAPI";

function AdmissionType() {
  const [admissionType, setAdmissionType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    admission_type_name: "",
    is_active: true,
  });

  const loadAdmissionType = async () => {
    try {
      const data = await getAdmissionTypes();

      setAdmissionType(
        Array.isArray(data)
          ? data
          : Array.isArray(data.results)
            ? data.results
            : [],
      );
    } catch (error) {
      console.error("Error loading Admission Types:", error);
      setAdmissionType([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmissionType();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (AdmissionType) => {
    setEditingId(AdmissionType.id);

    setFormData({
      admission_type_name: AdmissionType.admission_type_name,
      is_active: AdmissionType.is_active,
    });

    setSuccessMessage("");
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteAdmissionType(deleteId);

      setDeleteId(null);

      setSuccessMessage("AdmissionType deleted successfully.");

      loadAdmissionType();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Admission Type Delete Error:", error);
      alert(error.message);
    }
  };

  const handleToggleActive = async (AdmissionType) => {
    try {
      await toggleAdmissionTypeActive(
        AdmissionType.id,
        !AdmissionType.is_active
      );

      setSuccessMessage(
        AdmissionType.is_active
          ? "Admission Type deactivated successfully."
          : "Admission Type activated successfully."
      );

      loadAdmissionType();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Admission Type Status Error:", error);
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = {
        admission_type_name: formData.admission_type_name,
        is_active: formData.is_active,
      };

      if (editingId) {
        await updateAdmissionType(editingId, data);
      } else {
        await createAdmissionType(data);
      }

      setSuccessMessage(
        editingId
          ? "Admission Type updated successfully."
          : "Admission Type created successfully.",
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setFormData({
        admission_type_name: "",
        is_active: true,
      });

      setEditingId(null);

      loadAdmissionType();
    } catch (error) {
      console.error("Admission Type Error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Admission Type
      </h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Admission Type" : "Add Admission Type"}
        </h2>

        {successMessage && (
          <div className="mb-4 rounded-lg bg-green-100 border border-green-300 text-green-700 px-4 py-3">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Admission Type Name
            </label>

            <input
              type="text"
              name="admission_type_name"
              value={formData.admission_type_name}
              onChange={handleChange}
              placeholder="Government"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4"
            />

            <label className="text-sm font-medium">
              Set as Active
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-5 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Admission Type"
                : "Add Admission Type"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Admission Type List
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : admissionType.length === 0 ? (
          <p className="text-gray-500">
            No Admission Type found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-3 text-center">
                    Admission Type
                  </th>

                  <th className="border border-gray-200 p-3 text-center">
                    Status
                  </th>

                  <th className="border border-gray-200 p-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {admissionType.map((AdmissionType) => (
                  <tr
                    key={AdmissionType.id}
                    className="text-center"
                  >
                    <td className="border border-gray-200 p-3">
                      {AdmissionType.admission_type_name}
                    </td>

                    <td className="border border-gray-200 p-3">
                      {AdmissionType.is_active ? (
                        <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="border border-gray-200 p-3">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(AdmissionType)}
                          title="Edit"
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          ✏️
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleActive(AdmissionType)
                          }
                          title={
                            AdmissionType.is_active
                              ? "Deactivate"
                              : "Activate"
                          }
                          className={
                            AdmissionType.is_active
                              ? "text-green-600 hover:text-green-800 text-lg transition"
                              : "text-gray-500 hover:text-green-600 text-lg transition"
                          }
                        >
                          {AdmissionType.is_active ? "🔓" : "🔒"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(AdmissionType.id)
                          }
                          title="Delete"
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteId && (
        <ConfirmModal
          isOpen={!!deleteId}
          title="Delete AdmissionType?"
          message={
            <>
              Are you sure you want to delete this AdmissionType?
              <br />
              This action cannot be undone.
            </>
          }
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default AdmissionType;