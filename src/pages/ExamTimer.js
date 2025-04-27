// src/components/ExamTimer.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap'; // Assuming you want the Card style

// Helper component to format time (could be merged, but separate for clarity)
const TimerDisplay = ({ seconds }) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return (
        <span>
            {minutes}:{remainingSeconds < 10 ? '0' : ''}{remainingSeconds}
        </span>
    );
};


// The main Timer component
const ExamTimer = ({ initialTimeInSeconds, onTimeUp }) => {
    const [secondsLeft, setSecondsLeft] = useState(initialTimeInSeconds);
    const intervalRef = useRef(null); // To store the interval ID

    useEffect(() => {
        // Start the timer only if initialTimeInSeconds is valid and > 0
        if (initialTimeInSeconds == null || initialTimeInSeconds <= 0) {
            return;
        }

        // Clear any existing interval before starting a new one
        if (intervalRef.current) {
             clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            setSecondsLeft((prevSeconds) => {
                if (prevSeconds <= 1) {
                    clearInterval(intervalRef.current); // Stop the timer
                    intervalRef.current = null;
                    if (onTimeUp) {
                        onTimeUp(); // Call the callback function passed from parent
                    }
                    return 0; // Stay at 0
                }
                return prevSeconds - 1; // Decrement time
            });
        }, 1000); // Run every second

        // Cleanup function: clear interval when component unmounts or initialTime changes
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    // Rerun effect if the initial time changes or the onTimeUp callback changes identity
    }, [initialTimeInSeconds, onTimeUp]);


    // Render the timer display (e.g., inside a styled Card)
    return (
        <Card body className="text-center bg-danger text-white p-2 shadow-sm">
            <h5 className="mb-0 fw-bold">
                {/* Optional: Add icon */}
                {/* <i className="bi bi-clock me-2"></i> */}
                <TimerDisplay seconds={secondsLeft} />
            </h5>
        </Card>
    );
};

export default ExamTimer;
