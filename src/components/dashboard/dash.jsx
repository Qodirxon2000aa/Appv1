import { useNavigate } from "react-router-dom";
import "./dash.css"; // Stil faylini import qilish

const Dash = () => {
  const navigate = useNavigate();

  return (
    <div className="dash-container">
      <h1 className="dash-title">Boshqaruv Paneli</h1>
      <div className="dash-buttons">
        <button onClick={() => navigate("/dashboard/object")} className="dash-button blue">
          OBYEKTLAR
        </button>
        <button onClick={() => navigate("/dashboard/personal")} className="dash-button green">
          ISHCHILAR
        </button>
        <button onClick={() => navigate("/dashboard/worktype")} className="dash-button red">
          ISH TURI
        </button>
      </div>
    </div>
  );
};

export default Dash;
