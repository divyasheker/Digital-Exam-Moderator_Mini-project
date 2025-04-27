import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "bootstrap/dist/js/bootstrap.bundle.min"; // ✅ This enables modals
import App from "./App"; // Import your App component
import "./App.css"; // If you have any CSS, import it here

import { AuthProvider } from "./context/AuthContext";


const root = ReactDOM.createRoot(document.getElementById("root")); // Reference the root element
 
root.render(
  <React.StrictMode>
    <AuthProvider>
    <App /> 
    </AuthProvider>
  </React.StrictMode>
);