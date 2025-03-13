import { useState, useEffect } from "react";
import axios from "axios";
import "./object.css"; // Styling fayl
import { FaSave, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "https://66a6197023b29e17a1a1ba9a.mockapi.io/Object";

const Object = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", zona: "", mablag: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(API_URL);
      setItems(response.data);
    } catch (error) {
      console.error("Ma'lumotlarni olishda xatolik:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!newItem.name || !newItem.zona || !newItem.mablag) {
      alert("Iltimos, barcha maydonlarni to‘ldiring!");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, newItem);
        setItems(items.map((o) => (o.id === editingId ? { ...o, ...newItem } : o)));
        setEditingId(null);
      } else {
        const response = await axios.post(API_URL, newItem);
        setItems([...items, response.data]);
      }
      setNewItem({ name: "", zona: "", mablag: "" });
    } catch (error) {
      console.error("Saqlashda xatolik:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setItems(items.filter((o) => o.id !== id));
    } catch (error) {
      console.error("O‘chirishda xatolik:", error);
    }
  };

  const handleEdit = (item) => {
    setNewItem({ name: item.name, zona: item.zona, mablag: item.mablag });
    setEditingId(item.id);
  };

  return (
    <div className="container">
      <h1 className="title">Obyektlar</h1>

      <div className="form-container">
        <input type="text" name="name" placeholder="Obyekt nomi" value={newItem.name} onChange={handleChange} />
        <input type="text" name="zona" placeholder="Ish zonasi" value={newItem.zona} onChange={handleChange} />
        <input type="text" name="mablag" placeholder="Mablag‘ (UZS) yoki 'Olinmagan'" value={newItem.mablag} onChange={handleChange} />
        
        <button onClick={handleSave} className="save-btn">
          {editingId ? <FaSave style={{ marginRight: "8px" }} /> : <FaPlus style={{ marginRight: "8px" }} />} 
          {editingId ? "Saqlash" : "Qo‘shish"}
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Obyekt</th>
            <th>Zona</th>
            <th>Mablag‘</th>
            <th>Amallar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.zona}</td>
              <td>{item.mablag}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(item)}>
                  <FaEdit />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>
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

export default Object;
