import React, { useState } from "react";

const CreateExam = () => {
  // State to hold questions and options
  const [questions, setQuestions] = useState([
    { id: 1, question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);

  // Function to handle question change
  const handleQuestionChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = e.target.value;
    setQuestions(updatedQuestions);
  };

  // Function to handle option change
  const handleOptionChange = (e, index, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = e.target.value;
    setQuestions(updatedQuestions);
  };

  // Function to handle correct answer change
  const handleCorrectAnswerChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctAnswer = e.target.value;
    setQuestions(updatedQuestions);
  };

  // Function to handle adding a new question
  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      { id: questions.length + 1, question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  // Function to handle form submission (to save the exam data)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Exam Questions:", questions); // You can replace this with an API call to save the exam
    alert("Exam Created Successfully!");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Create Exam</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={question.id} className="mb-4">
            <h5>Question {index + 1}</h5>
            <div className="mb-3">
              <label className="form-label">Question</label>
              <input
                type="text"
                className="form-control"
                value={question.question}
                onChange={(e) => handleQuestionChange(e, index)}
                required
              />
            </div>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="mb-3">
                <label className="form-label">Option {optionIndex + 1}</label>
                <input
                  type="text"
                  className="form-control"
                  value={option}
                  onChange={(e) => handleOptionChange(e, index, optionIndex)}
                  required
                />
              </div>
            ))}
            <div className="mb-3">
              <label className="form-label">Correct Answer</label>
              <select
                className="form-select"
                value={question.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(e, index)}
                required
              >
                {question.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={addNewQuestion}>
          Add Another Question
        </button>
        <button type="submit" className="btn btn-primary w-100">
          Create Exam
        </button>
      </form>
    </div>
  );
};

export default CreateExam;
