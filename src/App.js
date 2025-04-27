import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'animate.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageWrapper from "./components/PageWrapper";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import StudentDashboard from "./pages/StudentDashboard";
import ExamPage from "./pages/ExamPage";
import AdminDashboard from "./pages/AdminDashboard";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import ProfilePage from "./pages/ProfilePage";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ResultsPage from "./pages/ResultsPage";
import ManageUsers from "./pages/ManageUsers";
import ManageExams from "./pages/ManageExamsPage";
import LiveMonitoring from "./pages/LiveMonitoring";
import Issues from "./pages/Issues";
import ManageQuestionsPage from "./pages/ManageQuestionsPage";

import ReportIssue from "./pages/ReportIssue";  // Import the ReportIssue component
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import MyIssues from "./pages/MyIssues";
import AvailableExamsPage from './pages/AvailableExamsPage';
import ExamTakingPage from './pages/ExamTakingPage';


function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          
          <Route path="/exam" element={<PageWrapper><ExamPage /></PageWrapper>} />
          <Route path="/my-issues" element={<MyIssues />} />
          <Route
  path="/admin-dashboard"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <PageWrapper><AdminDashboard /></PageWrapper>
    </ProtectedRoute>
  }
/>

<Route
  path="/moderator-dashboard"
  element={
    <ProtectedRoute allowedRoles={["MODERATOR"]}>
      <PageWrapper><ModeratorDashboard /></PageWrapper>
    </ProtectedRoute>
  }
/>

<Route
  path="/student-dashboard"
  element={
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <PageWrapper><StudentDashboard /></PageWrapper>
    </ProtectedRoute>
  }
/>
          <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
          <Route path="/results" element={<PageWrapper><ResultsPage /></PageWrapper>} />
          <Route path="/manage-users" element={<PageWrapper><ManageUsers /></PageWrapper>} />
          <Route path="/manage-exams" element={<PageWrapper><ManageExams /></PageWrapper>} />
          <Route path="/live-monitoring" element={<PageWrapper><LiveMonitoring /></PageWrapper>} />
          <Route path="/issues" element={<PageWrapper><Issues /></PageWrapper>} />
          <Route path="/available-exams" element={<PageWrapper><AvailableExamsPage /></PageWrapper>} />
          <Route path="/exam/:examId" element={<PageWrapper><ExamTakingPage /></PageWrapper>} />
          
          {/* Use the same route for both student and admin to access the ReportIssue page */}
          <Route path="/report-issue" element={<PageWrapper><ReportIssue /></PageWrapper>} />

          <Route path="/admin/manage-questions" element={<PageWrapper><ManageQuestionsPage /></PageWrapper>} />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} /> {/* Catch-all route */}
        </Routes>
      </div> 
      <Footer />
      <ToastContainer />
    </Router>
  );
}

export default App;
