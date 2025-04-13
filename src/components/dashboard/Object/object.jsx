import { useState, useEffect } from "react";
import axios from "axios";
import "./object.css";
import { FaSave, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "https://mexnatkashback.vercel.app/api/v1/workplaces";

const Object = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", location: "", price: "" });
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
    if (!newItem.name || !newItem.location || !newItem.price) {
      alert("Iltimos, barcha maydonlarni to‘ldiring!");
      return;
    }

    try {
      if (editingId) {
        await axios.patch(`${API_URL}/${editingId}`, newItem);
        setItems(items.map((o) => (o._id === editingId ? { ...o, ...newItem } : o)));
        setEditingId(null);
      } else {
        const response = await axios.post(API_URL, newItem);
        setItems([...items, response.data]);
      }
      setNewItem({ name: "", location: "", price: "" });
    } catch (error) {
      console.error("Saqlashda xatolik:", error);
    }
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;
    try {
      await axios.delete(`${API_URL}/${_id}`);
      setItems(items.filter((o) => o._id !== _id));
    } catch (error) {
      console.error("O‘chirishda xatolik:", error);
    }
  };

  const handleEdit = (item) => {
    setNewItem({ name: item.name, location: item.location, price: item.price });
    setEditingId(item._id);
  };

  return (
    <div className="container">
      <h1 className="title">Obyektlar</h1>
      <div className="form-container">
        <input
          type="text"
          name="name"
          placeholder="Obyekt nomi"
          value={newItem.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Hudud"
          value={newItem.location}
          onChange={handleChange}
        />
        <input
          type="text"
          name="price"
          placeholder="Mablag‘ (UZS)"
          value={newItem.price}
          onChange={handleChange}
        />
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
            <th>Hudud</th>
            <th>Mablag‘</th>
            <th>Amallar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.location}</td>
              <td>{item.price}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(item)}>
                  <FaEdit />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(item._id)}>
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
