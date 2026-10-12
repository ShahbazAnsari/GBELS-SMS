import { fetchWithAuth } from "../../../../api/clientAPI";

export const promoteStudents = async (data) => {
  return await fetchWithAuth("/api/students/promote/", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};