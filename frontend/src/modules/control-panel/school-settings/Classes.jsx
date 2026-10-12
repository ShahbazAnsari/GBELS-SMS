import { useEffect, useState } from "react";
import ConfirmModal from "../../../components/ConfirmModal";

import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  toggleClassActive,
} from "./api/classAPI";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    class_name: "",
    order: "",
    is_active: true,
  });

  // Load Classes
  const loadClasses = async () => {

  try {

    const data = await getClasses();


    setClasses(
      Array.isArray(data)
        ? data
        : Array.isArray(data.results)
          ? data.results
          : [],
    );
  } catch (error) {
    console.error("Classes loading failed:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadClasses();

  }, []);

  // Form Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Edit
  const handleEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      class_name: item.class_name,
      order: item.order,
      is_active: item.is_active,
    });

    setSuccessMessage("");
  };

  // Delete
  const handleDelete = (id) => {
    setDeleteId(id);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    try {
      await deleteClass(deleteId);

      setDeleteId(null);

      setSuccessMessage("Class deleted successfully.");

      loadClasses();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Class Delete Error:", error);
      alert(error.message);
    }
  };

  // Toggle Active
  const handleToggleActive = async (item) => {
    try {
      await toggleClassActive(item.id, !item.is_active);

      setSuccessMessage(
        item.is_active
          ? "Class deactivated successfully."
          : "Class activated successfully.",
      );

      loadClasses();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Class Status Error:", error);
      alert(error.message);
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = {
        class_name: formData.class_name,
        order: Number(formData.order),
        is_active: formData.is_active,
      };

      if (editingId) {
        await updateClass(editingId, data);
      } else {
        await createClass(data);
      }

      setSuccessMessage(
        editingId
          ? "Class updated successfully."
          : "Class created successfully.",
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setFormData({
        class_name: "",
        order: "",
        is_active: true,
      });

      setEditingId(null);

      loadClasses();
    } catch (error) {
      console.error("Class Error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Classes</h1>

      {/* Add / Edit Class */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Class" : "Add Class"}
        </h2>

        {successMessage && (
          <div className="mb-4 rounded-lg bg-green-100 border border-green-300 text-green-700 px-4 py-3">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Class Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Class Name
              </label>

              <input
                type="text"
                name="class_name"
                value={formData.class_name}
                onChange={handleChange}
                placeholder="Class One"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium mb-1">Order</label>

              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="1"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Active */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4"
            />

            <label className="text-sm font-medium">Set as Active</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="mt-5 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update Class" : "Add Class"}
          </button>
        </form>
      </div>

      {/* Classes List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Class List</h2>

        {loading ? (
          <p>Loading...</p>
        ) : classes.length === 0 ? (
          <p className="text-gray-500">No classes found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-3 text-center">
                    Order
                  </th>

                  <th className="border border-gray-200 p-3 text-left">
                    Class
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
                {classes.map((item) => (
                  <tr key={item.id} className="text-center">
                    <td className="border border-gray-200 p-3">{item.order}</td>

                    <td className="border border-gray-200 p-3 text-left">
                      {item.class_name}
                    </td>

                    <td className="border border-gray-200 p-3">
                      {item.is_active ? (
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
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          ✏️
                        </button>

                        {/* Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          title={item.is_active ? "Deactivate" : "Activate"}
                          className={
                            item.is_active
                              ? "text-green-600 hover:text-green-800 text-lg transition"
                              : "text-gray-500 hover:text-green-600 text-lg transition"
                          }
                        >
                          {item.is_active ? "🔓" : "🔒"}
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
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

      {/* Delete Confirmation */}
      {deleteId && (
        <ConfirmModal
          isOpen={!!deleteId}
          title="Delete Class?"
          message={
            <>
              Are you sure you want to delete this class?
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

export default Classes;
