import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const role = sessionStorage.getItem("role");

    if (!email || role !== "ADMIN") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <PageWrapper>
      <div className="container mt-5">
        <h2 className="text-center text-danger mb-4">🛡️ Admin Dashboard</h2>
        <p className="lead text-center mb-5">
          Manage users, exams, and system settings.
        </p>

        <div className="row g-4 justify-content-center">
          {/* Create Exam Card */}
          <div className="col-md-4">
            <div className="card shadow p-4 text-center h-100">
              <h4 className="mb-3">📝Manage Questions</h4>
              <p>Create a new questions , view them , edit them  and delete them.</p>
              <Link to="/admin/manage-questions" className="btn btn-primary w-100">
                Create New Exam
              </Link>
            </div>
          </div>

          {/* Manage Exams Card */}
          <div className="col-md-4">
            <div className="card shadow p-4 text-center h-100">
              <h4 className="mb-3">📋 Manage Exams</h4>
              <p>Create or update exam schedules.</p>
              <Link to="/manage-exams" className="btn btn-warning mt-2 w-100">
                Go to Exams
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AdminDashboard;
