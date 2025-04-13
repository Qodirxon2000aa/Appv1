import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUserCheck,
  FaMapMarkerAlt,
  FaTools,
  FaCalendarAlt,
  FaPaperPlane,
} from "react-icons/fa";
import "./order.css";

const Order = () => {
  const [ishchilar, setIshchilar] = useState([]);
  const [obyektlar, setObyektlar] = useState([]);
  const [ishTurlari, setIshTurlari] = useState([]);

  const [selectedIshchilar, setSelectedIshchilar] = useState([]);
  const [selectedObyekt, setSelectedObyekt] = useState("");
  const [selectedIshTuri, setSelectedIshTuri] = useState("");
  const [sana, setSana] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://mexnatkashback.vercel.app/api/v1/workers")
      .then((res) => setIshchilar(res.data))
      .catch((err) => console.error("Ishchilarni yuklashda xatolik", err));

    axios
      .get("https://mexnatkashback.vercel.app/api/v1/workplaces")
      .then((res) => setObyektlar(res.data))
      .catch((err) => console.error("Obyektlarni yuklashda xatolik", err));

    axios
      .get("https://mexnatkashback.vercel.app/api/v1/worktypes")
      .then((res) => setIshTurlari(res.data))
      .catch((err) => console.error("Ish turlarini yuklashda xatolik", err));
  }, []);

  const handleIshchiChange = (id) => {
    setSelectedIshchilar((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const sendOrder = () => {
    if (!selectedIshchilar.length || !selectedObyekt || !selectedIshTuri || !sana) {
      alert("Barcha maydonlarni to'ldiring!");
      return;
    }

    const tanlanganIshchilar = ishchilar
      .filter((ishchi) => selectedIshchilar.includes(ishchi._id))
      .map((ishchi) => ({ _id: ishchi._id, name: ishchi.name }));

    const obyektObj = obyektlar.find((obj) => obj._id === selectedObyekt);
    const ishTuriObj = ishTurlari.find((tur) => tur._id === selectedIshTuri);

    const newOrder = {
      ishchilar: tanlanganIshchilar,
      obyekt: { _id: obyektObj._id, name: obyektObj.name },
      ishTuri: {
        _id: ishTuriObj._id,
        name: ishTuriObj.name,
        price: ishTuriObj.price,
      },
      sana: sana,
    };

    axios
      .post("https://mexnatkashback.vercel.app/api/v1/orders", newOrder, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert("Buyurtma muvaffaqiyatli saqlandi!");
        navigate("/");
      })
      .catch((err) => {
        console.error("Buyurtmani yuborishda xatolik", err);
        alert("Xatolik yuz berdi: " + (err.response?.data?.message || err.message));
      });
  };

  return (
    <div className="order-container">
      <h1>Ishga Yuborish</h1>

      <div className="order-section">
        <h3>
          <FaUserCheck style={{ marginRight: "8px" }} /> Ishchilarni tanlang
        </h3>
        <br />
        {ishchilar.map((ishchi) => (
          <label key={ishchi._id} style={{ marginRight: "15px" }}>
            <input
              type="checkbox"
              value={ishchi._id}
              checked={selectedIshchilar.includes(ishchi._id)}
              onChange={() => handleIshchiChange(ishchi._id)}
            />
            {ishchi.name}
          </label>
        ))}
      </div>

      <div className="order-section">
        <h3>
          <FaMapMarkerAlt style={{ marginRight: "8px" }} /> Obyektni tanlang
        </h3>
        <select
          value={selectedObyekt}
          onChange={(e) => setSelectedObyekt(e.target.value)}
        >
          <option value="">Obyektni tanlang</option>
          {obyektlar.map((obj) => (
            <option key={obj._id} value={obj._id}>
              {obj.name}
            </option>
          ))}
        </select>
      </div>

      <div className="order-section">
        <h3>
          <FaTools style={{ marginRight: "8px" }} /> Ish turini tanlang
        </h3>
        <select
          value={selectedIshTuri}
          onChange={(e) => setSelectedIshTuri(e.target.value)}
        >
          <option value="">Ish turini tanlang</option>
          {ishTurlari.map((tur) => (
            <option key={tur._id} value={tur._id}>
              {tur.name} - {tur.price} so'm
            </option>
          ))}
        </select>
      </div>

      <div className="order-section">
        <h3>
          <FaCalendarAlt style={{ marginRight: "8px" }} /> Sana tanlang
        </h3>
        <input
          type="date"
          value={sana}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSana(e.target.value)}
        />
      </div>

      <button onClick={sendOrder} className="order-btn">
        <FaPaperPlane style={{ marginRight: "8px" }} /> Yuborish
      </button>
    </div>
  );
};

export default Order;
