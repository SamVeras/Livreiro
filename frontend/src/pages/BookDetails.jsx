import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

function formatDateBR(date) {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR");
}

function validateRating(rating) {
  if (rating === "") return null;
  const val = parseFloat(rating);
  if (isNaN(val) || val < 0 || val > 10) return "Nota deve estar entre 0 e 10.";
  return null;
}
function validateProgress(progress) {
  if (progress === "") return null;
  const val = parseFloat(progress);
  if (isNaN(val) || val < 0 || val > 100) return "Progresso deve estar entre 0 e 100.";
  return null;
}
function validateDateOrder(startedAt, finishedAt) {
  if (startedAt && finishedAt) {
    const s = new Date(startedAt);
    const f = new Date(finishedAt);
    if (f < s) return "Conclusão não pode ser antes do início.";
  }
  return null;
}
function validateReview(review) {
  if (review && review.length > 2000) return "Resenha muito longa (máx. 2000 caracteres).";
  return null;
}

export default function BookDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    publishedDate: "",
    rating: "",
    progress: "",
    review: "",
    startedAt: "",
    finishedAt: "",
    coverImage: "",
  });
  const [errors, setErrors] = useState({});
  const [originalCoverImage, setOriginalCoverImage] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalAuthor, setOriginalAuthor] = useState("");
  const [originalGenre, setOriginalGenre] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [originalPublishedDate, setOriginalPublishedDate] = useState("");

  useEffect(() => {
    bookAPI
      .get(`/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBook(res.data);
        setForm({
          title: res.data.title || "",
          author: res.data.author || "",
          genre: res.data.genre || "",
          description: res.data.description || "",
          publishedDate: res.data.publishedDate || "",
          rating: res.data.rating ?? "",
          progress: res.data.progress ?? "",
          review: res.data.review || "",
          startedAt: res.data.startedAt ? res.data.startedAt.slice(0, 10) : "",
          finishedAt: res.data.finishedAt ? res.data.finishedAt.slice(0, 10) : "",
          coverImage: res.data.coverImage || "",
        });
        setOriginalCoverImage(res.data.originalCoverImage || res.data.coverImage || "");
        setOriginalTitle(res.data.originalTitle || res.data.title || "");
        setOriginalAuthor(res.data.originalAuthor || res.data.author || "");
        setOriginalGenre(res.data.originalGenre || res.data.genre || "");
        setOriginalDescription(res.data.originalDescription || res.data.description || "");
        setOriginalPublishedDate(res.data.originalPublishedDate || res.data.publishedDate || "");
        setLoading(false);
      })
      .catch(() => {
        alert("Livro não encontrado ou acesso negado.");
        navigate("/my-books");
      });
  }, [id, token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined, dateOrder: undefined });
  };

  const handleResetCover = () => {
    setForm((prev) => ({ ...prev, coverImage: originalCoverImage }));
  };

  const handleResetTitle = () => {
    setForm((prev) => ({ ...prev, title: originalTitle }));
  };

  const handleResetAuthor = () => {
    setForm((prev) => ({ ...prev, author: originalAuthor }));
  };

  const handleResetGenre = () => {
    setForm((prev) => ({ ...prev, genre: originalGenre }));
  };

  const handleResetDescription = () => {
    setForm((prev) => ({ ...prev, description: originalDescription }));
  };

  const handleResetPublishedDate = () => {
    setForm((prev) => ({ ...prev, publishedDate: originalPublishedDate }));
  };

  const validateAll = () => {
    const newErrors = {
      rating: validateRating(form.rating),
      progress: validateProgress(form.progress),
      dateOrder: validateDateOrder(form.startedAt, form.finishedAt),
      review: validateReview(form.review),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSave = async () => {
    if (!validateAll()) return;
    setSaving(true);
    const cleanedForm = { ...form };
    if (!cleanedForm.startedAt) delete cleanedForm.startedAt;
    if (!cleanedForm.finishedAt) delete cleanedForm.finishedAt;
    if (!cleanedForm.coverImage) cleanedForm.coverImage = "";
    try {
      const res = await bookAPI.patch(`/books/${id}`, cleanedForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBook(res.data);
      setEditMode(false);
    } catch {
      alert("Erro ao salvar alterações");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600">Carregando livro...</p>
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="space-y-8">
      <div className="card p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80 flex-shrink-0">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={`Capa de ${book.title}`}
                className="w-full h-auto rounded-lg shadow-material-lg"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-full h-96 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg flex items-center justify-center ${
                book.coverImage ? "hidden" : ""
              }`}
            >
              <span className="text-8xl text-secondary-400">📚</span>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl font-display font-bold mb-4 text-gradient">{book.title}</h1>
              <p className="text-xl text-secondary-600 font-medium mb-2">por {book.author}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600">📖</span>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Gênero</p>
                  <p className="font-medium text-secondary-800">{book.genre}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <span className="text-accent-600">📅</span>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Publicado em</p>
                  <p className="font-medium text-secondary-800">
                    {book.publishedDate ? formatDateBR(book.publishedDate) : "Data desconhecida"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <span className="text-secondary-600">📚</span>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Adicionado em</p>
                  <p className="font-medium text-secondary-800">{formatDateBR(book.createdAt)}</p>
                </div>
              </div>
            </div>

            {book.description && (
              <div>
                <h3 className="text-lg font-semibold text-secondary-800 mb-3">Sinopse</h3>
                <p className="text-secondary-600 leading-relaxed whitespace-pre-line">{book.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-semibold text-secondary-800">Minha Leitura</h2>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="btn-primary">
              ✏️ Editar
            </button>
          )}
        </div>

        {!editMode ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {book.rating ? `${book.rating}/10` : "—"}
                </div>
                <p className="text-sm text-secondary-600">Avaliação</p>
              </div>

              <div className="text-center p-4 bg-accent-50 rounded-lg">
                <div className="text-2xl font-bold text-accent-600 mb-1">
                  {book.progress ? `${book.progress}%` : "0%"}
                </div>
                <p className="text-sm text-secondary-600">Progresso</p>
              </div>

              <div className="text-center p-4 bg-secondary-50 rounded-lg">
                <div className="text-2xl font-bold text-secondary-600 mb-1">
                  {book.startedAt ? formatDateBR(book.startedAt) : "—"}
                </div>
                <p className="text-sm text-secondary-600">Início da leitura</p>
              </div>

              <div className="text-center p-4 bg-secondary-50 rounded-lg">
                <div className="text-2xl font-bold text-secondary-600 mb-1">
                  {book.finishedAt ? formatDateBR(book.finishedAt) : "—"}
                </div>
                <p className="text-sm text-secondary-600">Conclusão</p>
              </div>
            </div>

            {book.progress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-secondary-600">
                  <span>Progresso da leitura</span>
                  <span>{book.progress}%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${book.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {book.review && (
              <div>
                <h3 className="text-lg font-semibold text-secondary-800 mb-3">Minha Resenha</h3>
                <div className="bg-secondary-50 p-4 rounded-lg">
                  <p className="text-secondary-700 whitespace-pre-line leading-relaxed">{book.review}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Título</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="input-field flex-1"
                    placeholder="Título do livro"
                    autoComplete="off"
                  />
                  <button type="button" onClick={handleResetTitle} className="btn-secondary px-3 py-2 text-xs">
                    Restaurar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Autor</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    className="input-field flex-1"
                    placeholder="Nome do autor"
                    autoComplete="off"
                  />
                  <button type="button" onClick={handleResetAuthor} className="btn-secondary px-3 py-2 text-xs">
                    Restaurar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Gênero</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    name="genre"
                    value={form.genre}
                    onChange={handleChange}
                    className="input-field flex-1"
                    placeholder="Gênero literário"
                    autoComplete="off"
                  />
                  <button type="button" onClick={handleResetGenre} className="btn-secondary px-3 py-2 text-xs">
                    Restaurar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Descrição</label>
                <div className="flex gap-2 items-center">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="input-field flex-1"
                    placeholder="Descrição detalhada do livro"
                    rows={3}
                  />
                  <button type="button" onClick={handleResetDescription} className="btn-secondary px-3 py-2 text-xs">
                    Restaurar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Publicado em</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    name="publishedDate"
                    value={form.publishedDate}
                    onChange={handleChange}
                    className="input-field"
                  />
                  <button type="button" onClick={handleResetPublishedDate} className="btn-secondary px-3 py-2 text-xs">
                    Restaurar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Avaliação (0 a 10)</label>
                <input
                  type="number"
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  min={0}
                  max={10}
                  step={0.1}
                  className={`input-field${errors.rating ? " border-red-400" : ""}`}
                  placeholder="Ex: 8.5"
                />
                {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Progresso (%)</label>
                <input
                  type="number"
                  name="progress"
                  value={form.progress}
                  onChange={handleChange}
                  min={0}
                  max={100}
                  className={`input-field${errors.progress ? " border-red-400" : ""}`}
                  placeholder="Ex: 75"
                />
                {errors.progress && <p className="text-red-500 text-xs mt-1">{errors.progress}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Início da leitura</label>
                <input
                  type="date"
                  name="startedAt"
                  value={form.startedAt}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Conclusão</label>
                <input
                  type="date"
                  name="finishedAt"
                  value={form.finishedAt}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">URL da Capa do Livro</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    name="coverImage"
                    value={form.coverImage}
                    onChange={handleChange}
                    className="input-field flex-1"
                    placeholder="Cole o link da imagem da capa"
                    autoComplete="off"
                  />
                  <button type="button" onClick={handleResetCover} className="btn-secondary px-3 py-2 text-xs">
                    Restaurar padrão
                  </button>
                </div>
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
            </div>
            {errors.dateOrder && <p className="text-red-500 text-xs mt-1 text-center">{errors.dateOrder}</p>}

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Resenha</label>
              <textarea
                name="review"
                value={form.review}
                onChange={handleChange}
                className={`input-field${errors.review ? " border-red-400" : ""}`}
                rows={6}
                placeholder="Compartilhe suas impressões sobre o livro..."
              />
              {errors.review && <p className="text-red-500 text-xs mt-1">{errors.review}</p>}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Salvando...
                  </div>
                ) : (
                  "Salvar Alterações"
                )}
              </button>
              <button onClick={() => setEditMode(false)} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
