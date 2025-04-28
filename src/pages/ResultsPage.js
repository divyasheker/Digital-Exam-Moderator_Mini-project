// src/pages/ResultsPage.jsx

import React, { useState, useEffect } from 'react';
import { fetchStudentResults } from '../utils/resultsApi'; // Import API utility
import PageWrapper from '../components/PageWrapper'; // Use your layout component
import { Container, Table, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify'; // Optional for feedback

// Helper to format timestamp
const formatTimestamp = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        return new Date(isoString).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }); // Example format
    } catch (e) {
        return 'Invalid Date';
    }
};

const ResultsPage = () => {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchStudentResults();
                setResults(data);
            } catch (err) {
                console.error("Error loading results:", err);
                const errorMsg = err.message || "Failed to load exam results.";
                setError(errorMsg);
                toast.error(errorMsg);
            } finally {
                setIsLoading(false);
            }
        };

        loadResults();
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <PageWrapper>
            <Container className="mt-4">
                <h2 className="text-center text-success mb-4">📊 Exam Results</h2>

                {isLoading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="success" />
                        <p className="mt-2 text-muted">Loading your results...</p>
                    </div>
                )}

                {error && !isLoading && (
                    <Alert variant="danger" className="text-center">
                        Error loading results: {error}
                    </Alert>
                )}

                {!isLoading && !error && results.length === 0 && (
                    <Alert variant="info" className="text-center">
                        You have not completed any exams yet.
                    </Alert>
                )}

                {!isLoading && !error && results.length > 0 && (
                    <Table striped bordered hover responsive className="shadow-sm align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Exam Title</th>
                                <th>Score</th>
                                <th>Submitted On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, index) => (
                                <tr key={result.id}>
                                    <td>{index + 1}</td>
                                    <td>{result.examTitle}</td>
                                    <td className="text-center"> {/* Center score */}
                                        <span className="fw-bold fs-5">{result.score}</span> / {result.totalQuestions}
                                    </td>
                                    <td>{formatTimestamp(result.submissionTimestamp)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Container>
        </PageWrapper>
    );
};

export default ResultsPage;
