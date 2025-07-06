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

    try {
      const res = await bookAPI.patch(`/books/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBook(res.data);
      setEditMode(false);
    } catch {
      alert("Erro ao salvar alterações");
    }
  };

  if (!book) return <p>Carregando...</p>;

  return (
    <div>
      <h2>{book.title}</h2>
      {book.coverImage && <img src={book.coverImage} alt="Capa" style={{ width: "150px" }} />}
      <p>
        <strong>Autor:</strong> {book.author}
      </p>
      <p>
        <strong>Gênero:</strong> {book.genre}
      </p>
      <p>
        <strong>Publicado em:</strong> {book.publishedDate || "—"}
      </p>
      <p>
        <strong>Adicionado em:</strong> {new Date(book.createdAt).toLocaleDateString()}
      </p>
      <p>
        <strong>Descrição:</strong> {book.description}
      </p>

      {!editMode ? (
        <div>
          <p>
            <strong>Nota:</strong> {book.rating ?? "—"}
          </p>
          <p>
            <strong>Progresso:</strong> {book.progress ?? "—"}%
          </p>
          <p>
            <strong>Início da leitura:</strong> {book.startedAt ? new Date(book.startedAt).toLocaleDateString() : "—"}
          </p>
          <p>
            <strong>Conclusão:</strong> {book.finishedAt ? new Date(book.finishedAt).toLocaleDateString() : "—"}
          </p>
          <p>
            <strong>Review:</strong> {book.review || "—"}
          </p>
          <button onClick={() => setEditMode(true)}>Editar</button>
        </div>
      ) : (
        <div>
          <label>Nota (0 a 10):</label>
          <input type="number" name="rating" value={form.rating} onChange={handleChange} min={0} max={10} />
          <br />
          <label>Progresso (%):</label>
          <input type="number" name="progress" value={form.progress} onChange={handleChange} min={0} max={100} />
          <br />
          <label>Início da leitura:</label>
          <input type="date" name="startedAt" value={form.startedAt} onChange={handleChange} />
          <br />
          <label>Conclusão:</label>
          <input type="date" name="finishedAt" value={form.finishedAt} onChange={handleChange} />
          <br />
          <label>Review:</label>
          <br />
          <textarea name="review" value={form.review} onChange={handleChange} rows={4} />
          <br />
          <button onClick={handleSave}>Salvar</button>
          <button onClick={() => setEditMode(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}
