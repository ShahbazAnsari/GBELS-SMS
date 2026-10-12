import { useEffect, useState } from "react";
import ConfirmModal from "../../../components/ConfirmModal";

import {
  getAcademicSessions,
  createAcademicSession,
  updateAcademicSession,
  deleteAcademicSession,
  toggleAcademicSession,
} from "./api/academicSession";

function AcademicSession() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    session_name: "",
    start_date: "",
    end_date: "",
    is_active: false,
  });

  const loadSessions = async () => {
    try {
      const data = await getAcademicSessions();

      console.log("Academic Sessions API:", data);

      setSessions(
        Array.isArray(data)
          ? data
          : Array.isArray(data.results)
            ? data.results
            : [],
      );
    } catch (error) {
      console.error("Error loading academic sessions:", error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (session) => {
    setEditingId(session.id);

    setFormData({
      session_name: session.session_name,
      start_date: session.start_date,
      end_date: session.end_date,
      is_active: session.is_active,
    });

    setSuccessMessage("");
  };

  const handleToggleActive = async (session) => {
    try {
      await toggleAcademicSession(session.id, !session.is_active);

      setSuccessMessage(
        session.is_active
          ? "Academic session deactivated successfully."
          : "Academic session activated successfully.",
      );

      loadSessions();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Academic Session Status Error:", error);
      alert(error.message);
    }
  };

  // Delete icon click
  const handleDelete = (id) => {
    setDeleteId(id);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    try {
      await deleteAcademicSession(deleteId);

      setDeleteId(null);

      setSuccessMessage("Academic session deleted successfully.");

      loadSessions();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Academic Session Delete Error:", error);
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingId) {
        await updateAcademicSession(editingId, formData);
      } else {
        await createAcademicSession(formData);
      }

      setSuccessMessage(
        editingId
          ? "Academic session updated successfully."
          : "Academic session created successfully.",
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setFormData({
        session_name: "",
        start_date: "",
        end_date: "",
        is_active: false,
      });

      setEditingId(null);

      loadSessions();
    } catch (error) {
      console.error("Academic Session Error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Academic Session</h1>

      {/* Add / Edit Session */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Academic Session" : "Add Academic Session"}
        </h2>

        {successMessage && (
          <div className="mb-4 rounded-lg bg-green-100 border border-green-300 text-green-700 px-4 py-3">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Session Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Session Name
              </label>

              <input
                type="text"
                name="session_name"
                value={formData.session_name}
                onChange={handleChange}
                placeholder="2026-27"
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>

              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>

              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
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

            <label className="text-sm font-medium">Set as Active Session</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="mt-5 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Session"
                : "Add Session"}
          </button>
        </form>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Academic Sessions</h2>

        {loading ? (
          <p>Loading...</p>
        ) : sessions.length === 0 ? (
          <p className="text-gray-500">No academic sessions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-3 text-left">
                    Session
                  </th>

                  <th className="border border-gray-200 p-3 text-left">
                    Start Date
                  </th>

                  <th className="border border-gray-200 p-3 text-left">
                    End Date
                  </th>

                  <th className="border border-gray-200 p-3 text-left">
                    Status
                  </th>

                  <th className="border border-gray-200 p-3 text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="text-center">
                    <td className="border border-gray-200 p-3">
                      {session.session_name}
                    </td>

                    <td className="border border-gray-200 p-3">
                      {session.start_date}
                    </td>

                    <td className="border border-gray-200 p-3">
                      {session.end_date}
                    </td>

                    <td className="border border-gray-200 p-3">
                      {session.is_active ? (
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
                          onClick={() => handleEdit(session)}
                          title="Edit"
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          ✏️
                        </button>
                        
                        {/* Toggle Active / Inactive */}
                        <button
                          type="button"
                          onClick={() => handleToggleActive(session)}
                          title={session.is_active ? "Deactivate" : "Activate"}
                          className={
                            session.is_active
                              ? "text-green-600 hover:text-green-800 text-lg transition"
                              : "text-gray-500 hover:text-green-600 text-lg transition"
                          }
                        >
                          {session.is_active ? "🔓" : "🔒"}
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDelete(session.id)}
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

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <ConfirmModal
          isOpen={!!deleteId}
          title="Delete Academic Session?"
          message={
            <>
              Are you sure you want to delete this academic session?
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

export default AcademicSession;
