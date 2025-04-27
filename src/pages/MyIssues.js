// src/pages/MyIssues.js
import React, { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";

const MyIssues = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchUserIssues = async () => {
      const email = sessionStorage.getItem("email");
      try {
        const response = await fetch(`http://localhost:8080/api/issues/my?email=${email}`);
        const data = await response.json();
        setIssues(data);
      } catch (err) {
        console.error("Failed to fetch your issues", err);
      }
    };

    fetchUserIssues();
  }, []);

  return (
    <PageWrapper>
      <div className="container mt-5">
        <h2 className="text-center text-primary">📋 My Reported Issues</h2>
        <div className="table-responsive mt-4">
          <table className="table table-bordered table-hover">
            <thead className="table-primary">
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
};

export default MyIssues;
