import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.post("/login", form);
      login(res.data.token, res.data.name);
      navigate("/");
    } catch {
      alert("Credenciais inválidas.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-8 border rounded shadow bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Email:
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
          />
        </label>
        <label className="block">
          Senha:
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
          />
        </label>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  );
}
