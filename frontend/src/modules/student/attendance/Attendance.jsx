import React, { useEffect, useState } from "react";
import { getStudents, } from "../../student/api/studentAPI";
import { createAttendance, getAttendanceByDate, updateAttendance } from "./api/attendanceAPI";

const Attendance = () => {
  const [date, setDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  // loading states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Attendance states
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);

  useEffect(() => {
    if (!selectedClass || !selectedSection) {
      setStudents([]);
      setAttendance({});
      return;
    }

    const loadStudents = async () => {
      setLoading(true);

      try {
        const data = await getStudents();

        const filteredStudents = data.filter(
          (student) =>
            student.class_name === selectedClass &&
            student.section === selectedSection
        );

        setStudents(filteredStudents);

        // Existing attendance load
        if (date) {
          const attendanceData = await getAttendanceByDate(date);

          const attendanceMap = {};

          attendanceData.forEach((record) => {
            attendanceMap[record.student] = {
              id: record.id,
              status: record.status,
            };
          });

          setAttendance(attendanceMap);
          const statuses = filteredStudents.map(
            (student) => attendanceMap[student.id]?.status || "PRESENT"
          );

          setPresentCount(statuses.filter((status) => status === "PRESENT").length);

          setAbsentCount(statuses.filter((status) => status === "ABSENT").length);

          setLeaveCount(statuses.filter((status) => status === "LEAVE").length);
        } else {
          setAttendance({});
        }
      } catch (error) {
        console.error("Failed to load students/attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [selectedClass, selectedSection, date]);

  const handleSaveAttendance = async () => {
    if (!date) {
      alert("Please select date");
      return;
    }

    if (!selectedClass || !selectedSection) {
      alert("Please select class and section");
      return;
    }

    if (students.length === 0) {
      alert("No students found");
      return;
    }

    try {
      setSaving(true);
      for (const student of students) {
        const existingRecord = attendance[student.id];

        const attendanceData = {
          student: student.id,
          date: date,
          status: existingRecord?.status || "PRESENT",
        };

        if (existingRecord?.id) {
          // Existing attendance → Update
          await updateAttendance(existingRecord.id, attendanceData);
        } else {
          // New attendance → Create
          await createAttendance(attendanceData);
        }
      }

      alert("Attendance saved successfully");

      const updatedAttendance = await getAttendanceByDate(date);

      const attendanceMap = {};

      updatedAttendance.forEach((record) => {
        attendanceMap[record.student] = {
          id: record.id,
          status: record.status,
        };
      });

      setAttendance(attendanceMap);

    } catch (error) {
      console.error("Attendance save failed:", error);
      alert("Failed to save attendance");
    }
    finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Daily Attendance
      </h1>

      <div className="bg-white p-6 rounded-lg shadow">

        <div className="flex gap-4 mb-6">

          {/* Date */}
          <div>
            <label className="block mb-1 font-medium">
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>

          {/* Class */}
          <div>
            <label className="block mb-1 font-medium">
              Class
            </label>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">Select Class</option>
              <option value="ECE-I">ECE-I</option>
              <option value="ECE-II">ECE-II</option>
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option value="3">Class 3</option>
              <option value="4">Class 4</option>
              <option value="5">Class 5</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block mb-1 font-medium">
              Section
            </label>

            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Present</p>
            <p className="text-2xl font-bold text-green-700">
              {presentCount}
            </p>
          </div>

          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Absent</p>
            <p className="text-2xl font-bold text-red-700">
              {absentCount}
            </p>
          </div>

          <div className="bg-yellow-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Leave</p>
            <p className="text-2xl font-bold text-yellow-700">
              {leaveCount}
            </p>
          </div>

        </div>

        {/* Students */}
        <div className="border rounded">

          <div className="p-4 font-semibold border-b">
            Students
          </div>

          {students.length === 0 ? (
            <div className="p-4 text-gray-500">
              Select Class and Section to load students.
            </div>
          ) : (
            <div className="overflow-x-auto">

              {loading ? (
                <p className="text-center py-6 text-gray-500">
                  Loading students...
                </p>
              ) : (

                <table className="w-full">

                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">#</th>
                      <th className="p-3 text-left">Student ID</th>
                      <th className="p-3 text-left">Student Name</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student, index) => (
                      <tr
                        key={student.id}
                        className="border-t"
                      >
                        <td className="p-3">
                          {index + 1}
                        </td>

                        <td className="p-3">
                          {student.student_id}
                        </td>

                        <td className="p-3">
                          {student.first_name} {student.last_name}
                        </td>

                        <td className="p-3">
                          <select
                            value={attendance[student.id]?.status || "PRESENT"}
                            onChange={(e) =>
                              setAttendance({
                                ...attendance,
                                [student.id]: {
                                  ...attendance[student.id],
                                  status: e.target.value,
                                },
                              })
                            } className="border rounded px-3 py-1"
                          >
                            <option value="PRESENT">Present</option>
                            <option value="ABSENT">Absent</option>
                            <option value="LEAVE">Leave</option>
                          </select>                      </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSaveAttendance}
                  disabled={saving}
                  className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving Attendance..." : "Submit Attendance"}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Attendance;
