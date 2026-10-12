import { useEffect, useState } from "react";
import ConfirmModal from "../../../components/ConfirmModal";

import {
  getSections,
  createSection,
  updateSection,
  deleteSection,
  toggleSectionActive,
} from "./api/sectionAPI";

function Sections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    section_name: "",
    is_active: true,
  });

  const loadSections = async () => {
    try {
      const data = await getSections();

      setSections(
        Array.isArray(data)
          ? data
          : Array.isArray(data.results)
            ? data.results
            : [],
      );
    } catch (error) {
      console.error("Error loading sections:", error);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (section) => {
    setEditingId(section.id);

    setFormData({
      section_name: section.section_name,
      is_active: section.is_active,
    });

    setSuccessMessage("");
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteSection(deleteId);

      setDeleteId(null);

      setSuccessMessage("Section deleted successfully.");

      loadSections();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Section Delete Error:", error);
      alert(error.message);
    }
  };

  const handleToggleActive = async (section) => {
    try {
      await toggleSectionActive(
        section.id,
        !section.is_active
      );

      setSuccessMessage(
        section.is_active
          ? "Section deactivated successfully."
          : "Section activated successfully."
      );

      loadSections();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Section Status Error:", error);
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = {
        section_name: formData.section_name,
        is_active: formData.is_active,
      };

      if (editingId) {
        await updateSection(editingId, data);
      } else {
        await createSection(data);
      }

      setSuccessMessage(
        editingId
          ? "Section updated successfully."
          : "Section created successfully.",
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setFormData({
        section_name: "",
        is_active: true,
      });

      setEditingId(null);

      loadSections();
    } catch (error) {
      console.error("Section Error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Sections
      </h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Section" : "Add Section"}
        </h2>

        {successMessage && (
          <div className="mb-4 rounded-lg bg-green-100 border border-green-300 text-green-700 px-4 py-3">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Section Name
            </label>

            <input
              type="text"
              name="section_name"
              value={formData.section_name}
              onChange={handleChange}
              placeholder="A"
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
                ? "Update Section"
                : "Add Section"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Section List
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : sections.length === 0 ? (
          <p className="text-gray-500">
            No sections found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-3 text-center">
                    Section
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
                {sections.map((section) => (
                  <tr
                    key={section.id}
                    className="text-center"
                  >
                    <td className="border border-gray-200 p-3">
                      {section.section_name}
                    </td>

                    <td className="border border-gray-200 p-3">
                      {section.is_active ? (
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
                          onClick={() => handleEdit(section)}
                          title="Edit"
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          ✏️
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleActive(section)
                          }
                          title={
                            section.is_active
                              ? "Deactivate"
                              : "Activate"
                          }
                          className={
                            section.is_active
                              ? "text-green-600 hover:text-green-800 text-lg transition"
                              : "text-gray-500 hover:text-green-600 text-lg transition"
                          }
                        >
                          {section.is_active ? "🔓" : "🔒"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(section.id)
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
          title="Delete Section?"
          message={
            <>
              Are you sure you want to delete this section?
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

export default Sections;