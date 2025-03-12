import React, { useState } from "react";
import "./loading.css";

const Loading = ({ showCalculator }) => {
  const [value, setValue] = useState("");

  const handleClick = (num) => {
    setValue(value + num);
  };

  const clearInput = () => {
    setValue("");
  };

  return (
    <div className="loading-container">
      <div className="spinner"></div>
      {showCalculator && (
        <div className="calculator">
          <input type="text" value={value} readOnly />
          <div className="buttons">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button key={num} onClick={() => handleClick(num)}>
                {num}
              </button>
            ))}
            <button onClick={clearInput}>C</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loading;
