import { fetchWithAuth } from "../../../../api/clientAPI";

const API_URL = "http://127.0.0.1:8000/api/classes/";

// Get all classes
export const getClasses = async () => {
    const response = await fetchWithAuth(API_URL);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to fetch classes: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};


// Get single class
export const getClass = async (id) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to fetch class: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};


// Create class
export const createClass = async (data) => {
    const response = await fetchWithAuth(API_URL, {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to create class: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};


// Update class
export const updateClass = async (id, data) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to update class: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};


// Delete class
export const deleteClass = async (id) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to delete class: ${response.status} ${errorText}`
        );
    }

    if (response.status === 204) {
        return true;
    }

    return await response.json();
};


// Toggle active / inactive
export const toggleClassActive = async (id, isActive) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`, {
        method: "PATCH",
        body: JSON.stringify({
            is_active: isActive,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to update class status: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};