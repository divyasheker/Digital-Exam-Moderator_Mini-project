import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";

const Services = () => {
  return (
    <PageWrapper>
      <motion.section
        className="hero-section container my-5"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      >
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">Our Services</h1>
          <p className="lead">We offer a range of smart online examination services.</p>
        </div>

        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card shadow h-100 p-4">
              <h5>AI-Based Proctoring</h5>
              <p className="text-muted">Ensure exam integrity with real-time AI monitoring.</p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow h-100 p-4">
              <h5>Live Exam Supervision</h5>
              <p className="text-muted">Let moderators supervise students during live tests.</p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow h-100 p-4">
              <h5>Automated Reports</h5>
              <p className="text-muted">Generate instant violation logs and performance reports.</p>
            </div>
          </div>
        </div>
      </motion.section>
    </PageWrapper>
  );
};

export default Services;
