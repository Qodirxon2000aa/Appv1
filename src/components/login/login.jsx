import { useState } from "react";
import axios from "../../api/axios"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

const Login = () => {
  const [phonePrefix, setPhonePrefix] = useState("91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const phoneCodes = ["91", "99", "77", "88", "90"];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fullPhoneNumber = `+998${phonePrefix}${phoneNumber}`;
    if (!/^\+998\d{9}$/.test(fullPhoneNumber)) {
      toast.error("Telefon raqam to‘liq va to‘g‘ri formatda bo‘lishi kerak!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/v1/auth/login", {
        phoneNumber: fullPhoneNumber,
        password,
      });

      localStorage.setItem("token", response.data.token);
      toast.success("Muvaffaqiyatli kirildi!");
      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);
    } catch (err) {
      toast.error("Login yoki parol noto‘g‘ri!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Kirish</h2>
      <form onSubmit={handleLogin}>
        <div className="phone-input">
          <span className="country-code">+998</span>
          <select value={phonePrefix} onChange={(e) => setPhonePrefix(e.target.value)}>
            {phoneCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="XXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/, "").slice(0, 7))}
            required
          />
        </div>
        <input
          type="password"
          placeholder="Parol"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Kirish..." : "Kirish"}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
