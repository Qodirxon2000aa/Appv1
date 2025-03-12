import { useState, useEffect } from "react";
import axios from "axios";
import "./workers.css";

const API_URL = "https://66a6197023b29e17a1a1ba9a.mockapi.io/Personal";

const Personal = () => {
  const [ishchilar, setIshchilar] = useState([]);
  const [newIshchi, setNewIshchi] = useState({ name: "", lavozim: "" });
  const [editingId, setEditingId] = useState(null);

  // Ma'lumotlarni olish
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

  // Inputlarni boshqarish
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewIshchi((prev) => ({ ...prev, [name]: value }));
  };

  // Ishchini qo'shish yoki tahrirlash
  const handleSave = async () => {
    if (!newIshchi.name || !newIshchi.lavozim) {
      alert("Iltimos, barcha maydonlarni to‘ldiring!");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, newIshchi);
        setIshchilar(ishchilar.map((i) => (i.id === editingId ? { ...i, ...newIshchi } : i)));
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

  // Ishchini o‘chirish
  const handleDelete = async (id) => {
    if (!window.confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setIshchilar(ishchilar.filter((i) => i.id !== id));
    } catch (error) {
      console.error("O‘chirishda xatolik:", error);
    }
  };

  // Tahrirlash rejimi
  const handleEdit = (ishchi) => {
    setNewIshchi({ name: ishchi.name, lavozim: ishchi.lavozim });
    setEditingId(ishchi.id);
  };

  return (
    <div className="workers-container">
      <h1 className="workers-title">Ishchilar Boshqaruvi</h1>

      <div className="workers-form">
        <input type="text" name="name" placeholder="Ism" value={newIshchi.name} onChange={handleChange} />
        <input type="text" name="lavozim" placeholder="Lavozim" value={newIshchi.lavozim} onChange={handleChange} />
        <button onClick={handleSave} className="add-btn">
          {editingId ? "💾 Saqlash" : "➕ Qo‘shish"}
        </button>
      </div>

      {/* Ishchilar ro‘yxati jadvali */}
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
            <tr key={ishchi.id}>
              <td>{index + 1}</td>
              <td>{ishchi.name}</td>
              <td>{ishchi.lavozim}</td>
              <td>
                <button onClick={() => handleEdit(ishchi)} className="edit-btn">✏️</button>
                <br />
                <button onClick={() => handleDelete(ishchi.id)} className="delete-btn">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Personal;
