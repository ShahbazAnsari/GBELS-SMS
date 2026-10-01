import { refreshAccessToken } from "./authAPI";

const fetchWithAuth = async (url, options = {}) => {
  let access = localStorage.getItem("access");

  const makeRequest = async (token) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    // JSON request ho to Content-Type set karo
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  let response = await makeRequest(access);

  // Access Token expire ho gaya
  if (response.status === 401) {
    access = await refreshAccessToken();

    if (!access) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return response;
    }

    // New token ke sath request dobara
    response = await makeRequest(access);
  }

  return response;
};

const API_URL = "http://127.0.0.1:8000/api/students/";

export const getStudents = async () => {
  const token = localStorage.getItem("access");

  const response = await fetchWithAuth(
    "http://127.0.0.1:8000/api/students/",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
};


//Create Student
export const createStudent = async (studentData) => {
    const formData = new FormData();

    Object.keys(studentData).forEach((key) => {
        if (studentData[key] !== null && studentData[key] !== "") {
            formData.append(key, studentData[key]);
        }
    });

    const response = await fetchWithAuth(API_URL, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();

        console.error("Server Error:", errorData);

        throw new Error("Failed to create student");
    }

    return response.json();
};

// Delete Student 
export const deleteStudent = async (id) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `http://127.0.0.1:8000/api/students/${id}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete student");
  }

  return true;
};


// Update Student
export const updateStudent = async (id, studentData) => {
  const token = localStorage.getItem("access");

  console.log("API ID:", id);
  console.log("API DATA:", studentData);

  const formData = new FormData();

  Object.entries(studentData).forEach(([key, value]) => {
    if (key === "id" || key === "picturePreview") {
      return;
    }

    if (key === "picture") {
      if (value instanceof File) {
        formData.append("picture", value);
      }
      return;
    }

    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  const response = await fetch(
    `http://127.0.0.1:8000/api/students/${id}/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    console.log("STATUS:", response.status);
    console.log("API ERROR:", errorData);

    throw new Error("Student update failed");
  }

  return await response.json();
};