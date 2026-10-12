import { useEffect, useMemo, useState } from "react";
import { getStaff, deleteStaff, updateStaff } from "./api/staffAPI";
import staffForm from "./staffForm.json";
import DataTable from "../../components/DataTable";
import SearchInput from "../../components/SearchInput";
import StatusBadge from "../../components/StatusBadge";
import ActionButtons from "../../components/ActionButtons";
import FormModal from "../../components/FormModal";
import ConfirmModal from "../../components/ConfirmModal";
import Pagination from "../../components/Pagination";
import Profile from "../../components/Profile";

function StaffList() {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingStaff, setViewingStaff] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [deletingStaff, setDeletingStaff] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const staffPerPage = 5;

  const handleEdit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();

      Object.entries(editingStaff).forEach(([key, value]) => {
        if (key !== "id" && key !== "staff_id" && key !== "picture") {
          formData.append(key, value ?? "");
        }
      });

      if (editingStaff.picture instanceof File) {
        formData.append("picture", editingStaff.picture);
      }

      const updatedStaff = await updateStaff(editingStaff.id, formData);

      setStaff((prevStaff) =>
        prevStaff.map((member) =>
          member.id === editingStaff.id ? updatedStaff : member,
        ),
      );

      setEditingStaff(null);

      setSuccessMessage("Staff updated successfully!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Update Staff Error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteStaff(deletingStaff.id);

      setStaff((prevStaff) =>
        prevStaff.filter((member) => member.id !== deletingStaff.id),
      );

      setDeletingStaff(null);
    } catch (error) {
      console.error("Delete Staff Error:", error);
    }
  };

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const data = await getStaff();

        setStaff(data);

        console.log("Staff:", data);
      } catch (error) {
        console.error("Error loading staff:", error);
      }
    };

    loadStaff();
  }, []);

  useEffect(() => {
    setSearchTerm("");
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredStaff = useMemo(() => {
    return staff.filter((member) =>
      `${member.first_name || ""} ${member.last_name || ""} ${
        member.father_name || ""
      } ${member.staff_id || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  }, [staff, searchTerm]);

  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;

  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);

  const totalPages = Math.ceil(filteredStaff.length / staffPerPage);

  const columns = [
    {
      key: "picture",
      label: "Photo",
      render: (member) =>
        member.picture ? (
          <img
            src={member.picture}
            alt={member.first_name}
            className="w-16 h-20 object-cover rounded mx-auto border"
          />
        ) : (
          <div className="w-16 h-20 mx-auto bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
            No Photo
          </div>
        ),
    },
    {
      key: "staff_id",
      label: "Staff ID",
    },
    {
      key: "first_name",
      label: "First Name",
    },
    {
      key: "last_name",
      label: "Last Name",
    },
    {
      key: "father_name",
      label: "Father Name",
    },
    {
      key: "designation",
      label: "Designation",
    },
    {
      key: "gender",
      label: "Gender",
    },
    {
      key: "status",
      label: "Status",
      render: (member) => <StatusBadge status={member.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (member) => (
        <ActionButtons
          onView={() => setViewingStaff(member)}
          onEdit={() => setEditingStaff(member)}
          onDelete={() => setDeletingStaff(member)}
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Staff List</h1>

      {successMessage && (
        <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-green-700">
          {successMessage}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <p className="border-2 border-gray-50 rounded px-4 py-2">
          Total Staff: {staff.length}
        </p>

        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search staff..."
        />
      </div>

      {viewingStaff && (
        <Profile
          data={viewingStaff}
          fields={staffForm}
          title="STAFF PROFILE"
          sectionTitle="STAFF INFORMATION"
          photoLabel="STAFF PHOTO"
          year="2026"
          signatureLabels={["Staff Member", "Headmaster", "Authorized Officer"]}
          footer="Government Boys Elementary School Gharibabad Sukkur"
          onClose={() => setViewingStaff(null)}
        />
      )}
      
      {editingStaff && (
        <FormModal
          title="Edit Staff"
          fields={staffForm}
          formData={editingStaff}
          onChange={setEditingStaff}
          onSubmit={handleEdit}
          onClose={() => setEditingStaff(null)}
          submitText="Update Staff"
        />
      )}

      {deletingStaff && (
        <ConfirmModal
          title="Delete Staff"
          message={`Are you sure you want to delete ${deletingStaff.first_name} ${deletingStaff.last_name}?`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onClose={() => setDeletingStaff(null)}
        />
      )}

      <DataTable columns={columns} data={currentStaff} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default StaffList;
