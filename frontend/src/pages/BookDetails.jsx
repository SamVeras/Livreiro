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
  const [form, setForm] = useState({ rating: "", progress: "", review: "" });

  useEffect(() => {
    bookAPI
      .get(`/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBook(res.data);
        setForm({
          rating: res.data.rating || "",
          progress: res.data.progress || "",
          review: res.data.review || "",
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
      <p>
        <strong>Autor:</strong> {book.author}
      </p>
      <p>
        <strong>Gênero:</strong> {book.genre}
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
