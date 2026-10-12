const API_URL = "http://127.0.0.1:8000/api";

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.username?.[0] ||
      data.password?.[0] ||
      data.detail ||
      "Registration failed"
    );
  }

  return data;
};