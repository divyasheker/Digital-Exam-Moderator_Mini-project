import React from "react";
import PageWrapper from "../components/PageWrapper"; 

const Contact = () => {
  return (
    <PageWrapper>
    <section className="section bg-light p-5" id="contact">
      <div className="container text-center">
        <h2 className="text-primary">Contact Us</h2>
        <p className="mb-4">Have questions? Reach out to us anytime!</p>
        
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Your Name" required />
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" placeholder="Your Email" required />
              </div>
              <div className="mb-3">
                <textarea className="form-control" rows="4" placeholder="Your Message" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">Send Message</button>
            </form>
          </div>
        </div>

        <div className="mt-4">
          <p><strong>Email:</strong> <a href="mailto:digitalexammoderator@gmail.com">digitalexammoderator@gmail.com</a></p>
          <p><strong>Phone:</strong> 9999977777</p>
        </div>
      </div>
    </section>
    </PageWrapper>
  );
};

export default Contact;
