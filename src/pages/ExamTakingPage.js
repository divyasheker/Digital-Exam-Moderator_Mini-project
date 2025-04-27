// src/pages/ExamTakingPage.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../utils/questionsApi'; // Assuming this utility exists and works
import { toast } from 'react-toastify'; // Optional: for user feedback
import { Container, Row, Col, Card, Button, Form, Alert, ProgressBar, Spinner } from 'react-bootstrap';
// *** IMPORT THE SEPARATE TIMER COMPONENT ***
import ExamTimer from '../pages/ExamTimer'; // Adjust path if you placed it elsewhere

// TimerDisplay component is now likely inside ExamTimer.jsx, so not needed here

const ExamTakingPage = () => {
    // Get examId from URL (might be needed LATER for submission, but not used in handleSubmit currently)
    const { examId } = useParams();
    const location = useLocation(); // Get state passed during navigation
    const navigate = useNavigate();
    const timeLimitMinutes = location.state?.timeLimit; // Get time limit from state

    // State variables for exam data and UI control
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // Store answers: { questionId: selectedOptionValue }
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ref to track component mount status
    const isMounted = useRef(true);
    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; }; // Set to false on unmount
    }, []);

    // Effect to validate the time limit
    useEffect(() => {
        if (!timeLimitMinutes || timeLimitMinutes <= 0) {
            toast.error("Invalid exam time limit. Returning...");
            navigate('/available-exams');
        }
    }, [timeLimitMinutes, navigate]);

    // Effect to fetch questions
    useEffect(() => {
        if (!timeLimitMinutes || timeLimitMinutes <= 0) return; // Don't fetch if time limit invalid

        const loadQuestions = async () => {
            if (!isMounted.current) return;
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchQuestions();
                if (!isMounted.current) return;

                if (!data || data.length === 0) {
                    throw new Error("No questions found for this exam.");
                }
                setQuestions(data);
                const initialAnswers = {};
                data.forEach(q => { initialAnswers[q.id] = null; });
                setAnswers(initialAnswers);

            } catch (err) {
                 if (!isMounted.current) return;
                 console.error("Error fetching questions:", err);
                 setError(err.message || 'Failed to load questions.');
                 toast.error(err.message || 'Failed to load questions.');
            } finally {
                 if (isMounted.current) setIsLoading(false);
            }
        };

        loadQuestions();
    }, [examId, timeLimitMinutes]); // Keep examId here if API call depends on it

    // --- Submission Logic (Placeholder) ---
    const handleSubmit = useCallback(() => {
        if (!isMounted.current) return;

        // TODO: Implement actual submission to your backend API
        // If you needed examId here, you would add it back to the dependency array below
        // const submissionData = { examId: examId, responses: answers };
        // await api.submitExam(submissionData);

        console.log("Submitting answers:", answers);
        toast.success("Exam Submitted! (Backend integration pending)");
        navigate('/student-dashboard');
    // *** FIX: Removed unnecessary 'examId' dependency ***
    }, [answers, navigate]); // Dependencies are only 'answers' and 'navigate'


    // --- Time Up Handler ---
    const handleTimeExpired = useCallback(() => {
        if (!isMounted.current) return;
        toast.warn("Time's up! Submitting automatically.");
        handleSubmit(); // Trigger the memoized handleSubmit
    }, [handleSubmit]); // Depends only on handleSubmit


    // --- Event Handlers for user interaction ---
    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: selectedOption,
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };


     // --- Render Logic ---

     // Loading State
     if (isLoading || !timeLimitMinutes || timeLimitMinutes <= 0) {
        return ( <div className="d-flex vh-100 justify-content-center align-items-center text-center"><Spinner animation="border" variant="primary" /><p className="ms-3 text-muted">Loading Exam...</p></div>);
    }
    // Error State
    if (error) {
        return ( <Container className="mt-5 text-center"><Alert variant="danger"><h4>Error</h4><p>{error}</p><Button variant="secondary" onClick={() => navigate('/available-exams')}>Back</Button></Alert></Container>);
    }
    // No Questions State
    if (questions.length === 0) {
        return ( <Container className="mt-5 text-center"><Alert variant="warning">No questions available.</Alert><Button variant="secondary" onClick={() => navigate('/available-exams')}>Back</Button></Container>);
    }

    // Prepare data for rendering
    const currentQuestion = questions[currentQuestionIndex];
    const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
    const initialTimeForTimer = timeLimitMinutes * 60;

    // Main Exam UI
    return (
         <Container fluid className="py-3 px-md-4 d-flex flex-column vh-100 bg-light">
            {/* Header Row */}
            <Row className="mb-3 pb-2 border-bottom align-items-center flex-shrink-0">
                <Col><h4 className="text-primary mb-1">Online Exam</h4><span className="text-muted">Question {currentQuestionIndex + 1} of {questions.length}</span></Col>
                <Col xs="auto">
                    {/* Render the separate ExamTimer component */}
                    <ExamTimer
                        key={examId} // Use key for potential resets if needed
                        initialTimeInSeconds={initialTimeForTimer}
                        onTimeUp={handleTimeExpired} // Pass the callback
                    />
                </Col>
            </Row>
            {/* Progress Bar */}
             <ProgressBar now={progressPercent} label={`${Math.round(progressPercent)}%`} className="mb-4 flex-shrink-0" striped variant="info" animated />
             {/* Main Content Area */}
             <Row className="flex-grow-1 overflow-auto">
                <Col>
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="d-flex flex-column">
                             <Card.Title as="h5" className="mb-4 fs-4">{currentQuestion.questionText}</Card.Title>
                            {/* Options Form */}
                            <Form className="flex-grow-1 mb-4 ">
                                <Form.Group>
                                    {[currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4]
                                        .filter(opt => opt != null && opt !== '')
                                        .map((option, index) => (
                                            <Form.Check
                                                type="radio"
                                                id={`q${currentQuestion.id}-opt${index}`}
                                                key={`q${currentQuestion.id}-opt-${index}`} // Stable key
                                                label={option}
                                                value={option}
                                                name={`question_${currentQuestion.id}`}
                                                checked={answers[currentQuestion.id] === option}
                                                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                                                className="mb-3 fs-5 p-3 border rounded bg-white hover-bg-light cursor-pointer"
                                            />
                                        ))
                                    }
                                </Form.Group>
                            </Form>
                             {/* Navigation Buttons */}
                            <div className="mt-auto pt-3 border-top d-flex justify-content-between">
                                <Button variant="outline-secondary" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} style={{ minWidth: '100px'}}>⬅️ Previous</Button>
                                 {currentQuestionIndex < questions.length - 1 ? (
                                    <Button variant="primary" onClick={handleNextQuestion} style={{ minWidth: '100px'}}>Next ➡️</Button>
                                 ) : (
                                     <Button variant="success" onClick={handleSubmit} style={{ minWidth: '130px'}}>✅ Submit Exam</Button>
                                 )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
             </Row>
         </Container>
    );
};

export default ExamTakingPage;
