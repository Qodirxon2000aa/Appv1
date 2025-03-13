import { useNavigate } from "react-router-dom";
import "./dash.css"; // Stil faylini import qilish
import { FaBuilding, FaUsers, FaTasks } from "react-icons/fa"; // React Icons

const Dash = () => {
  const navigate = useNavigate();

  return (
    <div className="dash-container">
      <h1 className="dash-title">Boshqaruv Paneli</h1>
      <div className="dash-buttons">
        <button onClick={() => navigate("/dashboard/object")} className="dash-button blue">
          <FaBuilding style={{ marginRight: "8px" }} />
          OBYEKTLAR
        </button>
        <button onClick={() => navigate("/dashboard/personal")} className="dash-button green">
          <FaUsers style={{ marginRight: "8px" }} />
          ISHCHILAR
        </button>
        <button onClick={() => navigate("/dashboard/worktype")} className="dash-button red">
          <FaTasks style={{ marginRight: "8px" }} />
          ISH TURI
        </button>
      </div>
    </div>
  );
};

export default Dash;
