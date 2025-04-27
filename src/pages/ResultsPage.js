// src/pages/ResultsPage.js

import React from "react";
import PageWrapper from "../components/PageWrapper";

const ResultsPage = () => {
  return (
    <PageWrapper>
      <div className="container mt-5 text-center">
        <h2 className="text-success">📊 Exam Results</h2>
        <p className="lead">This is where your exam scores and feedback will appear.</p>
        <p className="text-muted">[Mock data or real results will be shown here]</p>
      </div>
    </PageWrapper>
  );
};

export default ResultsPage;