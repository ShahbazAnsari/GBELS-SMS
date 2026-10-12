import { useState } from "react";
import promotionForm from "./promotionForm.json";

function ClassPromotion() {
  const [formData, setFormData] = useState({});
  const [selectedStudents, setSelectedStudents] = useState([]);

  const students = [
    {
      id: 1,
      student_id: "ST001",
      name: "Ali Ahmed",
      father_name: "Ahmed Khan",
      current_class: "Class 4",
    },
    {
      id: 2,
      student_id: "ST002",
      name: "Hassan Ali",
      father_name: "Ali Hassan",
      current_class: "Class 4",
    },
    {
      id: 3,
      student_id: "ST003",
      name: "Usman Khan",
      father_name: "Khan Muhammad",
      current_class: "Class 4",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSelectedStudents([]);
  };

  const handleSelectStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((studentId) => studentId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map((student) => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const showStudents =
    formData.academic_year && formData.from_class;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Class Promotion</h1>

        <p className="text-gray-500">
          Promote students from one class to another.
        </p>
      </div>

      {/* Promotion Selection */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {promotionForm.map((field) => (
          <div key={field.name}>
            <label className="mb-1 block text-sm font-medium">
              {field.label}
            </label>

            <select
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-green-500"
            >
              <option value="">
                Select {field.label}
              </option>

              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Students */}
      {showStudents && (
        <div className="mt-8 overflow-hidden rounded-lg border bg-white">
          <div className="border-b bg-gray-50 px-4 py-3">
            <h2 className="font-semibold">
              Students of {formData.from_class}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        students.length > 0 &&
                        selectedStudents.length === students.length
                      }
                    />
                  </th>

                  <th className="px-4 py-3">
                    Student ID
                  </th>

                  <th className="px-4 py-3">
                    Student Name
                  </th>

                  <th className="px-4 py-3">
                    Father Name
                  </th>

                  <th className="px-4 py-3">
                    Current Class
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(
                          student.id
                        )}
                        onChange={() =>
                          handleSelectStudent(student.id)
                        }
                      />
                    </td>

                    <td className="px-4 py-3">
                      {student.student_id}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {student.name}
                    </td>

                    <td className="px-4 py-3">
                      {student.father_name}
                    </td>

                    <td className="px-4 py-3">
                      {student.current_class}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-sm text-gray-600">
              {selectedStudents.length} student(s) selected
            </span>

            <button
              type="button"
              disabled={
                !formData.to_class ||
                selectedStudents.length === 0
              }
              className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Promote Students
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassPromotion;