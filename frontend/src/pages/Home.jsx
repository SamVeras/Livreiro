import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bookAPI } from "../api/api";

export default function Home() {
  const { name, token } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
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

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient">
          Bem-vindo{name && `, ${name}`}!
        </h1>
      </div>
      {token && (
        <div className="mb-8">
          <h2 className="text-2xl font-display font-semibold mb-4 text-secondary-800 text-left">Sua Estante</h2>
          {loading ? (
            <div className="flex items-center justify-center min-h-[120px]">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : books.length === 0 ? (
            <div className="text-secondary-600 text-center py-8">Nenhum livro na estante ainda.</div>
          ) : (
            <div>
              <div className="flex gap-6 overflow-x-auto pb-4 pt-4 px-2 bookcase-scrollbar">
                {books.map((book) => (
                  <Link key={book._id} to={`/my-books/${book._id}`} className="flex-shrink-0 w-32 md:w-40 group">
                    <div className="rounded-lg shadow-material-lg bg-white/80 h-48 md:h-60 flex items-center justify-center overflow-hidden transition-shadow border-b-8 border-amber-400 relative">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={`Capa de ${book.title}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary-100 to-secondary-200">
                          <span className="text-5xl text-secondary-400">📚</span>
                        </div>
                      )}
                      {book.progress ? (
                        <div className="absolute left-0 bottom-0 w-full">
                          <div
                            className="h-1 bg-gradient-to-r from-primary-500 to-accent-500"
                            style={{ width: `${book.progress}%` }}
                          ></div>
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-2 text-sm font-medium text-secondary-800 line-clamp-2 text-center">
                      {book.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link to="/add" className="card p-8 text-center group transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-material-lg group-hover:shadow-material-xl transition-shadow">
            <span className="text-3xl">➕</span>
          </div>
          <h3 className="text-2xl font-display font-semibold mb-3 text-secondary-800">Adicionar Livro</h3>
          <p className="text-secondary-600 mb-6">Registre um novo livro em sua biblioteca</p>
          <div className="inline-flex items-center text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
            Começar
            <svg
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
        <Link to="/my-books" className="card p-8 text-center group transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-material-lg group-hover:shadow-material-xl transition-shadow">
            <span className="text-3xl">📚</span>
          </div>
          <h3 className="text-2xl font-display font-semibold mb-3 text-secondary-800">Meus Livros</h3>
          <p className="text-secondary-600 mb-6">Visualize e gerencie sua coleção</p>
          <div className="inline-flex items-center text-accent-600 font-medium group-hover:text-accent-700 transition-colors">
            Ver Biblioteca
            <svg
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}
