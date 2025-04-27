// src/utils/examsApi.js

const EXAM_API_URL = "http://localhost:8080/api/exams"; // Adjust if your base URL is different

export const fetchExams = async () => {
  const response = await fetch(`${EXAM_API_URL}/all`); // Matches GET /api/exams/all
  if (!response.ok) {
    throw new Error("Failed to fetch exams");
  }
  return await response.json();
};

export const addExam = async (examData) => {
  const response = await fetch(`${EXAM_API_URL}/add`, { // Matches POST /api/exams/add
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(examData),
  });

  if (!response.ok) {
    // Try to get more specific error from backend if available
    const errorData = await response.json().catch(() => ({ message: "Failed to add exam" }));
    throw new Error(errorData.message || "Failed to add exam");
  }
  return await response.json();
};

export const updateExam = async (id, updatedData) => {
  const response = await fetch(`${EXAM_API_URL}/update/${id}`, { // Matches PUT /api/exams/update/{id}
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
     const errorData = await response.json().catch(() => ({ message: "Failed to update exam" }));
    throw new Error(errorData.message || "Failed to update exam");
  }
  return await response.json();
};

export const deleteExam = async (id) => {
  const response = await fetch(`${EXAM_API_URL}/delete/${id}`, { // Matches DELETE /api/exams/delete/{id}
    method: "DELETE",
  });

  if (!response.ok) {
     // DELETE might return 404 text or other non-JSON errors
     const errorData = await response.text().catch(() => "Failed to delete exam");
    throw new Error(errorData || "Failed to delete exam");
  }
  // Success for DELETE often means No Content (204), so no JSON body expected
  // Returning true or nothing indicates success
};
