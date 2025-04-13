import { useState, useEffect } from "react";
import axios from "axios";
import "./workers.css";
import { FaSave, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "https://mexnatkashback.vercel.app/api/v1/workers";

const Personal = () => {
  const [ishchilar, setIshchilar] = useState([]);
  const [newIshchi, setNewIshchi] = useState({ name: "", lavozim: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchIshchilar();
  }, []);

  const fetchIshchilar = async () => {
    try {
      const response = await axios.get(API_URL);
      setIshchilar(response.data);
    } catch (error) {
      console.error("Ma'lumotlarni olishda xatolik:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewIshchi((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!newIshchi.name || !newIshchi.lavozim) {
      alert("Iltimos, barcha maydonlarni to‘ldiring!");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, newIshchi);
        setIshchilar(ishchilar.map((i) => (i._id === editingId ? { ...i, ...newIshchi } : i)));
        setEditingId(null);
      } else {
        const response = await axios.post(API_URL, newIshchi);
        setIshchilar([...ishchilar, response.data]);
      }
      setNewIshchi({ name: "", lavozim: "" });
    } catch (error) {
      console.error("Saqlashda xatolik:", error);
    }
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;
    try {
      await axios.delete(`${API_URL}/${_id}`);
      setIshchilar(ishchilar.filter((i) => i._id !== _id));
    } catch (error) {
      console.error("O‘chirishda xatolik:", error);
    }
  };

  const handleEdit = (ishchi) => {
    setNewIshchi({ name: ishchi.name, lavozim: ishchi.lavozim });
    setEditingId(ishchi._id);
  };

  return (
    <div className="workers-container">
      <h1 className="workers-title">Ishchilar Boshqaruvi</h1>

      <div className="workers-form">
        <input
          type="text"
          name="name"
          placeholder="Ism"
          value={newIshchi.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lavozim"
          placeholder="Lavozim"
          value={newIshchi.lavozim}
          onChange={handleChange}
        />
        <button onClick={handleSave} className="add-btn">
          {editingId ? <FaSave style={{ marginRight: "8px" }} /> : <FaPlus style={{ marginRight: "8px" }} />}
          {editingId ? "Saqlash" : "Qo‘shish"}
        </button>
      </div>

      <table className="workers-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Ism</th>
            <th>Lavozim</th>
            <th>Amallar</th>
          </tr>
        </thead>
        <tbody>
          {ishchilar.map((ishchi, index) => (
            <tr key={ishchi._id}>
              <td>{index + 1}</td>
              <td>{ishchi.name}</td>
              <td>{ishchi.lavozim}</td>
              <td>
                <button onClick={() => handleEdit(ishchi)} className="edit-btn">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(ishchi._id)} className="delete-btn">
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

export default Personal;
