import React from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
      style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <div>
        <motion.h1
          className="display-3 text-danger"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          404
        </motion.h1>
        <motion.p
          className="lead"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Page Not Found
        </motion.p>
        <motion.a
          href="/"
          className="btn btn-primary"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Go Back Home
        </motion.a>
      </div>
    </motion.div>
  );
};

export default NotFound;
