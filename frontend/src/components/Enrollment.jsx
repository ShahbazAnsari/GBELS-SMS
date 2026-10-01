import { useEffect, useState } from "react";
import { getStudents, deleteStudent, updateStudent } from "../api/studentAPI";
import StudentReportModal from "../StudentReportModel";
import EditStudentModal from "./EditStudentModal";
import ExportStudents from "./ExportStudents";
import ImportStudent from "./ImportStudents";

function StudentList() {

  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 2;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  useEffect(() => {

    const loadStudents = async () => {
      try {
        const data = await getStudents();

        setStudents(data);

        console.log("Students:", data);

      } catch (error) {
        console.error("Error loading students:", error);
      }
    };

    loadStudents();

  }, []);

  // DELETE
  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);

      setStudents(
        students.filter((student) => student.id !== id)
      );

    } catch (error) {
      console.error("Delete Student Error:", error);
    }
  };


  // UPDATE
  // const handleUpdate = async (studentData) => {
  //   try {
  //     const updatedStudent = await updateStudent(
  //       studentData.id,
  //       studentData
  //     );

  //     setStudents(
  //       students.map((student) =>
  //         student.id === updatedStudent.id
  //           ? updatedStudent
  //           : student
  //       )
  //     );

  //     setEditingStudent(null);

  //   } catch (error) {
  //     console.error("Update Student Error:", error);
  //   }
  // };

  const handleUpdate = async (studentData) => {

    try {
      const updatedStudent = await updateStudent(
        studentData.id,
        studentData
      );

      console.log("UPDATED STUDENT:", updatedStudent);

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === updatedStudent.id
            ? updatedStudent
            : student
        )
      );

      setEditingStudent(null);

    } catch (error) {
      console.error("UPDATE ERROR:", error);
    }
  };

  const filteredStudents = students.filter((student) =>
    `${student.student_id} ${student.first_name} ${student.last_name} ${student.father_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );


  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Student List
      </h1>

      <div className="overflow-x-auto">

        {editingStudent && (
          <EditStudentModal
            student={editingStudent}
            onClose={() => setEditingStudent(null)}
            onChange={setEditingStudent}
            onUpdate={handleUpdate}
          />
        )}

        <StudentReportModal
          student={viewingStudent}
          onClose={() => setViewingStudent(null)}
        />


        <div className="flex justify-between items-center">
          <p className="border-2 border-gray-50 rounded px-4 py-2">
            Total Students: {students.length}
          </p>

          <div className="flex  items-center gap-2">
            <input
              type="text"
              placeholder="Search student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 border border-gray-300 rounded px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <ExportStudents students={students} />

            {/* <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Export
            </button> */}
            <ImportStudent />
            {/* <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Import
            </button> */}
          </div>
        </div>

        <table className="w-full border border-gray-300">

          <thead className="bg-gray-200">
            <tr>
              <th className="border p-3">Photo</th>
              <th className="border p-3">Student ID</th>
              <th className="border p-3">First Name</th>
              <th className="border p-3">Last Name</th>
              <th className="border p-3">Father Name</th>
              <th className="border p-3">Class</th>
              <th className="border p-3">Section</th>
              <th className="border p-3">Gender</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>

          <tbody>

            {currentStudents.map((student) => (

              <tr key={student.id}>

                {/* Photo */}
                <td className="border p-3 text-center">
                  {student.picture ? (

                    <img
                      src={student.picture}
                      alt={student.first_name}
                      className="w-16 h-20 object-cover rounded mx-auto border"
                    />
                  ) : (
                    <div className="w-16 h-20 mx-auto bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      No Photo
                    </div>
                  )}
                </td>

                {/* Student ID */}
                <td className="border p-3">
                  {student.student_id}
                </td>

                {/* First Name */}
                <td className="border p-3">
                  {student.first_name}
                </td>

                {/* Last Name */}
                <td className="border p-3">
                  {student.last_name}
                </td>

                {/* Father Name */}
                <td className="border p-3">
                  {student.father_name}
                </td>

                {/* Class */}
                <td className="border p-3">
                  {student.class_name}
                </td>

                {/* Section */}
                <td className="border p-3">
                  {student.section}
                </td>

                {/* Gender */}
                <td className="border p-3">
                  {student.gender}
                </td>

                {/* Actions */}
                <td className="border p-3">

                  <div className="flex gap-2">

                    {/* View */}
                    <button
                      onClick={() => setViewingStudent(student)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() =>
                        setEditingStudent({ ...student })}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <div className="flex justify-between items-center mt-4">

          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-2 rounded ${currentPage === index + 1
                  ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(filteredStudents.length / studentsPerPage)
            }
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>
      </div>

    </div>
  );
}

export default StudentList;