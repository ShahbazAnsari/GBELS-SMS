const API_URL = "http://127.0.0.1:8000/api/attendance/";

// Get all attendance
export const getAttendance = async () => {
  const token = localStorage.getItem("access");

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch attendance");
  }

  return await response.json();
};


// Create attendance
export const createAttendance = async (attendanceData) => {
  const token = localStorage.getItem("access");

  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(attendanceData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Attendance create error:", errorData);

    throw new Error("Failed to create attendance");
  }

  return await response.json();
};


// Get attendance by date
export const getAttendanceByDate = async (date) => {
  const token = localStorage.getItem("access");

  const response = await fetch(`${API_URL}?date=${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch attendance");
  }

  return await response.json();
};



export const updateAttendance = async (id, attendanceData) => {
  const token = localStorage.getItem("access");

  const response = await fetch(`${API_URL}${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(attendanceData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Attendance update error:", errorData);
    throw new Error("Failed to update attendance");
  }

  return await response.json();
};