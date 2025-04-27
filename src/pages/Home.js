import React from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const Home = () => {
  return (
    <PageWrapper>
      <section
        className="hero-section d-flex align-items-center text-center"
        style={{
          minHeight: "90vh",
          background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
          color: "#fff",
        }}
      >
        <div className="container">
          <h1 className="display-2 fw-bold mb-4 animate__animated animate__fadeInDown">
            Digital Exam Moderator
          </h1>
          <p className="lead mb-5 animate__animated animate__fadeInUp animate__delay-1s">
            Ensuring secure, smart, and hassle-free online examinations.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link
              to="/about"
              className="btn btn-outline-light btn-lg px-4 rounded-pill shadow animate__animated animate__fadeInUp animate__delay-2s"
            >
              Learn More
            </Link>
            <Link
              to="/login"
              className="btn btn-warning btn-lg px-4 rounded-pill shadow animate__animated animate__fadeInUp animate__delay-2s"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Home;
