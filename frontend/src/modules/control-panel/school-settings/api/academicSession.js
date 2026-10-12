import { fetchWithAuth } from "../../../../api/clientAPI";

const API_URL = "http://127.0.0.1:8000/api/academic-sessions/";

// Get all academic sessions
export const getAcademicSessions = async () => {
    const response = await fetchWithAuth(API_URL);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to fetch academic sessions: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};


// Get single academic session
export const getAcademicSession = async (id) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to fetch academic session: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};


// Create academic session
export const createAcademicSession = async (data) => {
    const response = await fetchWithAuth(API_URL, {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to create academic session: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};


// Update academic session
export const updateAcademicSession = async (id, data) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to update academic session: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};


// Delete academic session
export const deleteAcademicSession = async (id) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to delete academic session: ${response.status} ${errorText}`
        );
    }

    // DELETE normally returns 204 No Content
    if (response.status === 204) {
        return true;
    }

    return await response.json();
};


// Toggle academic session active status
export const toggleAcademicSession = async (id, isActive) => {
    const response = await fetchWithAuth(`${API_URL}${id}/`, {
        method: "PATCH",
        body: JSON.stringify({
            is_active: isActive,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to update academic session status: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};