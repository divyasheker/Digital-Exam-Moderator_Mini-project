// src/pages/ManageUsers.js

import React from "react";
import PageWrapper from "../components/PageWrapper";

const ManageUsers = () => {
  return (
    <PageWrapper>
      <div className="container mt-5 text-center">
        <h2 className="text-danger">👥 Manage Users</h2>
        <p className="lead">Here you can view, update, or remove users from the system.</p>
        <p className="text-muted">[User management table will appear here]</p>
      </div>
    </PageWrapper>
  );
};

export default ManageUsers;
