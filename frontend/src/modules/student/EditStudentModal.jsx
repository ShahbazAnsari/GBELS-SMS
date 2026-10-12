  import formFields from "./admissionForm.json";

  const EditStudentModal =  ({
    student,
    onClose,
    onChange,
    onUpdate,
  }) => {
    if (!student) return null;

    // Normal field change
    const handleChange = (e) => {
      const { name, value } = e.target;

      onChange({
        ...student,
        [name]: value,
      });
    };

    // Picture change
    const handlePictureChange = (e) => {
      const file = e.target.files?.[0];

      if (!file) return;

      const preview = URL.createObjectURL(file);

      onChange({
        ...student,
        picture: file,
        picturePreview: preview,
      });
    };

    // Update button
    const handleUpdateClick = () => {
      console.log("MODAL STUDENT:", student);
      console.log("MODAL ID:", student.id);

      onUpdate(student);
    };

    
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b">

            <h2 className="text-xl font-bold text-green-700">
              Edit Student
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="text-2xl text-gray-500 hover:text-red-600"
            >
              ×
            </button>

          </div>

          {/* Form */}
          <div className="p-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {formFields.map((field) => {

                /*
                  =========================
                  IMAGE FIELD
                  =========================
                */

                if (field.type === "image") {
                  return (
                    <div
                      key={field.name}
                      className="md:col-span-2"
                    >

                      <label className="block font-medium mb-2">
                        {field.label}
                      </label>

                      <div className="flex items-center gap-5">

                        {/* Current / New Picture */}

                        {student.picturePreview && (
                          <img
                            src={student.picturePreview}
                            alt="Student Preview"
                            className="object-cover rounded border"
                            style={{
                              width: field.width,
                              height: field.height,
                            }}
                          />
                        )}

                        {!student.picturePreview &&
                          typeof student.picture === "string" &&
                          student.picture && (
                            <img
                              src={student.picture}
                              alt="Student"
                              className="object-cover rounded border"
                              style={{
                                width: field.width,
                                height: field.height,
                              }}
                            />
                          )}

                        <input
                          type="file"
                          name={field.name}
                          accept={field.accept}
                          onChange={handlePictureChange}
                          className="border rounded p-2"
                        />

                      </div>

                    </div>
                  );
                }

                /*
                  =========================
                  TEXTAREA
                  =========================
                */

                if (field.type === "textarea") {
                  return (
                    <div
                      key={field.name}
                      className={
                        field.colSpan === 2
                          ? "md:col-span-2"
                          : ""
                      }
                    >

                      <label className="block font-medium mb-1">
                        {field.label}
                      </label>

                      <textarea
                        name={field.name}
                        value={student[field.name] ?? ""}
                        placeholder={field.placeholder ?? ""}
                        required={field.required}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border rounded px-3 py-2"
                      />

                    </div>
                  );
                }

                /*
                  =========================
                  SELECT
                  =========================
                */

                if (field.type === "select") {
                  return (
                    <div key={field.name}>

                      <label className="block font-medium mb-1">
                        {field.label}
                      </label>

                      <select
                        name={field.name}
                        value={student[field.name] ?? ""}
                        required={field.required}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                      >

                        <option value="">
                          Select {field.label}
                        </option>

                        {field.options?.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}

                      </select>

                    </div>
                  );
                }

                /*
                  =========================
                  NORMAL INPUT
                  =========================
                */

                return (
                  <div key={field.name}>

                    <label className="block font-medium mb-1">
                      {field.label}
                    </label>

                    <input
                      type={field.type}
                      name={field.name}
                      value={student[field.name] ?? ""}
                      placeholder={field.placeholder ?? ""}
                      required={field.required}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    />

                  </div>
                );
              })}

            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={ onClose}
                className="px-5 py-2 bg-gray-50 text-gray-500 rounded hover:border border-gray-500"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdateClick}
                className="px-5 py-2 bg-green-50 text-blue-500 rounded hover:border border-blue-500"
              >
                Update Student
              </button>

            </div>

          </div>
        </div>
      </div>
    );
  }

  export default EditStudentModal;
