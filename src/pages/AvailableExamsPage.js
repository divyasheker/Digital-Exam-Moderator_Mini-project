// src/pages/AvailableExamsPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchExams } from '../utils/examsApi'; // Assuming this utility exists and works
import { toast } from 'react-toastify'; // Optional: for user feedback
import PageWrapper from '../components/PageWrapper'; // Assuming you have this layout component
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';

// Helper function to format date/time nicely
const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        return new Date(isoString).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    } catch (e) {
        return 'Invalid Date';
    }
};

// Helper function to determine exam status based on current time
const getExamStatus = (exam, currentTime) => {
    if (!exam?.scheduled_time || !exam?.time_limit_minutes) {
        return { status: 'error', message: 'Invalid exam data' };
    }
    try {
        const scheduledTime = new Date(exam.scheduled_time);
        // Calculate end time (scheduled time + duration)
        const endTime = new Date(scheduledTime.getTime() + exam.time_limit_minutes * 60000);

        if (isNaN(scheduledTime.getTime()) || isNaN(endTime.getTime())) {
             return { status: 'error', message: 'Invalid date/time format' };
        }

        if (currentTime < scheduledTime) {
            // Exam is in the future
            return { status: 'scheduled', message: `Starts at: ${formatDateTime(exam.scheduled_time)}` };
        } else if (currentTime >= scheduledTime && currentTime < endTime) {
            // Exam is currently active
            const minutesRemaining = Math.max(0, Math.floor((endTime.getTime() - currentTime.getTime()) / 60000)); // Ensure non-negative
            return { status: 'ready', message: `Ends in approx. ${minutesRemaining} min` };
        } else {
            // Exam time has passed
            return { status: 'expired', message: 'Exam time has passed' };
        }
    } catch (e) {
        console.error("Error calculating exam status:", e);
        return { status: 'error', message: 'Error calculating status' };
    }
};

const AvailableExamsPage = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Fetch all exams on component mount
    useEffect(() => {
        const loadAllExams = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchExams();
                // Sort exams by scheduled time (upcoming first)
                const sortedData = data.sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));
                setExams(sortedData);
            } catch (err) {
                console.error("Error fetching exams list:", err);
                const errorMsg = err.message || 'Failed to load available exams.';
                setError(errorMsg);
                toast.error(errorMsg); // Optional feedback
            } finally {
                setIsLoading(false);
            }
        };
        loadAllExams();
    }, []);

    // Set up a timer to update the current time every second
    // This allows the status (and button disable state) to update in real-time
    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        // Cleanup the interval when the component unmounts
        return () => clearInterval(timerId);
    }, []);

    // Calculate statuses for exams based on the current time
    // Filter out expired ones for display (or show them differently if needed)
    const displayableExams = exams
        .map(exam => ({
            ...exam,
            statusInfo: getExamStatus(exam, currentTime)
        }))
        .filter(exam => exam.statusInfo.status !== 'expired' && exam.statusInfo.status !== 'error');

    // Handler to navigate to the exam taking page
    const handleTakeExamClick = (examId, timeLimit) => {
        navigate(`/exam/${examId}`, { state: { timeLimit: timeLimit } });
    };

    // --- Render Logic ---
    const renderExamCard = (exam) => {
        const { status, message } = exam.statusInfo;
        let badgeVariant = 'secondary';
        let buttonText = 'View Details'; // Default button text
        let isButtonDisabled = true;

        // Determine badge color and button state based on status
        switch (status) {
            case 'scheduled':
                badgeVariant = 'info';
                buttonText = 'Scheduled'; // Button remains disabled
                break;
            case 'ready':
                badgeVariant = 'success';
                buttonText = 'Take Exam Now'; // Button enabled
                isButtonDisabled = false;
                break;
            default: // Includes 'error' or unexpected states
                 badgeVariant = 'warning';
                 buttonText = 'Unavailable';
                 break;
        }

        return (
            // Use Bootstrap grid columns for responsive layout
            <Col md={6} lg={4} className="mb-4 d-flex align-items-stretch" key={exam.id}>
                <Card className="shadow-sm w-100">
                    <Card.Header as="h5" className="d-flex justify-content-between align-items-center bg-light">
                        {exam.title}
                        <Badge pill bg={badgeVariant} text={badgeVariant === 'info' || badgeVariant === 'light' ? 'dark' : 'white'}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                    </Card.Header>
                    <Card.Body className="d-flex flex-column">
                        <Card.Text className="text-muted flex-grow-1">
                            {exam.description || 'No description provided.'}
                        </Card.Text>
                        <div className="mt-2 mb-3">
                             <small className="d-block text-muted">Scheduled: {formatDateTime(exam.scheduled_time)}</small>
                             <small className="d-block text-muted">Time Limit: {exam.time_limit_minutes} minutes</small>
                        </div>
                        {/* Display the dynamic message (Starts at... / Ends in...) */}
                        <Alert variant={status === 'ready' ? 'success' : 'info'} className="py-1 px-2 mb-3 text-center">
                           <small>{message}</small>
                        </Alert>
                        <Button
                            variant={isButtonDisabled ? "secondary" : "primary"}
                            onClick={() => handleTakeExamClick(exam.id, exam.time_limit_minutes)}
                            disabled={isButtonDisabled}
                            className="w-100 mt-auto" // Button at the bottom
                        >
                            {buttonText}
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        );
    };


    return (
        <PageWrapper>
            <Container className="mt-4 mb-5">
                <h2 className="text-center text-primary mb-4">Available Exams</h2>

                {isLoading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Loading Exams...</span>
                        </Spinner>
                        <p className="mt-2 text-muted">Loading available exams...</p>
                    </div>
                )}

                {error && !isLoading && (
                    <Alert variant="danger" className="text-center">
                        Error loading exams: {error}
                    </Alert>
                )}

                {!isLoading && !error && displayableExams.length === 0 && (
                    <Alert variant="info" className="text-center">
                        There are no upcoming or currently active exams scheduled for you at this time.
                    </Alert>
                )}

                {!isLoading && !error && displayableExams.length > 0 && (
                    <Row>
                        {displayableExams.map(renderExamCard)}
                    </Row>
                )}
            </Container>
        </PageWrapper>
    );
};

export default AvailableExamsPage;
