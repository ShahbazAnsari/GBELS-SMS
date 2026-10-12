const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");

  if (!refresh) {
    return null;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh,
      }),
    });

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

export const fetchWithAuth = async (url, options = {}) => {
  let access = localStorage.getItem("access");

const makeRequest = async (token) => {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  console.log("Sending fetch request...");

let result;

try {
  result = await fetch(url, {
    ...options,
    headers,
  });

  console.log("Fetch response received:", result.status);
} catch (error) {
  console.error("Fetch request error:", error);
  throw error;
}

return result;

  console.log("Fetch response received:", result.status);

  return result;
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
