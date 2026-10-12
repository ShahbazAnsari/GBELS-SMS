function Profile({
  data = {},
  fields = [],
  title = "PROFILE",
  sectionTitle = "INFORMATION",
  photoLabel = "PHOTO",
  year = "2026",
  declaration = "",
  signatureLabels = [],
  footer = "",
  onClose,
  admissionTypes = [],
  classes = [],
  sections = [],
  mediums = [],
}) {
  if (!data) return null;

  // Dropdown ID ko uske actual name mein convert karega
  const getDisplayValue = (fieldName, value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    // Agar API object return kare
    if (typeof value === "object") {
      if (value.label) return value.label;

      if (fieldName === "admission_type") {
        return value.admission_type_name || value.name || value.id || "-";
      }

      if (fieldName === "student_class") {
        return value.class_name || value.name || value.id || "-";
      }

      if (fieldName === "section") {
        return value.section_name || value.name || value.id || "-";
      }

      if (fieldName === "medium") {
        return value.medium_name || value.name || value.id || "-";
      }

      return value.name || value.id || "-";
    }

    // ID se related lookup list select karein
    let list = [];
    let nameKeys = [];

    switch (fieldName) {
      case "admission_type":
        list = admissionTypes;
        nameKeys = ["admission_type_name", "name"];
        break;

      case "student_class":
        list = classes;
        nameKeys = ["class_name", "name"];
        break;

      case "section":
        list = sections;
        nameKeys = ["section_name", "name"];
        break;

      case "medium":
        list = mediums;
        nameKeys = ["medium_name", "name"];
        break;

      default:
        return value;
    }

    const item = list.find((record) => String(record.id) === String(value));

    if (!item) return value;

    for (const key of nameKeys) {
      if (item[key]) return item[key];
    }

    return value;
  };

  // Address ki details ko readable banayein
  const getAddressLabel = (key) => {
    const labels = {
      house_number: "House Number",
      house_no: "House Number",
      street: "Street",
      street_name: "Street",
      village: "Village",
      town: "Town",
      city: "City",
      union_council: "Union Council",
      uc: "Union Council",
      taluka: "Taluka",
      tehsil: "Taluka",
      district: "District",
      province: "Province",
      postal_code: "Postal Code",
      postcode: "Postal Code",
      address_line: "Address",
      address_line_1: "Address Line 1",
      address_line_2: "Address Line 2",
    };

    if (labels[key]) return labels[key];

    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const address = data.address;

  const addressEntries =
    address && typeof address === "object"
      ? Object.entries(address).filter(([key, value]) => {
          const ignoredFields = ["id", "created_at", "updated_at"];

          return (
            !ignoredFields.includes(key) &&
            value !== null &&
            value !== undefined &&
            value !== ""
          );
        })
      : [];

  const getAddressValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    if (typeof value === "object") {
      return (
        value.name ||
        value.district_name ||
        value.taluka_name ||
        value.province_name ||
        value.id ||
        "-"
      );
    }

    return value;
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-xl shadow-2xl">
        {/* Printable Profile */}
        <div id="printable-profile" className="bg-white p-2 print:p-0">
          {/* HEADER */}
          <div className="flex items-center border-b-3 border-green-700 pb-2 mb-2">
            <div className="w-24 flex justify-center">
              <img
                src="/GBELS_Logo.png"
                alt="School Logo"
                className="w-20 h-20 object-contain"
              />
            </div>

            <div className="flex-1 text-center">
              <h1 className="text-2xl font-extrabold uppercase text-gray-800">
                Government Boys Elementary School
              </h1>

              <h2 className="text-xl font-bold text-gray-800">
                Gharibabad Sukkur
              </h2>

              <div className="mt-1 inline-block px-5 py-1 border-2 border-green-700 rounded-full">
                <span className="font-bold text-sm tracking-wide">{title}</span>
              </div>
            </div>

            <div className="w-24 text-center">
              <div className="text-xs text-gray-500">SCHOOL FORM</div>

              <div className="font-bold text-lg">{year}</div>
            </div>
          </div>

          {/* STUDENT INFORMATION */}
          <div className="bg-green-800 text-white px-4 py-1 rounded-t-lg">
            <h3 className="font-bold tracking-wide">{sectionTitle}</h3>
          </div>

          <div className="border border-gray-300 rounded-b-lg overflow-hidden">
            <div className="grid grid-cols-3 ">
              {/* Student Fields */}
              {fields.map((field) => {
                if (field.type === "image" || field.type === "file") {
                  return null;
                }

                return (
                  <div
                    key={field.name}
                    className="border-b border-r border-gray-300 px-3 py-1"
                  >
                      <div className="font-semibold text-xs text-gray-500 uppercase">
                        {field.label + " :"}
                      </div>

                      <div className="font-semibold text-gray-700 uppercase">
                        {getDisplayValue(field.name, data[field.name])}
                      </div>
                    </div>
                );
              })}

              {/* Student Photo: Third Column, Two Rows */}
              <div className="col-start-3 row-start-1 row-span-5 border-b border-gray-300 p-4 flex items-center justify-center bg-gray-50">
                <div className="w-36 h-44 border-2 border-green-700 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                  {data.picture ? (
                    <img
                      src={data.picture}
                      alt={photoLabel}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-gray-400">{photoLabel}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ADDRESS INFORMATION */}
          <div className="mt-2">
            <div className="bg-green-700 text-white px-4 py-1 rounded-t-lg">
              <h3 className="font-bold tracking-wide">ADDRESS INFORMATION</h3>
            </div>

            <div className="border border-gray-300 rounded-b-lg overflow-hidden">
              {addressEntries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3">
                  {addressEntries.map(([key, value]) => (
                    <div
                      key={key}
                      className="border-b border-r border-gray-300 px-3 py-1"
                    >
                      <div className="text-xs font-semibold text-gray-500 uppercase">
                        {getAddressLabel(key)}
                      </div>

                      <div className="font-semibold text-gray-700">
                        {getAddressValue(value)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-gray-500 text-sm">
                  Address information is not available.
                </div>
              )}
            </div>
          </div>

          {/* DECLARATION */}
          {declaration && (
            <div className="mt-2">
              <div className="bg-green-700 text-white px-4 py-1 rounded-t-lg">
                <h3 className="font-bold">DECLARATION</h3>
              </div>

              <div className="border border-gray-300 rounded-b-lg p-2 text-xs leading-6">
                {declaration}
              </div>
            </div>
          )}

          {/* SIGNATURES */}
          {signatureLabels.length > 0 && (
            <div className="grid grid-cols-3 gap-8 mt-16 text-center">
              {signatureLabels.map((label) => (
                <div key={label}>
                  <div className="border-t-2 border-gray-700 pt-1">{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* FOOTER */}
          {footer && (
            <div className="text-center text-xs text-gray-500 mt-1 py-0 border-t">
              {footer}
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            Print Profile
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
