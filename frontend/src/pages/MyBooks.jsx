import { useEffect, useState } from "react";
import { bookAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function MyBooks() {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookAPI
      .get("/books/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este livro?")) return;
    await bookAPI.delete(`/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBooks((prev) => prev.filter((b) => b._id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600">Carregando sua biblioteca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient">Minha Biblioteca</h1>
        <p className="text-xl text-secondary-600">
          {books.length === 0
            ? "Sua biblioteca está vazia. Adicione seu primeiro livro!"
            : `${books.length} livro${books.length !== 1 ? "s" : ""} em sua coleção`}
        </p>
      </div>
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book._id} className="card group transition-all duration-300 overflow-hidden">
              <div className="relative">
                <Link to={`/my-books/${book._id}`}>
                  {" "}
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={`Capa de ${book.title}`}
                      className="w-full h-80 object-cover group-hover:brightness-110 transition-all duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-80 bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center ${
                      book.coverImage ? "hidden" : ""
                    }`}
                  >
                    <span className="text-6xl text-secondary-400">📚</span>
                  </div>
                </Link>
                {book.progress && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center">
                    <div className="text-sm font-medium">{book.progress}% lido</div>
                    <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                      <div
                        className="bg-accent-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${book.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <Link to={`/my-books/${book._id}`} className="block group-hover:text-primary-600 transition-colors">
                  <h3 className="text-xl font-display font-semibold mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-secondary-600 font-medium mb-1">{book.author}</p>
                <div className="flex items-center justify-between text-sm text-secondary-500 mb-3">
                  <span className="bg-secondary-100 px-2 py-1 rounded-full">{book.genre}</span>
                  <span>{book.publishedDate || "Data desconhecida"}</span>
                </div>
                <p className="text-secondary-600 text-sm line-clamp-3 mb-4">{book.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-medium text-secondary-700">{book.rating ? `${book.rating}/10` : "—"}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-secondary-700">{book.progress ? `${book.progress}%` : "0%"}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link to={`/my-books/${book._id}`} className="flex-1 btn-accent text-center text-sm py-2">
                    Ver Detalhes
                  </Link>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                    title="Remover livro"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-2xl font-display font-semibold mb-4 text-secondary-800">Sua biblioteca está vazia</h3>
          <p className="text-secondary-600 mb-8 max-w-md mx-auto">
            Comece adicionando seu primeiro livro para construir sua coleção pessoal
          </p>
          <Link to="/add" className="btn-primary">
            Adicionar Primeiro Livro
          </Link>
        </div>
      )}
    </div>
  );
}
