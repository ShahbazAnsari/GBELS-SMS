const ExportStudents = ({ students }) => {

  const handleExport = () => {
    if (!students || students.length === 0) {
      alert("No students available to export.");
      return;
    }

    const headers = Object.keys(students[0]);

    const csvRows = [
      headers.join(","),
      ...students.map((student) =>
        headers
          .map((header) => {
            const value = student[header] ?? "";
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "students.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Export
    </button>
  );
};

export default ExportStudents;