import { useRef } from "react";
import { importStudents } from "./api/studentAPI";

function ImportStudent() {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        throw new Error("Please select a CSV file.");
      }

      const result = await importStudents(file);

      let message = `Import completed!\n\n`;
      message += `Imported: ${result.imported}\n`;
      message += `Failed: ${result.failed}`;

      if (result.errors?.length) {
        message += "\n\nErrors:\n";

        result.errors.forEach((item) => {
          message += `Row ${item.row}: ${item.error}\n`;
        });
      }

      alert(message);

      // Refresh the page to show newly imported students.
      if (result.imported > 0) {
        window.location.reload();
      }
    } catch (error) {
      console.error("CSV Import Error:", error);
      alert(error.message || "CSV import failed.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={handleButtonClick}
        className="px-4 py-2 border border-green-700 text-green-500 rounded-4xl hover:bg-green-500 hover:text-white"
      >
        Import
      </button>
    </>
  );
}

export default ImportStudent;
