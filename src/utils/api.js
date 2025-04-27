const API_BASE_URL = "http://localhost:8080/api/users"; // Update if needed

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json(); 
    throw new Error(errorData.message || "Login failed");
  }
  const data = await response.json();
return {
  token: data.token,
  role: data.user.role,
  email: data.user.email,
  name : data.user.name,
};
};
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }

  return await response.json(); // returns the saved user object
};