import { useState, useEffect } from "react";
import axios from "axios";
import "./WorkType.css";

const API_URL = "https://67bc973ced4861e07b3b2ccc.mockapi.io/Worker";

const WorkType = () => {
  const [workTypes, setWorkTypes] = useState([]);
  const [newWorkType, setNewWorkType] = useState({ name: "", price: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axios.get(API_URL)
      .then((response) => setWorkTypes(response.data))
      .catch((error) => console.error("Ma'lumotlarni olishda xatolik:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewWorkType((prev) => ({ ...prev, [name]: value }));
  };

  const addWorkType = () => {
    if (!newWorkType.name || !newWorkType.price) return;

    if (editingId) {
      axios.put(`${API_URL}/${editingId}`, newWorkType)
        .then(() => {
          setWorkTypes(workTypes.map(i => i.id === editingId ? { ...i, ...newWorkType } : i));
          setEditingId(null);
        });
    } else {
      axios.post(API_URL, newWorkType)
        .then((response) => setWorkTypes([...workTypes, response.data]));
    }
    setNewWorkType({ name: "", price: "" });
  };

  const deleteWorkType = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => setWorkTypes(workTypes.filter(i => i.id !== id)));
  };

  const editWorkType = (id) => {
    const workType = workTypes.find(i => i.id === id);
    setNewWorkType(workType);
    setEditingId(id);
  };

  return (
    <div className="worktype-container">
      <h1 className="worktype-title">Ish Turlari</h1>

      <div className="worktype-form">
        <input type="text" name="name" placeholder="Ish turi" value={newWorkType.name} onChange={handleChange} />
        <input type="text" name="price" placeholder="Kunlik ish haqi (UZS)" value={newWorkType.price} onChange={handleChange} />
        <button onClick={addWorkType} className="add-btn">
          {editingId ? "Tahrirlash" : "Qo‘shish"}
        </button>
      </div>

      <table className="worktype-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Ish turi</th>
            <th>Kunlik ish haqi</th>
            <th>Amallar</th>
          </tr>
        </thead>
        <tbody>
          {workTypes.map((workType, index) => (
            <tr key={workType.id}>
              <td>{index + 1}</td>
              <td>{workType.name}</td>
              <td>{workType.price} UZS</td>
              <td>
                <button className="edit-btn" onClick={() => editWorkType(workType.id)}>✏️</button>
                <button className="delete-btn" onClick={() => deleteWorkType(workType.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkType;
