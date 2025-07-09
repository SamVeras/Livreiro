import { useState } from "react";
import { bookAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ManualBookEntry() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    coverImage: "",
    publishedDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Título é obrigatório";
    if (!form.author.trim()) newErrors.author = "Autor é obrigatório";
    if (!form.genre.trim()) newErrors.genre = "Gênero é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await bookAPI.post("/books", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/my-books");
    } catch (err) {
      alert("Erro ao adicionar livro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Título do Livro *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className={`input-field${errors.title ? " border-red-400" : ""}`}
                placeholder="Ex: O Senhor dos Anéis"
                required
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Autor *</label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                className={`input-field${errors.author ? " border-red-400" : ""}`}
                placeholder="Ex: J.R.R. Tolkien"
                required
              />
              {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Gênero *</label>
              <input
                type="text"
                name="genre"
                value={form.genre}
                onChange={handleChange}
                className={`input-field${errors.genre ? " border-red-400" : ""}`}
                placeholder="Ex: Fantasia, Ficção Científica"
                required
              />
              {errors.genre && <p className="text-red-500 text-xs mt-1">{errors.genre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Data de Publicação</label>
              <input
                type="text"
                name="publishedDate"
                value={form.publishedDate}
                onChange={handleChange}
                className="input-field"
                placeholder="Ex: 1954, 2023"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Descrição</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input-field"
              rows={4}
              placeholder="Sinopse ou descrição do livro..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">URL da Capa</label>
            <input
              type="url"
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              className="input-field"
              placeholder="https://exemplo.com/capa.jpg"
            />
            {form.coverImage && (
              <div className="mt-2">
                <img
                  src={form.coverImage}
                  alt="Pré-visualização da capa"
                  className="h-32 rounded shadow border border-secondary-200 mx-auto"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Adicionando...
                </div>
              ) : (
                "Adicionar Livro"
              )}
            </button>
            <button type="button" onClick={() => navigate("/my-books")} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
