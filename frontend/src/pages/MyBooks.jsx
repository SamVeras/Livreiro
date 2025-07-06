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
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            <Link to={`/my-books/${book._id}`}>
              <strong>{book.title}</strong>
            </Link>{" "}
            — {book.author} ({book.genre})<p>{book.description}</p>
            <button onClick={() => handleDelete(book._id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
