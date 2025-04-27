import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext"; 
import { loginUser } from "../utils/api";
const Login = () => {
  const { login } = useAuth(); //  Get login method from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError("Both email and password are required!");
      return;
    }
  
    setError("");
    setLoading(true);
  
    try {
      const data = await loginUser(email, password); // Call backend
  
      // Store in session (or localStorage if preferred)
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("email", data.email);
      sessionStorage.setItem("role", data.role);
      sessionStorage.setItem("name" , data.name);
  
      login(data.role); //  Update global context
  
      // Auto-redirect based on role returned by backend
      if (data.role === "STUDENT") navigate("/student-dashboard");
      else if (data.role === "ADMIN") navigate("/admin-dashboard");
      else if (data.role === "MODERATOR") navigate("/moderator-dashboard");
      else navigate("/");
  
    } catch (err) {
      setError(err.message || "Login failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="card p-4 shadow" style={{ width: "400px" }}>
          <h2 className="text-center text-primary">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Login"}
            </button>
          </form>
          <p className="text-center mt-3">
            Don't have an account? <a href="/signup" className="text-decoration-none">Sign up</a>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Login;
