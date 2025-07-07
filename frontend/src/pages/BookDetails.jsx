import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function BookDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    rating: "",
    progress: "",
    review: "",
    startedAt: "",
    finishedAt: "",
  });

  useEffect(() => {
    bookAPI
      .get(`/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBook(res.data);
        setForm({
          rating: res.data.rating ?? "",
          progress: res.data.progress ?? "",
          review: res.data.review || "",
          startedAt: res.data.startedAt ? res.data.startedAt.slice(0, 10) : "",
          finishedAt: res.data.finishedAt ? res.data.finishedAt.slice(0, 10) : "",
        });
      })
      .catch(() => {
        alert("Livro não encontrado ou acesso negado.");
        navigate("/my-books");
      });
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const rating = parseFloat(form.rating);
    const progress = parseFloat(form.progress);
    if (
      (form.rating && (isNaN(rating) || rating < 0 || rating > 10)) ||
      (form.progress && (isNaN(progress) || progress < 0 || progress > 100))
    ) {
      alert("Nota deve estar entre 0 e 10. Progresso entre 0 e 100.");
      return;
    }

    const cleanedForm = { ...form };
    if (!cleanedForm.startedAt) delete cleanedForm.startedAt;
    if (!cleanedForm.finishedAt) delete cleanedForm.finishedAt;

    try {
      const res = await bookAPI.patch(`/books/${id}`, cleanedForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBook(res.data);
      setEditMode(false);
    } catch {
      alert("Erro ao salvar alterações");
    }
  };

  if (!book) return <p className="p-4">Carregando...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
        {/* Informações principais */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
          <p className="text-gray-700">
            <strong>Autor:</strong> {book.author}
          </p>
          <p className="text-gray-700">
            <strong>Gênero:</strong> {book.genre}
          </p>
          <p className="text-gray-700">
            <strong>Publicado em:</strong> {book.publishedDate || "—"}
          </p>
          <p className="text-gray-700">
            <strong>Adicionado em:</strong> {new Date(book.createdAt).toLocaleDateString()}
          </p>

          <div className="mt-4">
            <p className="font-semibold">Descrição:</p>
            <p className="text-sm text-gray-800 mt-1 whitespace-pre-line">{book.description}</p>
          </div>
        </div>

        {/* Capa */}
        {book.coverImage && (
          <div className="w-full md:w-48 flex-shrink-0">
            <img src={book.coverImage} alt="Capa" className="w-full h-auto rounded shadow border" />
          </div>
        )}
      </div>

      {/* Área separada para avaliação */}
      <div className="bg-white mt-6 p-6 rounded-lg shadow space-y-4">
        {!editMode ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p>
                <strong>Nota:</strong> {book.rating ?? "—"}
              </p>
              <p>
                <strong>Progresso:</strong> {book.progress ?? "—"}%
              </p>
              <p>
                <strong>Início da leitura:</strong>{" "}
                {book.startedAt ? new Date(book.startedAt).toLocaleDateString() : "—"}
              </p>
              <p>
                <strong>Conclusão:</strong> {book.finishedAt ? new Date(book.finishedAt).toLocaleDateString() : "—"}
              </p>
            </div>
            <div>
              <p className="font-semibold">Review:</p>
              <p className="text-sm text-gray-800 whitespace-pre-line">{book.review || "—"}</p>
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Editar
            </button>
          </>
        ) : (
          <div className="space-y-3">
            <label className="block">
              Nota (0 a 10):
              <input
                type="number"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                min={0}
                max={10}
                className="w-full border px-2 py-1 rounded mt-1"
              />
            </label>

            <label className="block">
              Progresso (%):
              <input
                type="number"
                name="progress"
                value={form.progress}
                onChange={handleChange}
                min={0}
                max={100}
                className="w-full border px-2 py-1 rounded mt-1"
              />
            </label>

            <label className="block">
              Início da leitura:
              <input
                type="date"
                name="startedAt"
                value={form.startedAt}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded mt-1"
              />
            </label>

            <label className="block">
              Conclusão:
              <input
                type="date"
                name="finishedAt"
                value={form.finishedAt}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded mt-1"
              />
            </label>

            <label className="block">
              Review:
              <textarea
                name="review"
                value={form.review}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded mt-1"
                rows={4}
              />
            </label>

            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Salvar
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
