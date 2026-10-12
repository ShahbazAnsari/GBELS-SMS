import { useEffect, useState } from "react";
import ConfirmModal from "../../../components/ConfirmModal";

import {
  getMediums,
  createMedium,
  updateMedium,
  deleteMedium,
  toggleMediumActive,
} from "./api/mediumAPI";

function Medium() {
  const [medium, setMedium] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    medium_name: "",
    is_active: true,
  });

  const loadMediums = async () => {
    try {
      const data = await getMediums();

      setMedium(
        Array.isArray(data)
          ? data
          : Array.isArray(data.results)
            ? data.results
            : [],
      );
    } catch (error) {
      console.error("Error loading Mediums:", error);
      setMedium([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMediums();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (Medium) => {
    setEditingId(Medium.id);

    setFormData({
      medium_name: Medium.medium_name,
      is_active: Medium.is_active,
    });

    setSuccessMessage("");
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteMedium(deleteId);

      setDeleteId(null);

      setSuccessMessage("Medium deleted successfully.");

      loadMediums();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Medium Delete Error:", error);
      alert(error.message);
    }
  };

  const handleToggleActive = async (Medium) => {
    try {
      await toggleMediumActive(
        Medium.id,
        !Medium.is_active
      );

      setSuccessMessage(
        Medium.is_active
          ? "Medium deactivated successfully."
          : "Medium activated successfully."
      );

      loadMediums();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Medium Status Error:", error);
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = {
        medium_name: formData.medium_name,
        is_active: formData.is_active,
      };

      if (editingId) {
        await updateMedium(editingId, data);
      } else {
        await createMedium(data);
      }

      setSuccessMessage(
        editingId
          ? "Medium updated successfully."
          : "Medium created successfully.",
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setFormData({
        medium_name: "",
        is_active: true,
      });

      setEditingId(null);

      loadMediums();
    } catch (error) {
      console.error("Medium Error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Medium
      </h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Medium" : "Add Medium"}
        </h2>

        {successMessage && (
          <div className="mb-4 rounded-lg bg-green-100 border border-green-300 text-green-700 px-4 py-3">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Medium Name
            </label>

            <input
              type="text"
              name="medium_name"
              value={formData.medium_name}
              onChange={handleChange}
              placeholder="URDU"
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
                ? "Update Medium"
                : "Add Medium"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Medium List
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : medium.length === 0 ? (
          <p className="text-gray-500">
            No Mediums found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-3 text-center">
                    Medium
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
                {medium.map((Medium) => (
                  <tr
                    key={Medium.id}
                    className="text-center"
                  >
                    <td className="border border-gray-200 p-3">
                      {Medium.medium_name}
                    </td>

                    <td className="border border-gray-200 p-3">
                      {Medium.is_active ? (
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
                          onClick={() => handleEdit(Medium)}
                          title="Edit"
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          ✏️
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleActive(Medium)
                          }
                          title={
                            Medium.is_active
                              ? "Deactivate"
                              : "Activate"
                          }
                          className={
                            Medium.is_active
                              ? "text-green-600 hover:text-green-800 text-lg transition"
                              : "text-gray-500 hover:text-green-600 text-lg transition"
                          }
                        >
                          {Medium.is_active ? "🔓" : "🔒"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(Medium.id)
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
          title="Delete Medium?"
          message={
            <>
              Are you sure you want to delete this Medium?
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

export default Medium;