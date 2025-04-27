import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";

const About = () => {
  return (
    <PageWrapper>
              <motion.section
          className="hero-section container my-5"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
        <div className="card shadow-lg border-0 rounded-4 p-5">
          <div className="row align-items-center">
            {/* Text Content */}
            <div className="col-md-7">
              <h1 className="display-5 fw-bold text-primary mb-4">About Digital Exam Moderator</h1>
              <p className="lead mb-4 text-secondary">
                We provide a modern, secure, and AI-powered proctoring system designed to ensure academic integrity during online exams.
              </p>
              <ul className="list-unstyled text-secondary">
                <li>✅ Real-time face tracking and behavior detection</li>
                <li>✅ Admin & Moderator tools to manage exams</li>
                <li>✅ Student-friendly interface with smooth experience</li>
              </ul>
            </div>

            {/* Visual / Illustration */}
            <div className="col-md-5 text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2942/2942497.png"
                alt="Exam Illustration"
                className="img-fluid"
                style={{ maxHeight: "250px" }}
              />
            </div>
          </div>
        </div>
      </motion.section>
    </PageWrapper>
  );
};

export default About;
