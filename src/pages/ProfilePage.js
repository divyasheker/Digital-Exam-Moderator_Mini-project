import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaEnvelope, FaUserShield, FaEdit, FaSave } from "react-icons/fa";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedRole = sessionStorage.getItem("role");
    const storedName = sessionStorage.getItem("name");

    if (!storedEmail) {
      navigate("/login");
    }

    setEmail(storedEmail);
    setRole(storedRole);
    setName(storedName);
  }, [navigate]);

  const handleToggleEdit = () => {
    if (isEditing) {
      if (!name.trim()) {
        toast.error("Name cannot be empty!");
        return;
      }
      sessionStorage.setItem("name", name);
      toast.success("Profile updated successfully!");
    }
    setIsEditing(!isEditing);
  };

  return (
    <PageWrapper>
      <div className="container">
        <div className="card p-4 shadow">
          <h2 className="text-center text-primary mb-4">👤 Profile</h2>
          <div className="mb-3">
            <label className="form-label"><FaUser className="me-2" />Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="mb-3">
            <label className="form-label"><FaEnvelope className="me-2" />Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="form-label"><FaUserShield className="me-2" />Role</label>
            <input
              type="text"
              className="form-control"
              value={role}
              disabled
            />
          </div>
          <button
            className={`btn ${isEditing ? "btn-success" : "btn-primary"} w-100`}
            onClick={handleToggleEdit}
          >
            {isEditing ? <><FaSave className="me-2" />Save</> : <><FaEdit className="me-2" />Edit</>}
          </button>
        </div>
      </div>
      <ToastContainer />
    </PageWrapper>
  );
};

export default Profile;
