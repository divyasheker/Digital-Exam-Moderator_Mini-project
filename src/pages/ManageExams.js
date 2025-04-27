// src/pages/ManageExams.js

import React from "react";
import PageWrapper from "../components/PageWrapper";

const ManageExams = () => {
  return (
    <PageWrapper>
      <div className="container mt-5 text-center">
        <h2 className="text-warning">📋 Manage Exams</h2>
        <p className="lead">Create, update or delete exams from here.</p>
        <p className="text-muted">[Exam creation form or list will go here]</p>
      </div>
    </PageWrapper>
  );
};

export default ManageExams;
