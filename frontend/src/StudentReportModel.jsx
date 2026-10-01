import formFields from "./data/admissionForm.json";

function StudentReportModal({ student, onClose }) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      {/* Modal */}
      <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-xl shadow-2xl">

        {/* Report */}
        <div
          id="student-report"
          className="bg-white p-6"
        >

          {/* ================= HEADER ================= */}
          <div className="flex items-center border-b-4 border-green-700 pb-4 mb-5">

            {/* Logo */}
            <div className="w-24 flex justify-center">
              <img
                src="/GBELS_Logo.png"
                alt="GBELS Logo"
                className="w-20 h-20 object-contain"
              />
            </div>

            {/* School Name */}
            <div className="flex-1 text-center">

              <h1 className="text-2xl font-extrabold uppercase text-gray-800">
                Government Boys Elementary School
              </h1>

              <h2 className="text-xl font-bold text-green-700">
                Gharibabad Sukkur
              </h2>

              <div className="mt-2 inline-block px-5 py-1 border-2 border-green-700 rounded-full">
                <span className="font-bold text-sm tracking-wide">
                  STUDENT ADMISSION FORM
                </span>
              </div>

            </div>

            {/* Year */}
            <div className="w-24 text-center">
              <div className="text-xs text-gray-500">
                SCHOOL FORM
              </div>

              <div className="font-bold text-lg">
                2026
              </div>
            </div>

          </div>


          {/* ================= STUDENT INFORMATION ================= */}

          <div className="bg-green-700 text-white px-4 py-2 rounded-t-lg">
            <h3 className="font-bold tracking-wide">
              STUDENT INFORMATION
            </h3>
          </div>


          <div className="border border-gray-300 rounded-b-lg overflow-hidden">

            <div className="grid grid-cols-3">

              {/* Information */}
              <div className="col-span-2 grid grid-cols-2">

                {formFields.map((field) => {

                  // Photo ko information list mein show nahi karna
                  if (field.type === "image") {
                    return null;
                  }

                  return (
                    <div
                      key={field.name}
                      className="border-b border-r border-gray-300 px-3 py-3"
                    >

                      <div className="text-xs font-semibold text-gray-500 uppercase">
                        {field.label}
                      </div>

                      <div className="font-medium text-gray-800 mt-1 min-h-5">
                        {student[field.name] || "-"}
                      </div>

                    </div>
                  );
                })}

              </div>


              {/* Student Photo */}
              <div className="p-5 flex items-center justify-center bg-gray-50">

                <div className="w-36 h-44 border-2 border-green-700 rounded-lg overflow-hidden bg-white flex items-center justify-center">

                  {student.picture ? (

                    <img
                      src={student.picture}
                      alt="Student"
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <span className="text-sm text-gray-400">
                      STUDENT PHOTO
                    </span>

                  )}

                </div>

              </div>

            </div>

          </div>


          {/* ================= DECLARATION ================= */}

          <div className="mt-5">

            <div className="bg-green-700 text-white px-4 py-2 rounded-t-lg">
              <h3 className="font-bold">
                DECLARATION
              </h3>
            </div>

            <div className="border border-gray-300 rounded-b-lg p-4 text-sm leading-6">

              I hereby declare that the information provided in this
              admission form is correct and complete to the best of my
              knowledge.

            </div>

          </div>


          {/* ================= SIGNATURES ================= */}

          <div className="grid grid-cols-3 gap-8 mt-16 text-center">

            <div>
              <div className="border-t-2 border-gray-700 pt-2">
                Parent / Guardian
              </div>
            </div>

            <div>
              <div className="border-t-2 border-gray-700 pt-2">
                Class Teacher
              </div>
            </div>

            <div>
              <div className="border-t-2 border-gray-700 pt-2">
                Headmaster
              </div>
            </div>

          </div>


          {/* ================= FOOTER ================= */}

          <div className="text-center text-xs text-gray-500 mt-8 pt-3 border-t">

            Government Boys Elementary School Gharibabad Sukkur

          </div>

        </div>


        {/* ================= BUTTONS ================= */}

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">

          <button
            onClick={() => window.print()}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            Print Report
          </button>

          <button
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

export default StudentReportModal;