import React from "react";

const Services = () => {
  return (
    <section className="section text-center bg-white p-5" id="services">
      <div className="container">
        <h2 className="text-primary mb-4">Our Services</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="service-box p-4 shadow-sm rounded">
              <i className="bi bi-eye fs-1 text-primary"></i>
              <h4 className="mt-3">Live Monitoring</h4>
              <p>Ensuring fairness by monitoring online exams in real-time.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="service-box p-4 shadow-sm rounded">
              <i className="bi bi-shield-lock fs-1 text-success"></i>
              <h4 className="mt-3">Authentication</h4>
              <p>Only authorized users are allowed access to the exam.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="service-box p-4 shadow-sm rounded">
              <i className="bi bi-lock fs-1 text-danger"></i>
              <h4 className="mt-3">Data Security</h4>
              <p>Your exam data is encrypted and securely stored.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
