// src/pages/StudentDashboard.js

import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const StudentDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const role = sessionStorage.getItem("role");

    if (!email || role !== "STUDENT") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <PageWrapper>
      <div className="container mt-5">
        <h2 className="text-center text-primary mb-4">🎓 Student Dashboard</h2>
        <p className="lead text-center mb-5">
          Welcome! Manage your exams and results here.
        </p>

        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <div className="card shadow p-4 text-center h-100">
              <h4 className="mb-3">📝 Take Exam</h4>
              <p>Start your scheduled exam.</p>
              <Link to="/available-exams" className="btn btn-primary mt-2">Start Exam</Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow p-4 text-center h-100">
              <h4 className="mb-3">📊 View Results</h4>
              <p>Check your exam performance.</p>
              <Link to="/results" className="btn btn-success mt-2">View Results</Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow p-4 text-center h-100">
              <h4 className="mb-3">👤 Profile</h4>
              <p>Update your account details.</p>
              <Link to="/profile" className="btn btn-warning mt-2">Edit Profile</Link>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default StudentDashboard;
