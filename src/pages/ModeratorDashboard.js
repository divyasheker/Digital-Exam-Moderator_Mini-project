// src/pages/ModeratorDashboard.js

import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const ModeratorDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const role = sessionStorage.getItem("role");

    // Redirect if not a logged-in Moderator
    if (!email || role !== "MODERATOR") { // Assuming role is stored as 'MODERATOR'
      navigate("/login");
    }
  }, [navigate]);

  return (
    <PageWrapper>
      <div className="container mt-5">
        <h2 className="text-center text-info mb-4">🧑‍⚖️ Moderator Dashboard</h2>
        <p className="lead text-center mb-5">Manage users and review reported issues.</p>

        <div className="row g-4 justify-content-center">
          {/* Existing Issues Card */}
          <div className="col-md-5 d-flex align-items-stretch"> {/* Adjusted grid size */}
            <div className="card shadow p-4 text-center h-100 d-flex flex-column">
              <h4 className="mb-3">🚨 Reported Issues</h4>
              <p className="flex-grow-1">View and investigate any problems reported during exams.</p>
              {/* Assuming /issues is the correct path */}
              <Link to="/issues" className="btn btn-danger mt-auto">View Reports</Link>
            </div>
          </div>

          {/* *** NEW Manage Users Card *** */}
          <div className="col-md-5 d-flex align-items-stretch"> {/* Adjusted grid size */}
            <div className="card shadow p-4 text-center h-100 d-flex flex-column">
              <h4 className="mb-3">👥 Manage Users</h4>
              <p className="flex-grow-1">View all users and update their roles if necessary.</p>
              <Link to="/manage-users" className="btn btn-primary mt-auto">Manage Users</Link>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
};

export default ModeratorDashboard;
