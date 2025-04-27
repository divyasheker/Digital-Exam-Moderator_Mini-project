// src/components/ExamListModal.jsx

import React from "react";
import { Modal, Button, Table } from "react-bootstrap"; // Use Table for better structure

const ExamListModal = ({ show, handleClose, exams, onEdit, onDelete, onAddNew }) => {

  // Helper to format date/time nicely
  const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        // Adjust options as needed for desired format
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
      } catch (e) {
          return 'Invalid Date';
      }
  };

  return (
    // Consider size="lg", scrollable for potentially long lists/content
    <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>📋 Manage Exams</Modal.Title>
        {/* Use ms-auto for Bootstrap 5+ alignment */}
        <Button variant="success" className="ms-auto" onClick={onAddNew}>
          ➕ Add New Exam
        </Button>
      </Modal.Header>
      <Modal.Body>
        {exams.length === 0 ? (
          <p className="text-center">No exams available. Click 'Add New Exam' to create one.</p>
        ) : (
          <Table striped bordered hover responsive> {/* Use Bootstrap Table */}
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Scheduled Time</th>
                <th>Time Limit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, index) => ( // Iterate over exams
                <tr key={exam.id}>
                  <td>{index + 1}</td>
                  <td>{exam.title}</td> {/* Display exam title */}
                  <td>{formatDate(exam.scheduled_time)}</td> {/* Display formatted time */}
                  <td>{exam.time_limit_minutes} mins</td> {/* Display time limit */}
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2 mb-1" // Add margin for spacing
                      onClick={() => onEdit(exam)} // Pass exam object to edit handler
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                       className="mb-1"
                      onClick={() => onDelete(exam.id)} // Pass exam id to delete handler
                    >
                      🗑️ Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
              Close
          </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExamListModal;

