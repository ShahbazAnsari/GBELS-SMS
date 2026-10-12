const ExportStudents = ({ students = [] }) => {
  // Fixed CSV columns
  const exportColumns = [
    { label: "Student ID", field: "student_id" },
    { label: "GR Number", field: "gr_no" },

    { label: "First Name", field: "first_name" },
    { label: "Last Name", field: "last_name" },
    { label: "Surname", field: "surname" },

    { label: "Gender", field: "gender" },
    { label: "Religion", field: "religion" },
    { label: "Date of Birth", field: "dob" },
    { label: "B-Form / CRC", field: "b_form_crc" },
    { label: "Nationality", field: "nationality" },

    // Parent / Guardian
    { label: "Father Name", field: "father_name" },
    { label: "Father / Mother CNIC", field: "father_mother_cnic" },
    { label: "Contact Number", field: "contact_no" },
    { label: "Guardian Name", field: "guardian_name" },
    { label: "Guardian CNIC", field: "guardian_cnic" },
    { label: "Guardian Relation", field: "guardian_relation" },
    { label: "Emergency Contact", field: "emergency_contact_no" },
    { label: "Parent / Guardian Email", field: "parent_guardian_email" },

    // Address
    { label: "Province", field: "province" },
    { label: "District", field: "district" },
    { label: "Taluka", field: "taluka" },
    { label: "Union Council", field: "union_council" },
    { label: "City / Town", field: "city_town" },
    { label: "Area / Locality", field: "area_locality" },
    { label: "House No / Street", field: "house_no_street" },
    { label: "Postal Code", field: "postal_code" },

    // Academic
    { label: "School", field: "school" },
    { label: "Academic Session", field: "academic_session" },
    { label: "Class", field: "student_class" },
    { label: "Section", field: "section" },
    { label: "Medium", field: "medium" },

    // Admission
    { label: "Date of Admission", field: "date_of_admission" },
    { label: "Admission Type", field: "admission_type" },
    { label: "Previous School", field: "previous_school" },
    { label: "Previous Class", field: "previous_class" },
    { label: "Last GR Number", field: "last_gr_no" },

    // Status
    { label: "Student Status", field: "student_status" },
  ];

  // Escape values for CSV
  const escapeCSV = (value) => {
    if (value === null || value === undefined) {
      return '""';
    }

    return `"${String(value).replace(/"/g, '""')}"`;
  };

  // Fix CNI format
  const formatCNIC = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    return `="${String(value)}"`;
  };

  // Export CSV
  const handleExport = () => {
    if (!students.length) {
      alert("No students available to export.");
      return;
    }

    const csvRows = [
      // Column headings
      exportColumns.map((column) => escapeCSV(column.label)).join(","),

      // Student records
      ...students.map((student) =>
        exportColumns
          .map((column) => {
            const value = student[column.field] ?? "";

            const cnicFields = [
              "b_form_crc",
              "father_mother_cnic",
              "guardian_cnic",
            ];

            if (cnicFields.includes(column.field)) {
              return escapeCSV(formatCNIC(value));
            }

            return escapeCSV(value);
          })
          .join(","),
      ),
    ];

    // UTF-8 BOM supports Urdu and Unicode in Excel
    const csvContent = "\uFEFF" + csvRows.join("\r\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "students.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 border border-indigo-700 text-indigo-500 rounded-4xl hover:bg-indigo-500 hover:text-white"
    >
      Export
    </button>
  );
};

export default ExportStudents;
