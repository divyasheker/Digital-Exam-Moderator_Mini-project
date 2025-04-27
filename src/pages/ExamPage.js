import React, { useState } from "react";

const ExamPage = () => {
  const [started, setStarted] = useState(false);

  const handleStartExam = () => {
    setStarted(true);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">Online Exam</h2>
      <p className="lead text-center">Follow the instructions and complete the exam within the given time.</p>
      
      {!started ? (
        <div className="text-center">
          <button className="btn btn-success" onClick={handleStartExam}>Start Exam</button>
        </div>
      ) : (
        <div className="mt-4">
          <h4>Question 1:</h4>
          <p>What is the capital of France?</p>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="q1" id="paris" />
            <label className="form-check-label" htmlFor="paris">Paris</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="q1" id="london" />
            <label className="form-check-label" htmlFor="london">London</label>
          </div>
          <button className="btn btn-primary mt-3">Submit Answer</button>
        </div>
      )}
    </div>
  );
};

export default ExamPage;