import { fetchWithAuth } from "../../../api/clientAPI";

const API_URL = "http://127.0.0.1:8000/api/staff/";

// Create staff function
export const createStaff = async (formData) => {
  const response = await fetchWithAuth(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Staff creation failed:", error);
    throw new Error("Staff creation failed");
  }

  return response.json();
};

// Get staff function
export const getStaff = async () => {
  const response = await fetchWithAuth(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch staff");
  }

  return response.json();
};

// Update staff function
export const updateStaff = async (id, formData) => {
  const response = await fetchWithAuth(`${API_URL}${id}/`, {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Staff update failed:", error);
    throw new Error("Staff update failed");
  }

  return response.json();
};

// Delete staff function
export const deleteStaff = async (id) => {
  const response = await fetchWithAuth(`${API_URL}${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Staff deletion failed:", error);
    throw new Error("Staff deletion failed");
  }

  return true;
};
