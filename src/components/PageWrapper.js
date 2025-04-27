// PageWrapper.jsx
import React from "react";
import { motion } from "framer-motion";

// Reusable PageWrapper component
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;