import { fetchWithAuth } from "./clientAPI.js";

const API_URL = "http://127.0.0.1:8000/api/addresses/";

// Create Address
export const createAddress = async (addressData) => {
  const response = await fetchWithAuth(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addressData),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Address API Error:", data);
    throw new Error(
      typeof data === "object"
        ? JSON.stringify(data)
        : "Failed to save address.",
    );
  }

  return data;
};

// Get all addresses
export const getAddresses = async () => {
  const response = await fetchWithAuth(API_URL);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data === "object"
        ? JSON.stringify(data)
        : "Failed to fetch addresses.",
    );
  }

  return Array.isArray(data) ? data : data.results || [];
};


// Get Address by ID
export const getAddressById = async (addressId) => {
  const response = await fetchWithAuth(`${API_URL}${addressId}/`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Get Address Error:", data);
    throw new Error(
      typeof data === "object"
        ? JSON.stringify(data)
        : "Failed to fetch address.",
    );
  }

  return data;
};

// Update Address
export const updateAddress = async (addressId, addressData) => {
  const response = await fetchWithAuth(`${API_URL}${addressId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addressData),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Update Address Error:", data);
    throw new Error(
      typeof data === "object"
        ? JSON.stringify(data)
        : "Failed to update address.",
    );
  }

  return data;
};
