import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddEditQuestionModal = ({ show, handleClose, onSave, questionToEdit }) => {
  const [question, setQuestion] = useState({ question: "", options: ["", "", "", ""], correctAnswer: "" });

  useEffect(() => {
    if (questionToEdit) {
      setQuestion({
        question: questionToEdit.questionText || "",
        options: [
          questionToEdit.option1 || "",
          questionToEdit.option2 || "",
          questionToEdit.option3 || "",
          questionToEdit.option4 || ""
        ],
        correctAnswer: questionToEdit.correctAnswer || ""
      });
    } else {
      setQuestion({ question: "", options: ["", "", "", ""], correctAnswer: "" });
    }
  }, [questionToEdit]);

  const handleChange = (e, field, index) => {
    if (field === "question" || field === "correctAnswer") {
      setQuestion({ ...question, [field]: e.target.value });
    } else {
      const updatedOptions = [...question.options];
      updatedOptions[index] = e.target.value;
      setQuestion({ ...question, options: updatedOptions });
    }
  };

  const handleSubmit = () => {
    // Map it back to the backend format before sending
    const payload = {
      questionText: question.question,
      option1: question.options[0],
      option2: question.options[1],
      option3: question.options[2],
      option4: question.options[3],
      correctAnswer: question.correctAnswer
    };
    onSave(payload);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{questionToEdit ? "✏️ Edit Question" : "➕ Add New Question"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Question</Form.Label>
            <Form.Control
              type="text"
              value={question.question}
              onChange={(e) => handleChange(e, "question")}
              required
            />
          </Form.Group>

          {question.options.map((option, idx) => (
            <Form.Group className="mb-3" key={idx}>
              <Form.Label>Option {idx + 1}</Form.Label>
              <Form.Control
                type="text"
                value={option}
                onChange={(e) => handleChange(e, "option", idx)}
                required
              />
            </Form.Group>
          ))}

          <Form.Group className="mb-3">
            <Form.Label>Correct Answer</Form.Label>
            <Form.Select
              value={question.correctAnswer}
              onChange={(e) => handleChange(e, "correctAnswer")}
              required
            >
              <option value="">Select Correct Answer</option>
              {question.options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          ❌ Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          ✅ Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditQuestionModal;
