// src/components/EditUserRoleModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

// Define the possible roles
const ROLES = ["STUDENT", "MODERATOR", "ADMIN"];

const EditUserRoleModal = ({ show, handleClose, userToEdit, onSave }) => {
    const [selectedRole, setSelectedRole] = useState('');

    // Update the selected role when the user to edit changes or modal opens
    useEffect(() => {
        if (userToEdit) {
            setSelectedRole(userToEdit.role || ''); // Set initial role from user data
        } else {
            setSelectedRole(''); // Reset if no user
        }
    }, [userToEdit, show]); // Depend on userToEdit and show status

    const handleSaveClick = () => {
        if (selectedRole && userToEdit) {
            onSave(userToEdit.id, selectedRole); // Pass userId and new role to parent handler
        } else {
             alert("Please select a role."); // Basic validation
        }
    };

    if (!userToEdit) {
        return null; // Don't render modal if no user is selected for editing
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>✏️ Edit User Role</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Name:</strong> {userToEdit.name}</p>
                <p><strong>Email:</strong> {userToEdit.email}</p>
                <hr />
                <Form.Group controlId="roleSelect">
                    <Form.Label><strong>Select New Role:</strong></Form.Label>
                    <Form.Select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        aria-label="Select user role"
                    >
                        <option value="" disabled>-- Select Role --</option>
                        {ROLES.map(role => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveClick}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditUserRoleModal;
