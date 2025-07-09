import { useState } from "react";
import { bookAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { searchBooks_Google } from "../utils/bookProviders";

export default function BookSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [added, setAdded] = useState({});
  const { token } = useAuth();

  const search = async (index = 0) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { results, hasMore } = await searchBooks_Google(query, index);
      setResults(results);
      setStartIndex(index);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    search(0);
  };

  const addBook = async (book) => {
    const data = {
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      coverImage: book.coverImage,
      publishedDate: book.publishedDate,
    };

    try {
      await bookAPI.post("/books", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdded((prev) => ({ ...prev, [book.id]: true }));
    } catch {
      alert("Erro ao adicionar livro");
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient">Buscar Livros</h1>
        <p className="text-xl text-secondary-600">Encontre e adicione novos livros à sua biblioteca</p>
      </div>

      {/* Search Form */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              placeholder="Digite o título, autor ou gênero do livro..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field pr-12"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Buscando...
              </div>
            ) : (
              "Buscar"
            )}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary-600">Buscando livros...</p>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-display font-semibold text-secondary-800 mb-2">Resultados da busca</h2>
            <p className="text-secondary-600">
              Encontrados {results.length} livro{results.length !== 1 ? "s" : ""} para "{query}"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((book) => (
              <div key={book.id} className="card group transition-all duration-300 overflow-hidden">
                {/* Book Cover */}
                <div className="relative">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={`Capa de ${book.title}`}
                      className="w-full h-80 object-cover group-hover:brightness-110 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center">
                      <span className="text-6xl text-secondary-400">📚</span>
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-6">
                  <h3 className="text-xl font-display font-semibold mb-2 line-clamp-2 text-secondary-800">
                    {book.title}
                  </h3>

                  <p className="text-secondary-600 font-medium mb-1">{book.author}</p>

                  <div className="flex items-center justify-between text-sm text-secondary-500 mb-3">
                    {book.genre && <span className="bg-secondary-100 px-2 py-1 rounded-full">{book.genre}</span>}
                    <span>{book.publishedDate || "Data desconhecida"}</span>
                  </div>

                  {book.description && (
                    <p className="text-secondary-600 text-sm line-clamp-3 mb-4">{book.description}</p>
                  )}

                  {/* Add Button */}
                  <button
                    disabled={added[book.id]}
                    onClick={() => addBook(book)}
                    className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                      added[book.id] ? "bg-green-100 text-green-700 cursor-not-allowed" : "btn-primary"
                    }`}
                  >
                    {added[book.id] ? (
                      <div className="flex items-center justify-center">
                        <span className="mr-2">✅</span>
                        Adicionado
                      </div>
                    ) : (
                      "Adicionar à Biblioteca"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4">
            {startIndex >= 12 && (
              <button onClick={() => search(startIndex - 12)} className="btn-secondary">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>
            )}
            <button onClick={() => search(startIndex + 12)} className="btn-accent">
              Próxima
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && query && results.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-2xl font-display font-semibold mb-4 text-secondary-800">Nenhum livro encontrado</h3>
          <p className="text-secondary-600 mb-8 max-w-md mx-auto">
            Tente usar termos diferentes ou verificar a ortografia
          </p>
        </div>
      )}
    </div>
  );
}
