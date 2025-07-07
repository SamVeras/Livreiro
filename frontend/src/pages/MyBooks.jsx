import { useEffect, useState } from "react";
import { bookAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function MyBooks() {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    bookAPI
      .get("/books/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBooks(res.data));
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este livro?")) return;
    await bookAPI.delete(`/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBooks((prev) => prev.filter((b) => b._id !== id));
  };

  return (
    <div className="px-4">
      <h2 className="text-2xl font-bold my-4">Meus Livros</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book) => (
          <div key={book._id} className="border rounded-xl p-4 shadow bg-white hover:shadow-lg transition-all">
            {book.coverImage && (
              <img src={book.coverImage} alt="Capa" className="w-full h-80 object-cover rounded mb-3" />
            )}
            <Link to={`/my-books/${book._id}`}>
              <h3 className="text-lg font-bold mb-1">{book.title}</h3>
            </Link>
            <p className="text-sm text-gray-600 mb-1">{book.author}</p>
            <p className="text-xs text-gray-500 italic">
              {book.genre} | {book.publishedDate || "Data desconhecida"}
            </p>
            <p className="text-sm mt-2 text-gray-700 line-clamp-3">{book.description}</p>
            <div className="flex justify-between items-center mt-4 text-sm">
              <span>⭐ {book.rating ?? "—"}</span>
              <span>📖 {book.progress ?? 0}%</span>
            </div>
            <button
              onClick={() => handleDelete(book._id)}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-1 rounded"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
