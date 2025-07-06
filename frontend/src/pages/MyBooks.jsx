import { useEffect, useState } from "react";
import { bookAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const { token } = useAuth();

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja remover este livro?")) return;
    try {
      await bookAPI.delete(`/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks((prev) => prev.filter((book) => book._id !== id));
    } catch {
      alert("Erro ao remover livro");
    }
  };

  useEffect(() => {
    bookAPI
      .get("/books/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBooks(res.data));
  }, []);

  return (
    <div>
      <h2>Meus Livros</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {books.map((book) => (
          <div
            key={book._id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              width: "220px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            {book.coverImage && (
              <img src={book.coverImage} alt="Capa" style={{ width: "100%", height: "auto", marginBottom: "0.5rem" }} />
            )}
            <Link to={`/my-books/${book._id}`}>
              <strong>{book.title}</strong>
            </Link>
            <p style={{ margin: "0.25rem 0" }}>{book.author}</p>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              {book.description?.substring(0, 100) || "Sem descrição"}...
            </p>
            <p style={{ fontSize: "0.85rem" }}>
              <strong>Nota:</strong> {book.rating ?? "—"} | <strong>Progresso:</strong> {book.progress ?? 0}%
            </p>
            <button onClick={() => handleDelete(book._id)}>Remover</button>
          </div>
        ))}
      </div>
    </div>
  );
}
