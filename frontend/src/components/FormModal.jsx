import React, { useState } from "react";

function FormModal({
  title,
  fields = [],
  formData = {},
  onChange,
  onSubmit,
  onClose,
  submitText = "Save",
  studentInfo = null,
  extraContent = null,
}) {

  const [showStudentInfo, setShowStudentInfo] = useState(false);
  const [showAddressInfo, setShowAddressInfo] = useState(false);
  const [showPreviousSchoolInfo, setShowPreviousSchoolInfo] = useState(false);

  const handleChange = (event) => {
    const { name, value, files, type } = event.target;

    onChange({
      ...formData,
      [name]: type === "file" ? files?.[0] || null : value,
    });
  };

  // Reusable collapsible section heading
  const renderCollapsibleHeader = (title, isOpen, onToggle) => (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-left font-semibold text-gray-800 hover:bg-gray-100"
    >
      <span>{title}</span>

      <span className="text-xl" aria-hidden="true">
        {isOpen ? "⌃" : "⌄"}
      </span>
    </button>
  );

  // Render individual form field
  const renderField = (field) => {
    const fieldValue = formData[field.name] ?? "";

    return (
      <div
        key={field.name}
        className={
          field.type === "textarea" || field.name === "picture"
            ? "md:col-span-2 lg:col-span-3"
            : ""
        }
      >
        <label
          htmlFor={field.name}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {field.label}

          {field.required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>

        {field.type === "select" ? (
          <select
            id={field.name}
            name={field.name}
            value={fieldValue}
            onChange={handleChange}
            required={field.required || false}
            disabled={field.readOnly || false}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
          >
            <option value="">Select {field.label}</option>

            {(field.options || []).map((option) => {
              const value =
                typeof option === "string" ? option : option.value;

              const label =
                typeof option === "string" ? option : option.label;

              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        ) : field.type === "textarea" ? (
          <textarea
            id={field.name}
            name={field.name}
            value={fieldValue}
            onChange={handleChange}
            placeholder={field.placeholder || ""}
            required={field.required || false}
            readOnly={field.readOnly || false}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        ) : field.type === "file" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Picture Upload */}
            <div className="lg:col-start-1">
              <input
                id={field.name}
                type="file"
                name={field.name}
                accept={field.accept || ""}
                onChange={handleChange}
                required={false}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />

              {field.name === "picture" &&
                formData.picture instanceof File && (
                  <p className="mt-2 text-sm text-green-700">
                    Selected: {formData.picture.name}
                  </p>
                )}
            </div>

            {/* Picture Preview */}
            {field.name === "picture" && (
              <div className="flex flex-col items-center justify-center lg:col-start-3">
                <p className="mb-2 text-sm font-medium text-gray-500">
                  Picture Preview
                </p>

                {formData.picture instanceof File ? (
                  <img
                    src={URL.createObjectURL(formData.picture)}
                    alt="Student preview"
                    className="h-24 w-24 rounded-lg border border-gray-200 object-cover"
                  />
                ) : typeof formData.picture === "string" &&
                  formData.picture ? (
                  <img
                    src={formData.picture}
                    alt="Current student"
                    className="h-24 w-24 rounded-lg border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-400">
                    No Picture
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <input
            id={field.name}
            type={field.type || "text"}
            name={field.name}
            value={fieldValue}
            onChange={handleChange}
            placeholder={field.placeholder || ""}
            required={field.required || false}
            readOnly={field.readOnly || false}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 read-only:bg-gray-100"
          />
        )}
      </div>
    );
  };

  // Section names
  const previousSchoolSectionNames = [
    "Previous School Information",
    "Previous School",
  ];

  const schoolSectionNames = [
    "School Information",
    "School / Admission Information",
  ];

  // Reusable Address Information section
  const renderAddressSection = () => {
    if (!extraContent) return null;

    return (
      <section>
        {renderCollapsibleHeader(
          "Address Information",
          showAddressInfo,
          () => setShowAddressInfo((previous) => !previous)
        )}

        {showAddressInfo && (
          <div className="mt-4">
            {extraContent}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-5">
          <h2 className="text-xl font-bold text-gray-800">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-2xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-5">
          <div className="space-y-6">
            {/* 1. Student Information - Hidden by default */}
            {(studentInfo || formData.student_id || formData.gr_no) && (
              <section>
                {renderCollapsibleHeader(
                  "Student Information",
                  showStudentInfo,
                  () => setShowStudentInfo((previous) => !previous)
                )}

                {showStudentInfo && (
                  <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 md:grid-cols-3">
                    {(
                      studentInfo || [
                        {
                          label: "School",
                          value:
                            formData.school_name ||
                            formData.school_details?.school_name ||
                            (typeof formData.school === "object"
                              ? formData.school?.school_name
                              : formData.school),
                        },
                        {
                          label: "Student ID",
                          value: formData.student_id,
                        },
                        {
                          label: "GR No",
                          value: formData.gr_no,
                        },
                      ]
                    ).map((item) => (
                      <div key={item.label}>
                        <p className="mb-1 text-sm font-medium text-gray-500">
                          {item.label}
                        </p>

                        <p className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-semibold text-gray-800">
                          {item.value || "Not assigned"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* 2-8. Remaining Form Sections */}
            {fields.map((section, index) => {
              const sectionFields = Array.isArray(section.fields)
                ? section.fields
                : [section];

              const sectionName = section.section || "";

              const sectionKey =
                sectionName ||
                sectionFields[0]?.name ||
                `section-${index}`;

              // 7. Previous School Information - Hidden by default
              if (previousSchoolSectionNames.includes(sectionName)) {
                return (
                  <section key={sectionKey}>
                    {renderCollapsibleHeader(
                      sectionName,
                      showPreviousSchoolInfo,
                      () =>
                        setShowPreviousSchoolInfo(
                          (previous) => !previous
                        )
                    )}

                    {showPreviousSchoolInfo && (
                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {sectionFields.map(renderField)}
                      </div>
                    )}
                  </section>
                );
              }

              // 6. School Information - Always visible
              if (schoolSectionNames.includes(sectionName)) {
                return (
                  <React.Fragment key={sectionKey}>
                    {renderAddressSection()}

                    <section>
                      <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-indigo-800">
                        {sectionName}
                      </h3>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {sectionFields.map(renderField)}
                      </div>
                    </section>
                  </React.Fragment>
                );
              }

              // Other normal sections - Always visible
              return (
                <section key={sectionKey}>
                  {sectionName && (
                    <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-indigo-800">
                      {sectionName}
                    </h3>
                  )}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sectionFields.map(renderField)}
                  </div>
                </section>
              );
            })}

            {/* Address fallback: show it even if no School section exists */}
            {!fields.some((section) =>
              schoolSectionNames.includes(section.section || "")
            ) && renderAddressSection()}

            {/* 8. Student Picture appears wherever it is ordered in admissionForm.json */}
          </div>

          {/* Form Buttons */}
          <div className="mt-6 flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormModal;
