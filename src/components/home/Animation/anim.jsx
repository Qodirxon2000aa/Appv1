import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBolt, FaCalculator } from "react-icons/fa";
import "./anim.css";

const Anim = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev < 100 ? prev + 10 : 100));
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      navigate("/home");
    }, 2500);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="anim-container">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="anim-title"
      >
        <FaBolt className="icon" /> Hisoblash yuklanmoqda... <FaCalculator className="icon" />
      </motion.h1>
      <motion.div
        className="progress-bar"
        initial={{ width: "0%" }}
        animate={{ width: `${count}%` }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.span
        className="progress-text"
        key={count}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {count}%
      </motion.span>
    </div>
  );
};

export default Anim;
