// src/pages/ModeratorDashboard.js

import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const ModeratorDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const role = sessionStorage.getItem("role");

    if (!email || role !== "MODERATOR") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <PageWrapper>
      <div className="container mt-5">
        <h2 className="text-center text-info mb-4">🧑‍⚖️ Moderator Dashboard</h2>
        <p className="lead text-center mb-5">Review flagged cheating or technical issues.</p>

        <div className="row g-4 justify-content-center">
          <div className="col-md-6">
            <div className="card shadow p-4 text-center h-100">
              <h4 className="mb-3">🚨 Reported Issues</h4>
              <p>View and investigate any problems reported during exams.</p>
              <Link to="/issues" className="btn btn-danger mt-2">View Reports</Link>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ModeratorDashboard;
