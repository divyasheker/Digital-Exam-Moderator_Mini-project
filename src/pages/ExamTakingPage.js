// src/pages/ExamTakingPage.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../utils/questionsApi';
import { submitExam } from '../utils/resultsApi'; // *** Import submitExam ***
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Button, Form, Alert, ProgressBar, Spinner } from 'react-bootstrap';
import ExamTimer from '../pages/ExamTimer';

const ExamTakingPage = () => {
    const { examId } = useParams(); // Get exam ID from URL
    const location = useLocation();
    const navigate = useNavigate();
    const timeLimitMinutes = location.state?.timeLimit;

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state

    const isMounted = useRef(true);
    useEffect(() => { /* ... mount status ... */
        isMounted.current = true;
        return () => { isMounted.current = false; };
     }, []);
    useEffect(() => { /* ... time limit validation ... */
        if (!timeLimitMinutes || timeLimitMinutes <= 0) { toast.error("Invalid exam time limit."); navigate('/available-exams'); }
     }, [timeLimitMinutes, navigate]);
    useEffect(() => { /* ... fetch questions ... */
        if (!timeLimitMinutes || timeLimitMinutes <= 0) return;
        const loadQuestions = async () => {
            if (!isMounted.current) return; setIsLoading(true); setError(null);
            try {
                const data = await fetchQuestions(); if (!isMounted.current) return;
                if (!data || data.length === 0) throw new Error("No questions found.");
                setQuestions(data); const initialAnswers = {}; data.forEach(q => { initialAnswers[q.id] = null; }); setAnswers(initialAnswers);
            } catch (err) { if (!isMounted.current) return; console.error("Error fetching:", err); setError(err.message || 'Failed.'); toast.error(err.message || 'Failed.'); }
            finally { if (isMounted.current) setIsLoading(false); }
        }; loadQuestions();
     }, [examId, timeLimitMinutes]);

    // --- Submission Logic ---
    const handleSubmit = useCallback(async () => {
        if (!isMounted.current || isSubmitting) return; // Prevent double submission

        setIsSubmitting(true); // Indicate submission started
        console.log("Attempting submit:", answers);

        const submissionData = {
            // Ensure examId is a number if backend expects Long/Integer
            examId: parseInt(examId, 10),
            answers: answers
        };

        try {
            const result = await submitExam(submissionData); // Call API
            if (!isMounted.current) return; // Check mount status after await
            console.log("Submit success:", result);
            toast.success(`Exam submitted! Score: ${result.score}/${result.totalQuestions}`);
            navigate('/results'); // Navigate to results page on success

        } catch (error) {
             if (!isMounted.current) return;
             console.error("Submit failed:", error);
             toast.error(`Submission Error: ${error.message}`);
             setIsSubmitting(false); // Allow retry on error
             // Consider navigation strategy on error
        }
        // No finally block setting isSubmitting to false here, as successful submit navigates away

    // *** examId IS used in submissionData, so keep it in dependency array ***
    }, [answers, navigate, examId, isSubmitting]); // Add isSubmitting


    // --- Time Up Handler ---
    const handleTimeExpired = useCallback(() => {
        if (!isMounted.current) return;
        toast.warn("Time's up! Submitting...");
        handleSubmit(); // Trigger submission
    }, [handleSubmit]);

    // --- Event Handlers (handleAnswerChange, handleNextQuestion, handlePreviousQuestion) ---
    const handleAnswerChange = (questionId, selectedOption) => { /* ... */ setAnswers(prev => ({...prev, [questionId]: selectedOption})); };
    const handleNextQuestion = () => { /* ... */ if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1); };
    const handlePreviousQuestion = () => { /* ... */ if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1); };

    // --- Render Logic ---
    if (isLoading || !timeLimitMinutes || timeLimitMinutes <= 0) { /* Loading */ return <div className="vh-100 d-flex justify-content-center align-items-center"><Spinner animation="border" variant="primary"/><p className="ms-3">Loading...</p></div>; }
    if (error) { /* Error */ return <Container className="mt-5"><Alert variant="danger"><h4>Error</h4><p>{error}</p><Button onClick={()=>navigate('/available-exams')}>Back</Button></Alert></Container>; }
    if (questions.length === 0) { /* No Questions */ return <Container className="mt-5"><Alert variant="warning">No questions.</Alert><Button onClick={()=>navigate('/available-exams')}>Back</Button></Container>; }

    const currentQuestion = questions[currentQuestionIndex];
    const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
    const initialTimeForTimer = timeLimitMinutes * 60;

    return (
         <Container fluid className="py-3 px-md-4 d-flex flex-column vh-100 bg-light">
            {/* Header */}
            <Row className="mb-3 pb-2 border-bottom align-items-center flex-shrink-0">
                <Col><h4 className="text-primary mb-1">Online Exam</h4><span className="text-muted">Q {currentQuestionIndex + 1}/{questions.length}</span></Col>
                <Col xs="auto"><ExamTimer key={examId} initialTimeInSeconds={initialTimeForTimer} onTimeUp={handleTimeExpired}/></Col>
            </Row>
            {/* Progress */}
             <ProgressBar now={progressPercent} label={`${Math.round(progressPercent)}%`} className="mb-4 flex-shrink-0" striped variant="info" animated />
             {/* Main Content */}
             <Row className="flex-grow-1 overflow-auto"> <Col> <Card className="h-100"> <Card.Body className="d-flex flex-column">
                 <Card.Title as="h5" className="mb-4 fs-4">{currentQuestion.questionText}</Card.Title>
                 <Form className="flex-grow-1 mb-4 "> <Form.Group>
                     {[currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4]
                        .filter(opt => opt != null && opt !== '').map((option, index) => (
                         <Form.Check type="radio" id={`q${currentQuestion.id}-opt${index}`} key={`q${currentQuestion.id}-opt-${index}`} label={option} value={option} name={`question_${currentQuestion.id}`} checked={answers[currentQuestion.id] === option} onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)} className="mb-3 fs-5 p-3 border rounded"/>
                     ))}
                 </Form.Group> </Form>
                 {/* Footer Nav */}
                 <div className="mt-auto pt-3 border-top d-flex justify-content-between">
                     <Button variant="outline-secondary" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0 || isSubmitting}>⬅️ Previous</Button>
                     {currentQuestionIndex < questions.length - 1 ? (
                         <Button variant="primary" onClick={handleNextQuestion} disabled={isSubmitting}>Next ➡️</Button>
                      ) : (
                          <Button variant="success" onClick={handleSubmit} disabled={isSubmitting}> {isSubmitting ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : '✅ Submit Exam'} </Button>
                      )}
                 </div>
             </Card.Body> </Card> </Col> </Row>
         </Container>
    );
};
export default ExamTakingPage;

