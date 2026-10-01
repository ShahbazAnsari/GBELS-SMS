import { useRef } from "react";

function ImportStudent() {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    console.log("Selected CSV:", file);

    // CSV import ka code baad mein yahan add karenge
  };

  return (
    <>
      {/* Hidden CSV input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Import CSV Button */}
      <button
        type="button"
        onClick={handleButtonClick}
        className="px-4 py-2 text-blue-500 rounded hover:bg-green-700"
      >
        Import
      </button>
    </>
  );
}

export default ImportStudent;

