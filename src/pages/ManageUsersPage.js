// src/pages/ManageUsersPage.jsx

import React, { useState, useEffect } from 'react';
// *** Import deleteUserApi ***
import { fetchAllUsers, updateUserRoleApi, deleteUserApi } from '../utils/usersApi';
import PageWrapper from '../components/PageWrapper';
import EditUserRoleModal from '../pages/EditUserRoleModal';
import { Container, Table, Button, Spinner, Alert, Badge, Stack } from 'react-bootstrap'; // Import Stack for button spacing
import { toast } from 'react-toastify';

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [isDeleting, setIsDeleting] = useState(null); // Track which user ID is being deleted

    // Function to load users (Unchanged - backend does filtering)
    const loadUsers = async () => { /* ... remains the same ... */
        setIsLoading(true); setError(null);
        try { const data = await fetchAllUsers(); setUsers(data); }
        catch (err) { console.error("Err load users:", err); setError(err.message || "Failed"); toast.error(err.message || "Failed"); }
        finally { setIsLoading(false); }
    };

    // Fetch users on mount (Unchanged)
    useEffect(() => { loadUsers(); }, []);

    // Modal Handlers (Unchanged)
    const handleOpenEditModal = (user) => { setUserToEdit(user); setShowEditModal(true); };
    const handleCloseEditModal = () => { setShowEditModal(false); setUserToEdit(null); };

    // Save Role Handler (Unchanged)
    const handleSaveRole = async (userId, newRole) => { /* ... remains the same ... */
        if (userToEdit && userToEdit.role === newRole) { toast.info("Role unchanged."); handleCloseEditModal(); return; }
        try { await updateUserRoleApi(userId, newRole); toast.success(`Role updated for ${userToEdit?.email}`); handleCloseEditModal(); loadUsers(); }
        catch (err) { console.error("Err save role:", err); toast.error(`Failed: ${err.message}`); }
    };

    // *** NEW: Delete Confirmation Handler ***
    const handleDeleteClick = (user) => {
        if (!user || isDeleting === user.id) return; // Prevent multiple clicks

        // Show confirmation dialog
        if (window.confirm(`Are you sure you want to delete user "${user.email}"? This action cannot be undone.`)) {
            performDelete(user.id); // Proceed if confirmed
        }
    };

    // *** NEW: Perform Deletion Handler (calls API) ***
    const performDelete = async (userId) => {
        setIsDeleting(userId); // Set loading state for this specific user ID
        try {
            await deleteUserApi(userId);
            toast.success(`User with ID ${userId} deleted successfully.`);
            loadUsers(); // Refresh the list after successful deletion
        } catch (err) {
            console.error("Error deleting user:", err);
            toast.error(`Failed to delete user: ${err.message}`);
        } finally {
            setIsDeleting(null); // Reset loading state regardless of success/failure
        }
    };

    // Role Badge Helper (Unchanged)
    const getRoleBadgeVariant = (role) => { /* ... remains the same ... */
        switch (role?.toUpperCase()) { case 'ADMIN': return 'danger'; case 'MODERATOR': return 'warning'; case 'STUDENT': return 'info'; default: return 'secondary'; }
    };

    // --- Render Logic ---
    return (
        <PageWrapper>
            <Container className="mt-4">
                <h2 className="text-center text-primary mb-4">👥 Manage Users</h2>

                {/* Loading/Error/No Users States (Unchanged) */}
                {isLoading && <div className="text-center py-5"><Spinner animation="border" variant="primary"/><p className="mt-2">Loading...</p></div>}
                {error && !isLoading && <Alert variant="danger" className="text-center">Error: {error}</Alert>}
                {!isLoading && !error && users.length === 0 && <Alert variant="info" className="text-center">No users found (excluding Moderators).</Alert>}

                {/* Users Table */}
                {!isLoading && !error && users.length > 0 && (
                    <Table striped bordered hover responsive className="shadow-sm align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => ( // Backend ensures MODERATOR is already filtered out
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td><Badge pill bg={getRoleBadgeVariant(user.role)}>{user.role || 'N/A'}</Badge></td>
                                    <td>
                                        {/* Use Stack for horizontal button layout with spacing */}
                                        <Stack direction="horizontal" gap={2}>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleOpenEditModal(user)}
                                                disabled={isDeleting === user.id} // Disable while deleting this user
                                            >
                                                ✏️ Edit Role
                                            </Button>
                                            {/* *** NEW: Delete Button *** */}
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDeleteClick(user)}
                                                disabled={isDeleting === user.id} // Disable button while this user is being deleted
                                            >
                                                {/* Show spinner when deleting this specific user */}
                                                {isDeleting === user.id ? (
                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                ) : (
                                                    '🗑️ Delete'
                                                )}
                                            </Button>
                                        </Stack>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

                {/* Edit Modal (Unchanged) */}
                <EditUserRoleModal
                    show={showEditModal}
                    handleClose={handleCloseEditModal}
                    userToEdit={userToEdit}
                    onSave={handleSaveRole}
                />
            </Container>
        </PageWrapper>
    );
};

export default ManageUsersPage;

