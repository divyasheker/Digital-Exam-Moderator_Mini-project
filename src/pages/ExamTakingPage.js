// src/pages/ExamTakingPage.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../utils/questionsApi';
import { submitExam } from '../utils/resultsApi';
import axios from 'axios';
import { toast } from 'react-toastify';
// *** Ensure Stack is imported ***
import { Container, Row, Col, Card, Button, Form, Alert, ProgressBar, Spinner, Badge, Stack } from 'react-bootstrap';
import ExamTimer from '../components/ExamTimer'; // Check path

// Define constants
const AI_VIDEO_FEED_URL = "http://localhost:5001/video_feed";
const WARNING_THRESHOLD = 3;

const ExamTakingPage = () => {
    const { examId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const timeLimitMinutes = location.state?.timeLimit;

    // State declarations (Exam, AI, UI)
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTerminated, setIsTerminated] = useState(false);
    const [aiStatus, setAiStatus] = useState(null);
    const [aiError, setAiError] = useState(null);
    const [isVideoFeedError, setIsVideoFeedError] = useState(false);

    // Refs
    const isMounted = useRef(true);
    const aiStatusIntervalRef = useRef(null);

    // Effect for component mount/unmount status
    useEffect(() => { isMounted.current = true; return () => { isMounted.current = false; }; }, []);

    // --- Define Callbacks in Correct Order ---

    // 1. stopPollingAiStatus (No dependencies on other callbacks)
    const stopPollingAiStatus = useCallback(() => {
        if (aiStatusIntervalRef.current) {
            console.log("Stopping AI status polling.");
            clearInterval(aiStatusIntervalRef.current);
            aiStatusIntervalRef.current = null;
        }
    }, []); // Empty dependency array

    // 2. handleSubmit (Depends on stopPollingAiStatus)
    const handleSubmit = useCallback(async (triggeredBy = 'manual') => {
        if (!isMounted.current || isSubmitting) return;
        setIsSubmitting(true);
        stopPollingAiStatus(); // Use the defined function

        if (triggeredBy === 'ai_terminate') toast.error("Exam terminated! Submitting results...");
        else if (triggeredBy === 'timer') toast.warn("Time's up! Submitting automatically...");
        else console.log("Manual submit initiated...");

        const submissionData = { examId: parseInt(examId, 10), answers: answers };
        try {
            const result = await submitExam(submissionData);
            if (!isMounted.current) return;
            toast.success(`Exam submitted! Score: ${result.score}/${result.totalQuestions}`);
            navigate('/results');
        } catch (error) {
             if (!isMounted.current) return;
             console.error("Submit failed:", error); toast.error(`Submit Error: ${error.message}`);
             setIsSubmitting(false);
             // Consider restarting polling on submit error?
             // startPollingAiStatus();
        }
    }, [answers, navigate, examId, isSubmitting, stopPollingAiStatus]); // Include stopPollingAiStatus

    // 3. fetchAiStatus (Depends on handleSubmit, stopPollingAiStatus)
    const fetchAiStatus = useCallback(async () => {
        if (!isMounted.current || isSubmitting || isTerminated) return;
        try {
            const response = await axios.get('http://localhost:8080/api/ai/status');
            if (isMounted.current) {
                const statusData = response.data;
                setAiStatus(statusData);
                setAiError(null);

                if (statusData?.terminated === true && !isTerminated) {
                    console.log("Termination signal received!");
                    setIsTerminated(true);
                    stopPollingAiStatus(); // Use the defined function
                    handleSubmit('ai_terminate'); // Use the defined function
                }
            }
        } catch (error) {
             if (isMounted.current) {
                 console.error("❌ AI Status Fetch Error:", error);
                 if (!aiError) setAiError("AI status unavailable.");
                 setAiStatus(null);
             }
        }
        // No need to list aiError, isSubmitting, isTerminated as dependencies if we only READ them
        // But we DO need handleSubmit and stopPollingAiStatus because we CALL them.
    }, [handleSubmit, stopPollingAiStatus, aiError, isSubmitting, isTerminated]); // Add necessary callback dependencies

    // 4. startPollingAiStatus (Depends on fetchAiStatus)
    const startPollingAiStatus = useCallback(() => {
        if (aiStatusIntervalRef.current || !isMounted.current) return;
        console.log("Starting AI status polling...");
        fetchAiStatus(); // Use the defined function
        aiStatusIntervalRef.current = setInterval(fetchAiStatus, 3000);
    }, [fetchAiStatus]); // Depends on fetchAiStatus

    // --- Remaining useEffect Hooks and Handlers ---

    // Effect for starting/stopping AI & Polling (Uses start/stop callbacks)
    useEffect(() => {
        const startAi = async () => {
            try {
                await axios.post('http://localhost:8080/api/ai/start');
                console.log("✅ AI Start Req Sent");
                // Cannot call startPolling here directly if it causes dependency loop,
                // but since startPolling depends on fetchAiStatus which depends on handleSubmit/stopPolling,
                // it's complex. Let's try including them.
                if (isMounted.current) startPollingAiStatus();
            } catch (error) {
                console.error("❌ Failed AI Start Req:", error);
                if (isMounted.current) setAiError("Failed to start AI.");
            }
        };
        startAi();
        return () => {
            console.log("🛑 Unmount: Stop AI & Polling");
            stopPollingAiStatus(); // Use the defined function
            axios.post('http://localhost:8080/api/ai/stop').catch(err => console.error("AI stop req failed", err));
        };
    // ESLint correctly wants startPollingAiStatus and stopPollingAiStatus here
    }, [startPollingAiStatus, stopPollingAiStatus]);

    // Effect for time limit validation
    useEffect(() => {
        if (!timeLimitMinutes || timeLimitMinutes <= 0) { toast.error("Invalid time limit."); navigate('/available-exams'); }
    }, [timeLimitMinutes, navigate]);

    // Effect for fetching questions
    useEffect(() => {
        if (!timeLimitMinutes || timeLimitMinutes <= 0) return;
        const loadQuestions = async () => {
            if (!isMounted.current) return; setIsLoading(true); setError(null);
            try {
                const data = await fetchQuestions(); if (!isMounted.current) return;
                if (!data || data.length === 0) throw new Error("No questions found.");
                setQuestions(data); const initialAnswers = {}; data.forEach(q => { initialAnswers[q.id] = null; }); setAnswers(initialAnswers);
            } catch (err) { if (!isMounted.current) return; console.error("Error fetching questions:", err); setError(err.message || 'Failed.'); toast.error(err.message || 'Failed.'); }
            finally { if (isMounted.current) setIsLoading(false); }
        };
        loadQuestions();
    }, [examId, timeLimitMinutes]);

    // Time Up Handler (Depends on handleSubmit)
    const handleTimeExpired = useCallback(() => {
        if (!isMounted.current || isSubmitting || isTerminated) return;
        handleSubmit('timer');
    }, [handleSubmit, isSubmitting, isTerminated]);

    // Event Handlers (No hook dependencies)
    const handleAnswerChange = (questionId, selectedOption) => { if (!isTerminated) setAnswers(prev => ({...prev, [questionId]: selectedOption})); };
    const handleNextQuestion = () => { if (!isTerminated && currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1); };
    const handlePreviousQuestion = () => { if (!isTerminated && currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1); };

    // --- Render Logic ---
    if (isLoading || !timeLimitMinutes || timeLimitMinutes <= 0) { return <div className="vh-100 d-flex justify-content-center align-items-center"><Spinner animation="border"/><p>Loading...</p></div>; }
    if (error) { return <Container className="mt-5"><Alert variant="danger"><h4>Error Loading Exam</h4><p>{error}</p><Button onClick={()=>navigate('/available-exams')}>Back</Button></Alert></Container>; }
    if (questions.length === 0 && !isLoading) { return <Container className="mt-5"><Alert variant="warning">No questions found for this exam.</Alert><Button onClick={()=>navigate('/available-exams')}>Back</Button></Container>; }

    const currentQuestion = questions[currentQuestionIndex];
    const progressPercent = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
    const initialTimeForTimer = timeLimitMinutes * 60;
    const aiWarningText = aiStatus?.warnings_list?.join('; ');
    const aiObjectsText = aiStatus?.prohibited_objects?.join(', ');
    const accumulatedWarnings = aiStatus?.warning_count ?? 0;

    return (
         <Container fluid className="py-3 px-md-4 d-flex flex-column vh-100 bg-light">
            {/* Header */}
            <Row className="mb-3 pb-2 border-bottom align-items-center flex-shrink-0">
                <Col md={9}>
                    <h4 className="text-primary mb-1">Online Exam</h4>
                    <span className="text-muted d-block">Q {currentQuestionIndex + 1}/{questions.length}</span>
                    {/* AI Status Display */}
                    <div className="mt-1 ai-status-badges" style={{ minHeight: '24px' }}>
                         {aiError && <Badge bg="danger" className="me-1 my-1">AI Error: {aiError}</Badge>}
                         {isVideoFeedError && <Badge bg="danger" className="me-1 my-1">Video Feed Error</Badge>}
                         {aiWarningText && aiWarningText !== "Initializing..." && aiWarningText !== "Monitoring Stopped" && <Badge bg="warning" text="dark" className="me-1 my-1">Alert: {aiWarningText}</Badge>}
                         {aiStatus && <Badge bg="info" text="dark" className="me-1 my-1">Faces: {aiStatus.faces ?? '?'}</Badge>}
                         {aiStatus && <Badge bg="secondary" className="me-1 my-1">Pose: {aiStatus.head_pose_status ?? 'N/A'}</Badge>}
                         {aiObjectsText && <Badge bg="danger" className="me-1 my-1">Objects: {aiObjectsText}</Badge>}
                         {/* Use constant WARNING_THRESHOLD */}
                         <Badge bg={accumulatedWarnings >= WARNING_THRESHOLD - 1 ? "danger" : "primary"} className="ms-2 my-1">Warnings: {accumulatedWarnings}/{WARNING_THRESHOLD}</Badge>
                         {isTerminated && <Badge bg="danger" pill className="ms-2 my-1 fs-6">EXAM TERMINATED</Badge>}
                     </div>
                </Col>
                <Col md={3} className="d-flex justify-content-end align-items-start">
                     {/* Use imported Stack */}
                    <Stack direction="horizontal" gap={3} className="align-items-center">
                        {/* Live Video Feed */}
                        <div className="ai-video-feed border" style={{ width: '150px', height: '112px', backgroundColor: '#eee', overflow: 'hidden', position: 'relative' }}>
                             {!isVideoFeedError && ( <img src={AI_VIDEO_FEED_URL} alt="AI Monitoring Feed" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => { console.error('Video feed error'); if (isMounted.current && !isVideoFeedError) setIsVideoFeedError(true); }}/> )}
                             {isVideoFeedError && ( <div className="d-flex align-items-center justify-content-center h-100 text-muted small">Feed N/A</div> )}
                         </div>
                         {/* Exam Timer */}
                        <ExamTimer key={examId} initialTimeInSeconds={initialTimeForTimer} onTimeUp={handleTimeExpired}/>
                    </Stack>
                </Col>
            </Row>
            {/* Progress Bar */}
             <ProgressBar now={progressPercent} className="mb-4 flex-shrink-0" striped variant="info" animated />
             {/* Main Content */}
             <fieldset disabled={isTerminated || isSubmitting}>
                 <Row className="flex-grow-1 overflow-auto"> <Col> <Card className="h-100"> <Card.Body className="d-flex flex-column">
                     {currentQuestion ? (
                         <>
                            <Card.Title as="h5" className="mb-4 fs-4">{currentQuestion.questionText}</Card.Title>
                            <Form className="flex-grow-1 mb-4"> <Form.Group>
                                {[currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4]
                                    .filter(opt => opt != null && opt !== '').map((option, index) => (
                                    <Form.Check type="radio" id={`q${currentQuestion.id}-opt${index}`} key={`q${currentQuestion.id}-opt-${index}`} label={option} value={option} name={`question_${currentQuestion.id}`} checked={answers[currentQuestion.id] === option} onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)} className="mb-3 fs-5 p-3 border rounded"/>
                                ))}
                            </Form.Group> </Form>
                         </>
                     ) : ( !isLoading && <div className="text-center text-muted">Loading question...</div> )}
                     {/* Footer Nav */}
                     <div className="mt-auto pt-3 border-top d-flex justify-content-between">
                         <Button variant="outline-secondary" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0 || isSubmitting || isTerminated}>⬅️ Previous</Button>
                         {currentQuestionIndex < questions.length - 1 ? (
                             <Button variant="primary" onClick={handleNextQuestion} disabled={isSubmitting || isTerminated}>Next ➡️</Button>
                          ) : (
                              <Button variant="success" onClick={() => handleSubmit('manual')} disabled={isSubmitting || isTerminated}> {isSubmitting ? <Spinner as="span" animation="border" size="sm"/> : '✅ Submit Exam'} </Button>
                          )}
                     </div>
                 </Card.Body> </Card> </Col> </Row>
             </fieldset>
         </Container>
    );
};

export default ExamTakingPage;
