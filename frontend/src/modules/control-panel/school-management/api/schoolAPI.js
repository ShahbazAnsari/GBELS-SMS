import { fetchWithAuth } from "../../../../api/clientAPI";

const SCHOOL_API_URL = "http://127.0.0.1:8000/api/schools/";
const ADDRESS_API_URL = "http://127.0.0.1:8000/api/addresses/";

// ==================================================
// Create Address
// ==================================================
export const createAddress = async (addressData) => {
  const response = await fetchWithAuth(ADDRESS_API_URL, {
    method: "POST",
    body: addressData,
  });

  const data = await response.json();

  console.log("Address API Status:", response.status);
  console.log("Address API Response:", data);

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
};

// ==================================================
// Create School
// ==================================================
export const createSchool = async (schoolData) => {
  const response = await fetchWithAuth(SCHOOL_API_URL, {
    method: "POST",
    body: schoolData,
  });

  const data = await response.json();

  console.log("School API Status:", response.status);
  console.log("School API Response:", data);

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
};

// ==================================================
// Get All Schools
// ==================================================
export const getSchools = async () => {
  const response = await fetchWithAuth(SCHOOL_API_URL);

  const data = await response.json();

  console.log("File:schoolAPI.js -> Schools API Status:", response.status);
  console.log("File:schoolAPI.js -> Schools API Response:", data);

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
};

// ==================================================
// Update School + Address
// ==================================================
export const updateSchool = async (id, schoolData) => {
  const addressFields = [
    "province",
    "district",
    "taluka",
    "union_council",
    "city_town",
    "area_locality",
    "house_no_street",
    "postal_code",
  ];

  const schoolFormData = new FormData();
  const addressFormData = new FormData();

  // --------------------------------------------------
  // Separate School Fields and Address Fields
  // --------------------------------------------------
  Object.entries(schoolData).forEach(([key, value]) => {
    // Don't send these fields
    if (
      key === "id" ||
      key === "address" ||
      key === "created_at" ||
      key === "updated_at"
    ) {
      return;
    }

    // ------------------------------------------------
    // Address Fields
    // ------------------------------------------------
    if (addressFields.includes(key)) {
      addressFormData.append(key, value ?? "");
      return;
    }

    // ------------------------------------------------
    // Logo
    // ------------------------------------------------
    if (key === "logo") {
      // Existing logo URL ko dobara send nahi karna
      if (value instanceof File) {
        schoolFormData.append("logo", value);
      }

      return;
    }

    // ------------------------------------------------
    // School Fields
    // ------------------------------------------------
    if (value !== undefined && value !== null) {
      schoolFormData.append(key, value);
    }
  });

  // ==================================================
  // Update School
  // ==================================================
  const schoolResponse = await fetchWithAuth(
    `${SCHOOL_API_URL}${id}/`,
    {
      method: "PATCH",
      body: schoolFormData,
    }
  );

  const schoolDataResponse = await schoolResponse.json();

  console.log(
    "Update School API Status:",
    schoolResponse.status
  );

  console.log(
    "Update School API Response:",
    schoolDataResponse
  );

  if (!schoolResponse.ok) {
    throw new Error(
      JSON.stringify(schoolDataResponse)
    );
  }

  // ==================================================
  // Update Address
  // ==================================================
  console.log(
    "Address received for update:",
    schoolData.address
  );

  if (schoolData.address?.id) {
    const addressResponse = await fetchWithAuth(
      `${ADDRESS_API_URL}${schoolData.address.id}/`,
      {
        method: "PATCH",
        body: addressFormData,
      }
    );

    const addressDataResponse =
      await addressResponse.json();

    console.log(
      "Update Address API Status:",
      addressResponse.status
    );

    console.log(
      "Update Address API Response:",
      addressDataResponse
    );

    if (!addressResponse.ok) {
      throw new Error(
        JSON.stringify(addressDataResponse)
      );
    }
  } else {
    console.error(
      "Address ID not found. Address was not updated."
    );
  }

  return schoolDataResponse;
};

// ==================================================
// Delete School
// ==================================================
export const deleteSchool = async (id) => {
  const response = await fetchWithAuth(
    `${SCHOOL_API_URL}${id}/`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      JSON.stringify(data)
    );
  }

  return true;
};