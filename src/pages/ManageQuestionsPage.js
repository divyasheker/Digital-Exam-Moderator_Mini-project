// src/pages/ManageQuestions.js

import React, { useState, useEffect } from "react";
import QuestionListModal from "./QuestionListModal";
import AddEditQuestionModal from "./AddEditQuestionModal";
import PageWrapper from "../components/PageWrapper";
import { fetchQuestions, addQuestion, updateQuestion, deleteQuestion } from "../utils/questionsApi";
import { toast } from "react-toastify";

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [showListModal, setShowListModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await fetchQuestions();
      setQuestions(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load questions");
    }
  };

  const handleAddNew = () => {
    setQuestionToEdit(null);
    setShowAddEditModal(true);
  };

  const handleEdit = (question) => {
    setQuestionToEdit(question);
    setShowAddEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(id);
        toast.success("Question deleted successfully");
        loadQuestions();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete question");
      }
    }
  };

  const handleSave = async (question) => {
    try {
      if (question.id) {
        await updateQuestion(question.id, question);
        toast.success("Question updated successfully");
      } else {
        await addQuestion(question);
        toast.success("Question added successfully");
      }
      setShowAddEditModal(false);
      loadQuestions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save question");
    }
  };

  return (
    <PageWrapper>
      <div className="container mt-5 text-center">
        <h2 className="text-primary mb-4">Manage Questions</h2>
        <button className="btn btn-outline-primary" onClick={() => setShowListModal(true)}>
          📋 View All Questions
        </button>
      </div>

      <QuestionListModal
        show={showListModal}
        handleClose={() => setShowListModal(false)}
        questions={questions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
      />

      <AddEditQuestionModal
        show={showAddEditModal}
        handleClose={() => setShowAddEditModal(false)}
        onSave={handleSave}
        questionToEdit={questionToEdit}
      />
    </PageWrapper>
  );
};

export default ManageQuestions;
