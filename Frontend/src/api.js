const API_URL = 'https://backend-app-lqwr.onrender.com/api';

// This object contains functions to interact with your live backend API.
export const api = {
    getNextSrNo: async (location) => {
        console.log(`API: Fetching next SR_NO for ${location}...`);
        // CORRECTED: Using query parameter as per your backend code
        const response = await fetch(`${API_URL}/leads/next-sr-no?location=${location.toLowerCase()}`);
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Body: ${errorBody}`);
        }
        const data = await response.json();
        return data.nextSrNo;
    },
    getDataByLocation: async (location) => {
        console.log(`API: Fetching data for ${location}...`);
        // CORRECTED: URL changed to /api/leads/:location
        const response = await fetch(`${API_URL}/leads/${location.toLowerCase()}`);
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Body: ${errorBody}`);
        }
        return response.json();
    },
    submitData: async (formData) => {
        console.log(`API: Submitting data for ${formData.locations}...`);
         // CORRECTED: URL changed to /api/leads
        const response = await fetch(`${API_URL}/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Body: ${errorBody}`);
        }
        return response.json();
    },
    deleteLead: async (location, id) => {
        console.log(`API: Deleting lead with ID ${id} from location ${location}...`);
        const response = await fetch(`${API_URL}/leads/${location.toLowerCase()}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok && response.status !== 204) { // 204 is a success status with no content
            const errorBody = await response.text();
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Body: ${errorBody}`);
        }
        // For DELETE, a 204 No Content response is common, so we might not return anything.
        return;
    },
    deleteMultipleLeads: async (location, ids) => {
        console.log(`API: Deleting multiple leads from location ${location} with IDs: ${ids.join(', ')}...`);
        const response = await fetch(`${API_URL}/leads/delete-multiple`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: location.toLowerCase(), ids }),
        });
        if (!response.ok && response.status !== 204) {
            const errorBody = await response.text();
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Body: ${errorBody}`);
        }
        return;
    },
};