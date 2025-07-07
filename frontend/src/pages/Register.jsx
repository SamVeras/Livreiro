import { useState } from "react";
import { authAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.post("/register", form);
      const res = await authAPI.post("/login", {
        email: form.email,
        password: form.password,
      });
      login(res.data.token, res.data.name);
      navigate("/");
    } catch {
      alert("Erro ao registrar ou fazer login.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-8 border rounded shadow bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Criar Conta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Nome:
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
          />
        </label>
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
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
          Registrar
        </button>
      </form>
    </div>
  );
}
