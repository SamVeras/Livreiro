import { useState } from "react";
import { authAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function validateName(name) {
  if (!name.trim()) return "Nome é obrigatório.";
  if (!/^[A-Za-zÀ-ÿ ']{2,}$/.test(name.trim()))
    return "Nome deve ter pelo menos 2 letras e conter apenas letras e espaços.";
  return null;
}
function validateEmail(email) {
  if (!email.trim()) return "Email é obrigatório.";
  if (!/^[\w-.]+@[\w-]+\.[\w-.]+$/.test(email.trim())) return "Formato de email inválido.";
  return null;
}
function validatePassword(password) {
  if (!password) return "Senha é obrigatória.";
  if (password.length < 8) return "Senha deve ter pelo menos 8 caracteres.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Senha deve conter letras e números.";
  return null;
}

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setServerError("");
  };

  const validateAll = () => {
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validateAll()) return;
    setLoading(true);
    try {
      await authAPI.post("/register", form);
      const res = await authAPI.post("/login", {
        email: form.email,
        password: form.password,
      });
      login(res.data.token, res.data.name);
      navigate("/");
    } catch (err) {
      let msg = "Erro ao registrar ou fazer login.";
      if (err?.response?.data?.error) {
        if (err.response.data.error.includes("duplicate")) {
          msg = "Email já cadastrado.";
        } else if (err.response.data.error.includes("email")) {
          msg = "Formato de email inválido.";
        } else if (err.response.data.error.includes("password")) {
          msg = "Senha inválida.";
        } else {
          msg = err.response.data.error;
        }
      }
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-material-lg">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-3xl font-display font-bold mb-2 text-gradient">Criar Conta</h1>
        </div>

        {/* Register Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Nome Completo</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={`input-field${errors.name ? " border-red-400" : ""}`}
                placeholder="Seu nome completo"
                autoComplete="name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className={`input-field${errors.email ? " border-red-400" : ""}`}
                placeholder="seu@email.com"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Senha</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className={`input-field${errors.password ? " border-red-400" : ""}`}
                placeholder="Crie uma senha segura"
                autoComplete="new-password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {serverError && <div className="text-red-600 text-sm text-center">{serverError}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Criando conta...
                </div>
              ) : (
                "Criar Conta"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-secondary-500">ou</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-secondary-600">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-accent-600 hover:text-accent-700 font-medium">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
