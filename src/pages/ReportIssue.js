import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReportIssue = () => {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!issueType || !description) {
      toast.error("Please fill in all the fields.");
      return;
    }

    const issue = {
      email: sessionStorage.getItem("email"),
      issueType,
      description,
      timestamp: new Date().toISOString(),
    };

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(issue),
      });

      if (!response.ok) {
        throw new Error("Failed to report the issue.");
      }

      toast.success("Issue reported successfully!");
      navigate("/student-dashboard"); // Redirect to the student dashboard or admin dashboard
    } catch (error) {
      console.error("Error reporting issue:", error);
      toast.error("An error occurred while reporting the issue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="container mt-5">
        <h2 className="text-center text-danger mb-4">🚨 Report an Issue</h2>
        <p className="lead text-center mb-5">
          Please provide the details of the issue you're facing during the exam.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Issue Type</label>
            <select
              className="form-select"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              required
            >
              <option value="">Select Issue Type</option>
              <option value="Technical Problem">Technical Problem</option>
              <option value="Cheating Behavior">Cheating Behavior</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-danger w-100"
            disabled={loading}
          >
            {loading ? "Reporting..." : "Submit Issue"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </PageWrapper>
  );
};

export default ReportIssue;
