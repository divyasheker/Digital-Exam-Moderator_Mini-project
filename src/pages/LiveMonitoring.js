// src/pages/LiveMonitoring.js

import React from "react";
import PageWrapper from "../components/PageWrapper";

const LiveMonitoring = () => {
  return (
    <PageWrapper>
      <div className="container mt-5 text-center">
        <h2 className="text-info">📺 Live Monitoring</h2>
        <p className="lead">Monitor students currently taking exams.</p>
        <p className="text-muted">[Live webcam/feed data will be shown here]</p>
      </div>
    </PageWrapper>
  );
};

export default LiveMonitoring;
