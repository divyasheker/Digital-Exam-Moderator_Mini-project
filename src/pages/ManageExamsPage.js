// src/pages/ManageExamsPage.jsx

import React, { useState, useEffect } from "react";
import ExamListModal from "../pages/ExamListModal"; // Adjusted path/name
import AddEditExamModal from "../pages/AddEditExamModal"; // Adjusted path/name
import PageWrapper from "../components/PageWrapper"; // Assuming you have this
import { fetchExams, addExam, updateExam, deleteExam } from "../utils/examsApi"; // Use exam API
import { toast } from "react-toastify"; // Assuming you use toastify

const ManageExamsPage = () => {
  const [exams, setExams] = useState([]); // State for exams
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [showListModal, setShowListModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [examToEdit, setExamToEdit] = useState(null); // State for exam being edited

  // Fetch exams on mount
  useEffect(() => {
    loadExams();
  }, []);

  // Function to load exams from API
  const loadExams = async () => {
    setIsLoading(true);
    try {
      const data = await fetchExams();
      setExams(data);
    } catch (error) {
      console.error("Error loading exams:", error);
      toast.error(error.message || "Failed to load exams.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler to open Add modal
  const handleAddNewExam = () => {
    setExamToEdit(null); // Clear examToEdit for Add mode
    setShowAddEditModal(true);
  };

  // Handler to open Edit modal
  const handleEditExam = (exam) => {
    setExamToEdit(exam); // Set the exam to be edited
    setShowAddEditModal(true);
  };

  // Handler for deleting an exam
  const handleDeleteExam = async (id) => {
    const examToDelete = exams.find(exam => exam.id === id);
    const examTitle = examToDelete ? examToDelete.title : 'this exam';

    if (window.confirm(`Are you sure you want to delete the exam "${examTitle}"?`)) {
      setIsLoading(true);
      try {
        await deleteExam(id);
        toast.success(`Exam "${examTitle}" deleted successfully`);
        loadExams(); // Refresh list
         // Close edit modal if the deleted exam was being edited
         if (examToEdit && examToEdit.id === id) {
             setShowAddEditModal(false);
             setExamToEdit(null);
         }
      } catch (error) {
        console.error("Error deleting exam:", error);
        toast.error(error.message || "Failed to delete exam");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handler for saving (Add or Update) an exam
  const handleSaveExam = async (examData) => {
    setIsLoading(true);
    const isEditing = examToEdit && examToEdit.id;
    const examTitle = examData.title || (examToEdit ? examToEdit.title : 'the exam'); // Get title for messages

    try {
      if (isEditing) {
        // Update existing exam
        await updateExam(examToEdit.id, examData);
        toast.success(`Exam "${examTitle}" updated successfully`);
      } else {
        // Add new exam
        await addExam(examData);
        toast.success(`Exam "${examTitle}" added successfully`);
      }
      setShowAddEditModal(false); // Close the Add/Edit modal on success
      setExamToEdit(null); // Clear editing state
      loadExams(); // Refresh the list
    } catch (error) {
      console.error("Error saving exam:", error);
      toast.error(error.message || "Failed to save exam.");
      // Keep modal open on error so user can correct
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers for list modal visibility
   const handleOpenListModal = () => {
    loadExams(); // Refresh list when opening
    setShowListModal(true);
  };

   const handleCloseListModal = () => setShowListModal(false);


  return (
    <PageWrapper>
      <div className="container mt-5 text-center">
        <h2 className="text-warning mb-4">📋 Manage Exams</h2> {/* Updated Title */}
        <p className="lead mb-4">
          Create, view, update, or delete exam schedules and details.
        </p>
        <button
            className="btn btn-lg btn-outline-primary"
            onClick={handleOpenListModal}
            disabled={isLoading}
        >
          {isLoading && !showListModal ? "Loading..." : "View All Exams"} {/* Updated Button Text */}
        </button>
      </div>

      {/* List Modal - Pass exam-related props */}
      <ExamListModal
        show={showListModal}
        handleClose={handleCloseListModal}
        exams={exams}
        onEdit={handleEditExam} // Pass exam edit handler
        onDelete={handleDeleteExam} // Pass exam delete handler
        onAddNew={handleAddNewExam} // Pass exam add handler
      />

      {/* Add/Edit Modal - Render conditionally and pass exam-related props */}
      {showAddEditModal && (
         <AddEditExamModal
            show={showAddEditModal}
            handleClose={() => {
                setShowAddEditModal(false);
                setExamToEdit(null); // Ensure edit state is cleared on manual close
            }}
            onSave={handleSaveExam} // Pass exam save handler
            examToEdit={examToEdit} // Pass the exam being edited (or null)
         />
       )}
    </PageWrapper>
  );
};

export default ManageExamsPage;
