import { fetchWithAuth } from "../../../../api/clientAPI";

const API_URL = "http://127.0.0.1:8000/api/mediums/";

// Get all medium
export const getMediums = async () => {
    const response = await fetchWithAuth(API_URL);

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to fetch medium: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};

// Get single medium
export const getMedium = async (id) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`);

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to fetch medium: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};

// Create medium
export const createMedium = async (data) => {
    const response = await fetchWithAuth(API_URL, {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to create medium: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};

// Update medium
export const updateMedium = async (id, data) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to update medium: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};

// Delete medium
export const deleteMedium = async (id) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to delete medium: ${response.status} ${errorText}`
        );
    }

    if (response.status === 204) {
        return true;
    }

    return await response.json();
};

// Toggle active / inactive
export const toggleMediumActive = async (id, isActive) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`, {
        method: "PATCH",
        body: JSON.stringify({
            is_active: isActive,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to update medium status: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};