import React, { useEffect, useState } from "react";
import axios from "axios";
import "./money.css";

const Money = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [personalData, setPersonalData] = useState({});
  const [objectData, setObjectData] = useState({});
  const [priceData, setPriceData] = useState({});
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedObject, setSelectedObject] = useState("");

  useEffect(() => {
    axios
      .get("https://67bc973ced4861e07b3b2ccc.mockapi.io/Calcu")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://66a6197023b29e17a1a1ba9a.mockapi.io/Personal")
      .then((response) => {
        const personalMap = response.data.reduce((acc, person) => {
          acc[person.id] = person.name;
          return acc;
        }, {});
        setPersonalData(personalMap);
      })
      .catch((error) => {
        console.error("Error fetching personal data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://66a6197023b29e17a1a1ba9a.mockapi.io/Object")
      .then((response) => {
        const objectMap = response.data.reduce((acc, obj) => {
          acc[obj.id] = { name: obj.name, date: obj.sana };
          return acc;
        }, {});
        setObjectData(objectMap);
      })
      .catch((error) => {
        console.error("Error fetching object data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://67bc973ced4861e07b3b2ccc.mockapi.io/Worker")
      .then((response) => {
        const priceMap = response.data.reduce((acc, worker) => {
          acc[worker.id] = worker.price;
          return acc;
        }, {});
        setPriceData(priceMap);
      })
      .catch((error) => {
        console.error("Error fetching price data:", error);
      });
  }, []);

  const handleWorkerClick = (workerId) => {
    setSelectedWorker(workerId);
    setPaymentAmount("");
    setSelectedObject("");
  };

  const calculateTotalSalaryPerObject = (workerId) => {
    return data
      .filter((item) => item.ishchilar.includes(workerId))
      .reduce((acc, item) => {
        const objectName = objectData[item.obyekt]?.name || "Noma'lum";
        const workerSalary = parseInt(priceData[item.ishTuri]) || 0;
        acc[objectName] = (acc[objectName] || 0) + workerSalary;
        return acc;
      }, {});
  };

  const handleMonthlyPayment = async (workerId) => {
    try {
      if (!paymentAmount || !selectedObject) {
        alert("Iltimos, to'lov summasi va obyektni tanlang");
        return;
      }

      const paymentNum = parseInt(paymentAmount);
      const salaryPerObject = calculateTotalSalaryPerObject(workerId);
      const objectSalary = salaryPerObject[selectedObject] || 0;

      if (paymentNum > objectSalary) {
        alert(`Xatolik: To'lov summasi (${paymentNum} so'm) ${selectedObject} uchun ish haqqidan (${objectSalary} so'm) katta!`);
        return;
      }

      // Prepare payment data
      const paymentData = {
        workerId: workerId,
        workerName: personalData[workerId],
        objectName: selectedObject,
        amount: paymentNum,
        date: new Date().toISOString().split('T')[0],
      };

      // Save payment to oyliklar API first
      await axios.post("https://67bdf7a6321b883e790eaabf.mockapi.io/oyliklar", paymentData);

      // Subtract payment from original data
      let remainingPayment = paymentNum;
      const updatedData = data.map(item => {
        if (item.ishchilar.includes(workerId) && 
            objectData[item.obyekt]?.name === selectedObject && 
            remainingPayment > 0) {
          const currentSalary = parseInt(priceData[item.ishTuri]) || 0;
          
          if (currentSalary <= remainingPayment) {
            // If current salary is less than or equal to remaining payment, remove worker
            remainingPayment -= currentSalary;
            return {
              ...item,
              ishchilar: item.ishchilar.filter(id => id !== workerId)
            };
          } else {
            // If current salary is more than remaining payment, update the price
            const newPriceId = Object.keys(priceData).find(
              key => priceData[key] === (currentSalary - remainingPayment).toString()
            ) || item.ishTuri; // Keep original ishTuri if no exact match
            
            remainingPayment = 0;
            return {
              ...item,
              ishTuri: newPriceId
            };
          }
        }
        return item;
      }).filter(item => item.ishchilar.length > 0);

      // Update the main API with modified data
      for (const item of updatedData) {
        await axios.put(`https://67bc973ced4861e07b3b2ccc.mockapi.io/Calcu/${item.id}`, item);
      }

      // Update deleted items (if any)
      const deletedItems = data.filter(original => 
        !updatedData.some(updated => updated.id === original.id)
      );
      for (const item of deletedItems) {
        await axios.delete(`https://67bc973ced4861e07b3b2ccc.mockapi.io/Calcu/${item.id}`);
      }

      // Update state
      setData(updatedData);
      alert(`${personalData[workerId]} uchun ${selectedObject} dan ${paymentNum} so'm oylik to'landi`);
      setPaymentAmount("");
      setSelectedObject("");

    } catch (error) {
      console.error("Error processing monthly payment:", error);
      alert("Oylik to'lovda xatolik yuz berdi");
    }
  };

  return (
    <div className="money-container">
      <h1 className="money-title">Money Data</h1>
      <div className="worker-buttons">
        {Object.entries(personalData).map(([id, name]) => (
          <button key={id} className="worker-btn" onClick={() => handleWorkerClick(id)}>
            {name}
          </button>
        ))}
      </div>
      {selectedWorker && (
        <div className="modal">
          <div className="modal-content">
            <h2>{personalData[selectedWorker]}</h2>
            <table className="worker-table" style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid black" }}>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Obyekt</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Ish haqqi</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Sana</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((item) => item.ishchilar.includes(selectedWorker))
                  .map((item) => (
                    <tr key={item.id}>
                      <td style={{ border: "1px solid black", padding: "8px" }}>
                        {objectData[item.obyekt]?.name || "Noma'lum"}
                      </td>
                      <td style={{ border: "1px solid black", padding: "8px" }}>
                        {priceData[item.ishTuri] || "Noma'lum"} so‘m
                      </td>
                      <td style={{ border: "1px solid black", padding: "8px" }}>
                        {item.sana || "Noma'lum"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <br />
            <div className="salary-per-object">
              <h3>Obyektlar bo'yicha:</h3>
              <table className="object-salary-table" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid black" }}>
                    <th style={{ border: "1px solid black", padding: "8px" }}>Obyekt</th>
                    <th style={{ border: "1px solid black", padding: "8px" }}>Jami ish haqi</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(calculateTotalSalaryPerObject(selectedWorker)).map(([object, totalSalary]) => (
                    <tr key={object}>
                      <td style={{ border: "1px solid black", padding: "8px" }}>{object}</td>
                      <td style={{ border: "1px solid black", padding: "8px" }}>{totalSalary} so‘m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <br />
            <div className="payment-section" style={{ marginBottom: "15px" }}>
              <select 
                value={selectedObject} 
                onChange={(e) => setSelectedObject(e.target.value)}
                style={{ padding: "5px", marginRight: "10px" }}
              >
                <option value="">Obyekt tanlang</option>
                {Object.keys(calculateTotalSalaryPerObject(selectedWorker)).map((obj) => (
                  <option key={obj} value={obj}>{obj}</option>
                ))}
              </select>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="To'lov summasi (so'm)"
                style={{ padding: "5px", marginRight: "10px" }}
              />
              <button 
                className="payment-btn" 
                onClick={() => handleMonthlyPayment(selectedWorker)}
                style={{ backgroundColor: "#4CAF50", color: "white", padding: "5px 10px" }}
              >
                Oylik to'lash
              </button>
            </div>
            <p className="total-salary">
              Jami ish haqi:{" "}
              {data
                .filter((item) => item.ishchilar.includes(selectedWorker))
                .reduce((sum, item) => sum + (parseInt(priceData[item.ishTuri]) || 0), 0)} so‘m
            </p>
            <button 
              className="close-btn" 
              onClick={() => setSelectedWorker(null)}
            >
              Yopish
            </button>
          </div>
        </div>
      )}
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="money-grid">
          {data.map((item) => (
            <div key={item.id} className="money-card">
              <p className="money-name">{objectData[item.obyekt]?.name || "Noma'lum"}</p>
              <p className="money-amount">
                {typeof item.amount === "object"
                  ? `Narx: $${item.amount.price || "Noma'lum"}`
                  : item.amount}
              </p>
              <p className="money-workers">
                Ishchilar: {Array.isArray(item.ishchilar)
                  ? item.ishchilar.map((id) => personalData[id] || "Noma'lum").join(", ")
                  : "Yo'q"}
              </p>
              <p className="money-price">Ish haqqi: {priceData[item.ishTuri] || "Noma'lum"}</p>
              <p className="money-date">Sana: {item.sana || "Noma'lum"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Money;