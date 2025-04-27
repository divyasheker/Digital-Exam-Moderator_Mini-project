// src/pages/Issues.js
import React, { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { toast } from "react-toastify";

const Issues = () => {
  const [issues, setIssues] = useState([]);

  const fetchIssues = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/issues");
      const data = await response.json();
      setIssues(data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  const resolveIssue = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/issues/${id}/resolve`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to resolve issue");
      toast.success("Issue marked as resolved!");
      fetchIssues(); // refresh
    } catch (err) {
      toast.error("Failed to resolve issue");
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <PageWrapper>
      <div className="container mt-5">
        <h2 className="text-secondary text-center">🚨 Reported Issues</h2>
        <p className="lead text-center mb-4">
          View reported problems and mark as resolved.
        </p>

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-secondary">
              <tr>
                <th>Email</th>
                <th>Type</th>
                <th>Description</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td>{issue.email}</td>
                  <td>{issue.issueType}</td>
                  <td>{issue.description}</td>
                  <td>{new Date(issue.timestamp).toLocaleString()}</td>
                  <td>
                    {issue.status === "RESOLVED" ? (
                      <span className="text-success">Resolved</span>
                    ) : (
                      <span className="text-warning">Pending</span>
                    )}
                  </td>
                  <td>
                    {issue.status !== "RESOLVED" && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => resolveIssue(issue.id)}
                      >
                        Mark Resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Issues;
