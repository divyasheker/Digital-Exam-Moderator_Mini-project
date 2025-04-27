const QUESTION_API_URL = "http://localhost:8080/api/questions";

export const fetchQuestions = async () => {
  const response = await fetch(`${QUESTION_API_URL}/all`);
  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }
  return await response.json();
};

export const addQuestion = async (questionData) => {
  const response = await fetch(`${QUESTION_API_URL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(questionData),
  });

  if (!response.ok) {
    throw new Error("Failed to add question");
  }
  return await response.json();
};

export const updateQuestion = async (id, updatedData) => {
  const response = await fetch(`${QUESTION_API_URL}/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error("Failed to update question");
  }
  return await response.json();
};

export const deleteQuestion = async (id) => {
  const response = await fetch(`${QUESTION_API_URL}/delete/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete question");
  }
};
