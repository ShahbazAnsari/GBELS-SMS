import { fetchWithAuth } from "../../../../api/clientAPI";

const API_URL = "http://127.0.0.1:8000/api/sections/";

// Get all sections
export const getSections = async () => {
    const response = await fetchWithAuth(API_URL);

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to fetch sections: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};

// Get single section
export const getSection = async (id) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`);

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to fetch section: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};

// Create section
export const createSection = async (data) => {
    const response = await fetchWithAuth(API_URL, {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to create section: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};

// Update section
export const updateSection = async (id, data) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to update section: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};

// Delete section
export const deleteSection = async (id) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to delete section: ${response.status} ${errorText}`
        );
    }

    if (response.status === 204) {
        return true;
    }

    return await response.json();
};

// Toggle active / inactive
export const toggleSectionActive = async (id, isActive) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`, {
        method: "PATCH",
        body: JSON.stringify({
            is_active: isActive,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to update section status: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};