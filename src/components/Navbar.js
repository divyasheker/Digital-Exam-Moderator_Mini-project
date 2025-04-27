import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { userRole, logout, userData } = useAuth(); // assume userData contains { name, email, etc. }
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleHomeClick = () => {
    if (!userRole) return navigate("/");
    if (userRole === "ADMIN") return navigate("/admin-dashboard");
    if (userRole === "MODERATOR") return navigate("/moderator-dashboard");
    if (userRole === "STUDENT") return navigate("/student-dashboard");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <span
        className="navbar-brand"
        style={{ cursor: "pointer" }}
        
      >
         <Link className="navbar-brand" to="/">Digital Exam Moderator</Link>
      </span>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        {/* Left side */}
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <span className="nav-link" style={{ cursor: "pointer" }} onClick={handleHomeClick}>
              Home
            </span>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about">About</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/services">Services</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact">Contact</Link>
          </li>
          {userRole === "STUDENT" && (
            <li className="nav-item">
              <Link className="nav-link" to="/my-issues">My Issues</Link>
            </li>
          )}
          
          {userRole === "ADMIN" && (
            <li className="nav-item">
              <Link className="nav-link" to="/my-issues">My Issues</Link>
            </li>
          )}
          {/* Role-specific links */}
          {userRole === "STUDENT" && (
            <li className="nav-item">
              <Link className="nav-link" to="/report-issue">Report Issue</Link>
            </li>
          )}

          {userRole === "ADMIN" && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/report-issue">Report Issue</Link>
              </li>
              
            </>
          )}

        </ul>

        {/* Right side */}
        <ul className="navbar-nav align-items-center">
          {!userRole ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">Signup</Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item me-2">
                <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
              </li>
              <li className="nav-item">
                <img
                  src={`https://ui-avatars.com/api/?name=${userData?.name || "User"}&background=random`}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "40px", height: "40px", cursor: "pointer" }}
                  onClick={() => navigate("/profile")}
                />
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
