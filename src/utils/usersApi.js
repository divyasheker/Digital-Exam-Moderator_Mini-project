// src/utils/usersApi.js

const USERS_API_URL = "http://localhost:8080/api/users"; // Adjust if needed

// Helper to get JWT token
const getAuthToken = () => {
    return sessionStorage.getItem('token'); // Or your storage method
};

// Existing fetchAllUsers function (Unchanged)
export const fetchAllUsers = async () => {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  else throw new Error("Authentication required.");

  const response = await fetch(USERS_API_URL, { method: 'GET', headers: headers });
  if (!response.ok) { /* Error handling */ throw new Error(`Fetch users failed: ${response.status}`); }
  return await response.json();
};

// Existing updateUserRoleApi function (Unchanged)
export const updateUserRoleApi = async (userId, newRole) => {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  else throw new Error("Authentication required.");

  const payload = { newRole: newRole.toUpperCase() };
  const response = await fetch(`${USERS_API_URL}/${userId}/role`, { method: 'PUT', headers: headers, body: JSON.stringify(payload) });
  if (!response.ok) { /* Error handling */ throw new Error(`Update role failed: ${response.status}`); }
  return await response.json();
};

// *** NEW: Function to delete a user ***
export const deleteUserApi = async (userId) => {
  const token = getAuthToken();
  const headers = {}; // No Content-Type needed for simple DELETE
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    throw new Error("Authentication required to delete user.");
  }

  const response = await fetch(`${USERS_API_URL}/${userId}`, { // DELETE request to user ID endpoint
    method: 'DELETE',
    headers: headers,
  });

  // Check for success (200 OK or 204 No Content typically)
  if (!response.ok) {
    let errorMsg = `Failed to delete user (Status: ${response.status})`;
    // Try to get more specific error from backend if possible (though DELETE often has no body)
    try { const errorData = await response.json(); errorMsg = errorData.message || errorMsg; } catch (e) {}
    throw new Error(errorMsg);
  }
  // No need to return response.json() for DELETE usually
};
