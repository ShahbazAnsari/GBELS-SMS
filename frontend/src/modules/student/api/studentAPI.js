import { fetchWithAuth } from "../../../api/clientAPI.js";

const API_URL = "http://127.0.0.1:8000/api/students/";

// ========================================
// GET ALL STUDENTS
// ========================================
export const getStudents = async () => {
  const response = await fetchWithAuth(API_URL, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;

  return [];
};

// ========================================
// CREATE STUDENT
// ========================================
export const createStudent = async (studentData) => {
  const formData = new FormData();

  Object.entries(studentData).forEach(([key, value]) => {
    if (key === "address" || key === "id") return;

    if (value === null || value === undefined || value === "") return;

    if (key === "picture") {
      if (value instanceof File) {
        formData.append("picture", value);
      }
      return;
    }

    formData.append(key, value);
  });

  if (
    studentData.address === null ||
    studentData.address === undefined ||
    studentData.address === ""
  ) {
    throw new Error("Address ID is required to create a student.");
  }

  formData.append("address", studentData.address);

  const response = await fetchWithAuth(API_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Create Student Error:", data);
    throw new Error(JSON.stringify(data));
  }

  return data;
};

// ========================================
// UPDATE STUDENT
// ========================================
export const updateStudent = async (studentId, studentData) => {
  const formData = new FormData();

  Object.entries(studentData).forEach(([key, value]) => {
    if (key === "id") return;

    if (value === null || value === undefined || value === "") return;

    if (key === "picture") {
      if (value instanceof File) {
        formData.append("picture", value);
      }
      return;
    }

    if (key === "address" && typeof value === "object") {
      if (value.id) {
        formData.append("address", value.id);
      }
      return;
    }

    formData.append(key, value);
  });

  const response = await fetchWithAuth(`${API_URL}${studentId}/`, {
    method: "PATCH",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Update Student Error:", data);
    throw new Error(JSON.stringify(data));
  }

  return data;
};

// ========================================
// DELETE STUDENT
// ========================================
export const deleteStudent = async (studentId) => {
  const response = await fetchWithAuth(`${API_URL}${studentId}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let errorData = {};

    try {
      errorData = await response.json();
    } catch {
      // DELETE response may have no JSON body.
    }

    console.error("Delete Student Error:", errorData);

    throw new Error(
      Object.keys(errorData).length
        ? JSON.stringify(errorData)
        : "Failed to delete student.",
    );
  }

  return true;
};

// ========================================
// EXPORT STUDENTS
// ========================================
export const exportStudents = async () => {
  const response = await fetchWithAuth(`${API_URL}export/`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to export students.");
  }

  return await response.json();
};

// ========================================
// IMPORT STUDENTS FROM CSV
// ========================================
export const importStudents = async (csvFile) => {
  const formData = new FormData();

  formData.append("file", csvFile);

  const response = await fetchWithAuth(`${API_URL}import_csv/`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || JSON.stringify(data));
  }

  return data;
};
