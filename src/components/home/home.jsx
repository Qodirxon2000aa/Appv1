import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { FaColumns, FaHardHat, FaCalculator, FaMoneyBillWave } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Bo'limlar</h2>

        <button onClick={() => navigate("/dashboard")} className="nav-btn">
          <FaColumns style={{ marginRight: "8px" }} /> Boshqaruv
        </button>

        <button onClick={() => navigate("/view/order")} className="nav-btn">
          <FaHardHat style={{ marginRight: "8px" }} /> Ishga Yuborish
        </button>

        <button onClick={() => navigate("/calcu")} className="nav-btn">
          <FaCalculator style={{ marginRight: "8px" }} /> Hisoblash
        </button>

        <button onClick={() => navigate("/money")} className="nav-btn">
          <FaMoneyBillWave style={{ marginRight: "8px" }} /> Oylik
        </button>
      </div>
    </div>
  );
};

export default Home;
