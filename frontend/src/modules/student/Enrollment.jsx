import { useEffect, useState } from "react";

import { getStudents, deleteStudent, updateStudent } from "./api/studentAPI";
import { getAdmissionTypes } from "../control-panel/school-settings/api/admissionTypeAPI.js";
import { getMediums } from "../control-panel/school-settings/api/mediumAPI.js";
import { getClasses } from "../control-panel/school-settings/api/classAPI.js";
import { getSections } from "../control-panel/school-settings/api/sectionAPI.js";

import { getAddresses } from "../../api/addressAPI.js";
import { getSchools } from "../control-panel/school-management/api/schoolAPI.js";
import { getAcademicSessions } from "../control-panel/school-settings/api/academicSession.js";

import { getAddressById, updateAddress } from "../../api/addressAPI.js";
import AddressForm from "../../components/AddressForm.jsx";

import formFields from "./admissionForm.json";

import Profile from "../../components/Profile";
import FormModal from "../../components/FormModal";
import SearchInput from "../../components/SearchInput";
import DataTable from "../../components/DataTable";
import ActionButtons from "../../components/ActionButtons";
import ConfirmModal from "../../components/ConfirmModal";
import Pagination from "../../components/Pagination";

import ExportStudents from "./ExportStudents";
import ImportStudent from "./ImportStudents";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

  const [admissionTypes, setAdmissionTypes] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [addresses, setAddresses] = useState([]);
  const [schools, setSchools] = useState([]);
  const [academicSessions, setAcademicSessions] = useState([]);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Load students
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await getStudents();

        setStudents(data);

        console.log("Students loaded ====== >:", data);
      } catch (error) {
        console.error("Error loading students:", error);
      }
    };

    loadStudents();
  }, []);

  // Load dropdown options for Student Edit form
  useEffect(() => {
    const loadDropdownOptions = async () => {
      try {
        const [
          admissionTypeData,
          classData,
          sectionData,
          mediumData,
          addressData,
          schoolData,
          academicSessionData,
        ] = await Promise.all([
          getAdmissionTypes(),
          getClasses(),
          getSections(),
          getMediums(),
          getAddresses(),
          getSchools(),
          getAcademicSessions(),
        ]);

        setAdmissionTypes(
          Array.isArray(admissionTypeData)
            ? admissionTypeData
            : admissionTypeData.results || [],
        );

        setAddresses(
          Array.isArray(addressData) ? addressData : addressData?.results || [],
        );

        setSchools(
          Array.isArray(schoolData) ? schoolData : schoolData?.results || [],
        );

        setAcademicSessions(
          Array.isArray(academicSessionData)
            ? academicSessionData
            : academicSessionData?.results || [],
        );

        setClasses(
          Array.isArray(classData) ? classData : classData.results || [],
        );

        setSections(
          Array.isArray(sectionData) ? sectionData : sectionData.results || [],
        );

        setMediums(
          Array.isArray(mediumData) ? mediumData : mediumData.results || [],
        );
      } catch (error) {
        console.error("Error loading student dropdowns:", error);
      }
    };

    loadDropdownOptions();
  }, []);

  const handleView = async (student) => {
    try {
      let studentAddress = student.address;

      // Agar address sirf ID hai to database se details load karein
      if (student.address && typeof student.address !== "object") {
        studentAddress = await getAddressById(student.address);
      }

      setViewingStudent({
        ...student,
        address:
          studentAddress && typeof studentAddress === "object"
            ? studentAddress
            : {},
      });
    } catch (error) {
      console.error("Load Student Profile Error:", error);
      setErrorMessage("Unable to load student address. Please try again.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      // Student profile phir bhi open ho
      setViewingStudent({
        ...student,
        address:
          student.address && typeof student.address === "object"
            ? student.address
            : {},
      });
    }
  };

  const handleEdit = async (student) => {
    try {
      const addressData = await getAddressById(student.address);

      setEditingStudent({
        ...student,
        address: addressData,
      });
    } catch (error) {
      console.error("Load Student For Edit Error:", error);
      setErrorMessage("Load Student For Edit Error:", error);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  };

  // UPDATE STUDENT AND ADDRESS
  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      setErrorMessage("");
      setSuccessMessage("");

      // 1. Get existing address ID
      const addressId =
        typeof editingStudent.address === "object"
          ? editingStudent.address?.id
          : editingStudent.address;

      // 2. Update existing address
      if (addressId && typeof editingStudent.address === "object") {
        const { id, ...addressData } = editingStudent.address;

        await updateAddress(addressId, addressData);
      }

      // 3. Update student
      const studentData = {
        ...editingStudent,
        address: addressId,
      };

      const updatedStudent = await updateStudent(
        editingStudent.id,
        studentData,
      );

      // 4. Update table data
      setStudents((previousStudents) =>
        previousStudents.map((student) =>
          student.id === updatedStudent.id ? updatedStudent : student,
        ),
      );

      // 5. Close edit modal
      setEditingStudent(null);

      // 6. Show success message
      setSuccessMessage("Student updated successfully!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Update Student Error:", error);

      setErrorMessage(
        error.message || "Unable to update student. Please try again.",
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);

      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== id),
      );

      setDeletingStudent(null);
    } catch (error) {
      console.error("Delete Student Error:", error);
    }
  };

  // SEARCH
  const filteredStudents = students.filter((student) =>
    `${student.student_id || ""} ${student.first_name || ""} ${
      student.last_name || ""
    } ${student.father_name || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // TABLE COLUMNS
  const columns = [
    {
      key: "picture",
      label: "Photo",

      render: (student) =>
        student.picture ? (
          <img
            src={student.picture}
            alt={student.first_name}
            className="w-16 h-16 object-cover rounded-full mx-auto border"
          />
        ) : (
          <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
            {(student.first_name || "").charAt(0).toUpperCase()}
            {(student.last_name || "").charAt(0).toUpperCase()}
          </div>
        ),
    },

    {
      key: "student_id",
      label: "Student ID",
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
      key: "student_class",
      label: "Class",
      render: (student) => {
        const gradeId =
          typeof student.student_class === "object"
            ? student.student_class?.id
            : student.student_class;

        const grade = classes.find(
          (item) => String(item.id) === String(gradeId),
        );

        return (
          grade?.class_name ||
          grade?.name ||
          student.student_class_name ||
          student.class_name ||
          student.student_class_details?.class_name ||
          (typeof student.student_class === "object"
            ? student.student_class?.class_name || student.student_class?.name
            : null) ||
          student.student_class ||
          "—"
        );
      },
    },
    {
      key: "section",
      label: "Section",
      render: (student) => {
        const sectionId =
          typeof student.section === "object"
            ? student.section?.id
            : student.section;

        const section = sections.find(
          (item) => String(item.id) === String(sectionId),
        );

        return (
          section?.section_name ||
          section?.name ||
          student.section_name ||
          student.section_details?.section_name ||
          (typeof student.section === "object"
            ? student.section?.section_name || student.section?.name
            : null) ||
          student.section ||
          "—"
        );
      },
    },
    {
      key: "gender",
      label: "Gender",
    },
    {
      key: "actions",
      label: "Actions",
      render: (student) => (
        <ActionButtons
          onView={() => handleView(student)}
          onEdit={() => handleEdit(student)}
          onDelete={() => setDeletingStudent(student)}
        />
      ),
    },
  ];

  // PAGINATION   PAGINATION  -  PAGINATION  -  PAGINATION  -  PAGINATION  -  PAGINATION  -  PAGINATION
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent,
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Enrolled Students</h1>

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-green-700">
          {successMessage}
        </div>
      )}

      {/*  */}
      {/*  */}
      {/*  */}

      {/* ================= EDIT MODAL ================= */}

      {editingStudent && (
        <FormModal
          title="Edit Student"
          fields={formFields.map((section) => ({
            ...section,
            fields: (section.fields || [])
              .filter(
                (field) =>
                  !["school", "student_id", "gr_no"].includes(field.name),
              )
              .map((field) => {
                // Admission Type dropdown
                if (field.name === "admission_type") {
                  return {
                    ...field,
                    options: admissionTypes.map((item) => ({
                      value: String(item.id),
                      label: item.admission_type_name,
                    })),
                  };
                }

                // Class dropdown
                if (field.name === "student_class") {
                  return {
                    ...field,
                    options: classes.map((item) => ({
                      value: String(item.id),
                      label: item.class_name,
                    })),
                  };
                }

                // Section dropdown
                if (field.name === "section") {
                  return {
                    ...field,
                    options: sections.map((item) => ({
                      value: String(item.id),
                      label: item.section_name,
                    })),
                  };
                }

                // Medium dropdown
                if (field.name === "medium") {
                  return {
                    ...field,
                    options: mediums.map((item) => ({
                      value: String(item.id),
                      label: item.medium_name,
                    })),
                  };
                }

                return field;
              }),
          }))}
          formData={editingStudent}
          onChange={setEditingStudent}
          onSubmit={handleUpdate}
          onClose={() => setEditingStudent(null)}
          submitText="Update Student"
          extraContent={
            <>
              {/* Address Information */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <AddressForm
                  address={
                    typeof editingStudent.address === "object" &&
                    editingStudent.address !== null
                      ? editingStudent.address
                      : {}
                  }
                  onChange={(fieldName, value) => {
                    setEditingStudent((previous) => ({
                      ...previous,
                      address: {
                        ...(typeof previous.address === "object" &&
                        previous.address !== null
                          ? previous.address
                          : {}),
                        [fieldName]: value,
                      },
                    }));
                  }}
                />
              </div>
            </>
          }
        />
      )}

      {/*  */}
      {/*  */}
      {/*  */}

      {/* ================= STUDENT PROFILE ================= */}
      {viewingStudent && (
        <Profile
          data={viewingStudent}
          fields={formFields.flatMap((section) => section.fields || [])}
          admissionTypes={admissionTypes}
          classes={classes}
          sections={sections}
          mediums={mediums}
          title="STUDENT ADMISSION FORM"
          sectionTitle="STUDENT INFORMATION"
          photoLabel="STUDENT PHOTO"
          year="2026"
          declaration="I hereby declare that the information provided in this admission form is correct and complete to the best of my knowledge."
          signatureLabels={["Parent / Guardian", "Class Teacher", "Headmaster"]}
          footer="Government Boys Elementary School Gharibabad Sukkur"
          onClose={() => setViewingStudent(null)}
        />
      )}

      {/* ================= DELETE MODAL ================= */}
      {deletingStudent && (
        <ConfirmModal
          isOpen={true}
          title="Delete Student"
          message={`Are you sure you want to delete ${deletingStudent.first_name} ${deletingStudent.last_name}?`}
          confirmText="Delete"
          onConfirm={() => handleDelete(deletingStudent.id)}
          onCancel={() => setDeletingStudent(null)}
        />
      )}

      {/* ================= TOOLBAR ================= */}
      <div className="overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <p className="border-2 border-gray-200 rounded-xl px-4 py-2">
            Total Students: {students.length}
          </p>

          <div className="flex items-center gap-2">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search student..."
            />

            <ExportStudents students={students} />

            <ImportStudent />
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <DataTable columns={columns} data={currentStudents} />

        {/* ================= PAGINATION ================= */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default StudentList;
