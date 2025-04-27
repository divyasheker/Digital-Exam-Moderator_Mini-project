import React from "react";
import { Modal, Button } from "react-bootstrap";

const QuestionListModal = ({ show, handleClose, questions, onEdit, onDelete, onAddNew }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>📋 Manage Questions</Modal.Title>
        <Button className="ms-auto btn btn-success" onClick={onAddNew}>
          ➕ Add New Question
        </Button>
      </Modal.Header>
      <Modal.Body>
        {questions.length === 0 ? (
          <p className="text-center">No questions available.</p>
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Correct Answer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, index) => (
                <tr key={q.id}>
                  <td>{index + 1}</td>
                  <td>{q.question}</td>
                  <td>{q.correctAnswer}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => onEdit(q)}>
                      ✏️ Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDelete(q.id)}>
                      🗑️ Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default QuestionListModal;
