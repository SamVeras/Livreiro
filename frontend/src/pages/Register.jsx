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

      // login automático após registro
      const res = await authAPI.post("/login", {
        email: form.email,
        password: form.password,
      });

      login(res.data.token, res.data.name);
      navigate("/");
    } catch (err) {
      alert("Erro ao registrar ou fazer login.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="password" type="password" placeholder="Senha" value={form.password} onChange={handleChange} />
      <button type="submit">Registrar</button>
    </form>
  );
}
