// src/utils/resultsApi.js

const RESULTS_API_URL = "http://localhost:8080/api/results"; // Adjust if needed

// Helper to get auth token (adjust based on where you store it)
const getAuthToken = () => {
    return sessionStorage.getItem('token'); // Assuming you store token in sessionStorage after login
    // Or use localStorage.getItem('jwtToken') or context API
};

/**
 * Submits exam answers to the backend for evaluation.
 */
export const submitExam = async (submissionData) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  // Add Authorization header ONLY if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
      console.warn("No auth token found for submitExam request.");
      // Handle missing token - maybe throw error or redirect to login?
      throw new Error("Authentication required to submit exam.");
  }

  const response = await fetch(`${RESULTS_API_URL}/submit`, {
    method: "POST",
    headers: headers, // Use headers object
    body: JSON.stringify(submissionData),
  });

  if (!response.ok) {
    // Try to parse error message from backend response body
    let errorMsg = `Failed to submit exam (Status: ${response.status})`;
    try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
    } catch (e) { /* Ignore if body isn't JSON */ }
    throw new Error(errorMsg);
  }
  return await response.json(); // Returns the calculated ExamResult object
};

/**
 * Fetches the results for the currently logged-in student.
 */
export const fetchStudentResults = async () => {
  const token = getAuthToken();
  const headers = {};
  // Add Authorization header ONLY if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
       console.warn("No auth token found for fetchStudentResults request.");
       throw new Error("Authentication required to view results.");
  }

  const response = await fetch(`${RESULTS_API_URL}/student`, {
     method: 'GET',
     headers: headers // Use headers object
  });

  if (!response.ok) {
     let errorMsg = `Failed to fetch results (Status: ${response.status})`;
     try {
         const errorData = await response.json();
         errorMsg = errorData.message || errorMsg;
     } catch (e) { /* Ignore if body isn't JSON */ }
    throw new Error(errorMsg);
  }
  return await response.json(); // Returns a List<ExamResult>
};
