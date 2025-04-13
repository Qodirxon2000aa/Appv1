import { useState, useEffect } from "react";
import axios from "axios";
import "./WorkType.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "https://mexnatkashback.vercel.app/api/v1/worktypes";

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
        .then((res) => {
          setWorkTypes(workTypes.map(i => i._id === editingId ? res.data : i));
          setEditingId(null);
        })
        .catch((err) => console.error("Tahrirlashda xatolik:", err));
    } else {
      axios.post(API_URL, newWorkType)
        .then((response) => setWorkTypes([...workTypes, response.data]))
        .catch((err) => console.error("Qo‘shishda xatolik:", err));
    }
    setNewWorkType({ name: "", price: "" });
  };

  const deleteWorkType = (_id) => {
    if (!window.confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;

    axios.delete(`${API_URL}/${_id}`)
      .then(() => setWorkTypes(workTypes.filter(i => i._id !== _id)))
      .catch((err) => console.error("O‘chirishda xatolik:", err));
  };

  const editWorkType = (_id) => {
    const workType = workTypes.find(i => i._id === _id);
    if (workType) {
      setNewWorkType({ name: workType.name, price: workType.price });
      setEditingId(_id);
    }
  };

  return (
    <div className="worktype-container">
      <h1 className="worktype-title">Ish Turlari</h1>

      <div className="worktype-form">
        <input type="text" name="name" placeholder="Ish turi" value={newWorkType.name} onChange={handleChange} />
        <input type="text" name="price" placeholder="Kunlik ish haqi (UZS)" value={newWorkType.price} onChange={handleChange} />
        <button onClick={addWorkType} className="add-btn">
          {editingId ? <FaEdit style={{ marginRight: "8px" }} /> : <FaPlus style={{ marginRight: "8px" }} />}
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
            <tr key={workType._id}>
              <td>{index + 1}</td>
              <td>{workType.name}</td>
              <td>{workType.price} UZS</td>
              <td>
                <button className="edit-btn" onClick={() => editWorkType(workType._id)}>
                  <FaEdit />
                </button>
                <button className="delete-btn" onClick={() => deleteWorkType(workType._id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkType;
