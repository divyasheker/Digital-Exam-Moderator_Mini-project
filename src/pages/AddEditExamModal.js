// src/components/AddEditExamModal.jsx

import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

// Helper function to format Date object or ISO string to 'YYYY-MM-DDTHH:MM'
// required by the datetime-local input type.
const formatDateTimeLocal = (dateTime) => {
  if (!dateTime) return "";
  try {
    const d = new Date(dateTime);
    // Check if date is valid before formatting
    if (isNaN(d.getTime())) {
        return "";
    }
    // Adjust for timezone offset to display correctly in local time input
    const timezoneOffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
    const localDate = new Date(d.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16); // Get 'YYYY-MM-DDTHH:MM'
  } catch (e) {
      console.error("Error formatting date:", e);
      return ""; // Return empty string on error
  }
};


const AddEditExamModal = ({ show, handleClose, onSave, examToEdit }) => {
  // State for Exam fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledTime, setScheduledTime] = useState(""); // Stored in 'YYYY-MM-DDTHH:MM' format for input
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(60); // Default to 60

  // Effect to populate form when examToEdit changes or modal opens
  useEffect(() => {
    if (show) { // Only run updates when modal is shown
        if (examToEdit) {
            setTitle(examToEdit.title || "");
            setDescription(examToEdit.description || "");
            // Format the backend timestamp/ISO string for the input field
            setScheduledTime(formatDateTimeLocal(examToEdit.scheduled_time));
            setTimeLimitMinutes(examToEdit.time_limit_minutes || 60);
        } else {
            // Reset form for adding new exam
            setTitle("");
            setDescription("");
            setScheduledTime("");
            setTimeLimitMinutes(60);
        }
    }
  }, [examToEdit, show]); // Depend on examToEdit and show status

  const handleSubmit = (e) => {
      // Prevent default form submission if triggered by Enter key inside form
      if(e) e.preventDefault();

      // Basic Validation
      if (!title.trim() || !scheduledTime || !timeLimitMinutes || timeLimitMinutes <= 0) {
          alert("Please fill in all required fields: Title, Scheduled Time, and a positive Time Limit.");
          return;
      }

      // Prepare payload for the backend
      // Convert the local datetime-local string back to a format the backend expects (e.g., ISO string)
      // IMPORTANT: new Date(localString) assumes the string is in local time and converts to UTC for toISOString()
      const payload = {
          title: title.trim(),
          description: description.trim(),
          scheduled_time: new Date(scheduledTime).toISOString(), // Convert to ISO 8601 UTC string
          time_limit_minutes: parseInt(timeLimitMinutes, 10), // Ensure it's an integer
      };

      // Pass the prepared data to the parent component's save handler
      onSave(payload);
      // Parent component (ManageExamsPage) will handle closing the modal on success
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{examToEdit ? "✏️ Edit Exam" : "➕ Add New Exam"}</Modal.Title>
      </Modal.Header>
      {/* Use Form element for better structure and accessibility */}
      <Form onSubmit={handleSubmit}>
          <Modal.Body>
              <Form.Group className="mb-3" controlId="examTitle">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="examDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="examScheduledTime">
                <Form.Label>Scheduled Start Time *</Form.Label>
                <Form.Control
                  type="datetime-local" // Input specifically for date and time
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="examTimeLimit">
                <Form.Label>Time Limit (minutes) *</Form.Label>
                <Form.Control
                  type="number"
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(e.target.value)}
                  min="1" // Prevent non-positive values
                  required
                />
              </Form.Group>
              <small className="text-muted">* Required fields</small>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              ❌ Cancel
            </Button>
            {/* Button type="submit" would work here too if inside <Form> */}
            <Button variant="primary" onClick={handleSubmit}>
              ✅ Save Exam
            </Button>
          </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditExamModal;
