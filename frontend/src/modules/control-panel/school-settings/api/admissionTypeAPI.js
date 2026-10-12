import { fetchWithAuth } from "../../../../api/clientAPI";

const API_URL = "http://127.0.0.1:8000/api/admission-type/";

// Get all AdmissionType
export const getAdmissionTypes = async () => {
    const response = await fetchWithAuth(API_URL);

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to fetch admission types: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};

// Get single AdmissionType
export const getAdmissionType = async (id) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`);

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to fetch admission type: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};

// Create AdmissionType
export const createAdmissionType = async (data) => {
    const response = await fetchWithAuth(API_URL, {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to create admission type: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};

// Update AdmissionType
export const updateAdmissionType = async (id, data) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to update admission type: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};

// Delete AdmissionType
export const deleteAdmissionType = async (id) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to delete admission type: ${response.status} ${errorText}`
        );
    }

    if (response.status === 204) {
        return true;
    }

    return await response.json();
};

// Toggle active / inactive
export const toggleAdmissionTypeActive = async (id, isActive) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`, {
        method: "PATCH",
        body: JSON.stringify({
            is_active: isActive,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to update admission type status: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};