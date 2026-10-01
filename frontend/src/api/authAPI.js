export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");

  if (!refresh) {
    return null;
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/token/refresh/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refresh,
        }),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    localStorage.setItem("access", data.access);

    return data.access;
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
};