import { useState } from "react";
import { bookAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { searchBooks_OpenLibrary, getBookDetails_OpenLibrary, getCoverImageUrl } from "../utils/bookProviders";

export default function BookSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [added, setAdded] = useState({});
  const { token } = useAuth();

  const search = async (p = 1) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { results } = await searchBooks_OpenLibrary(query, p);
      setResults(results);
      setPage(p);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    search(1);
  };

  const addBook = async (book) => {
    const extra = await getBookDetails_OpenLibrary(book.workKey);
    const data = {
      title: book.title,
      author: book.author,
      genre: extra.genre,
      description: extra.description,
      coverImage: getCoverImageUrl(book.coverId),
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
    <div className="px-4">
      <form onSubmit={handleSubmit} className="my-6 flex gap-2">
        <input
          placeholder="Buscar livros..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded shadow"
        />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Buscar
        </button>
      </form>

      {loading && <p>Carregando...</p>}

      {!loading && results.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((book) => (
              <div key={book.id} className="border rounded-xl p-4 shadow bg-white hover:shadow-md transition">
                {book.coverId && (
                  <img
                    src={getCoverImageUrl(book.coverId)}
                    alt="Capa"
                    className="w-full h-60 object-cover rounded mb-3"
                  />
                )}
                <h3 className="text-lg font-bold mb-1">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="text-xs text-gray-500 mt-1">{book.publishedDate || "Data desconhecida"}</p>
                <button
                  disabled={added[book.id]}
                  onClick={() => addBook(book)}
                  className={`mt-4 w-full py-1 rounded ${
                    added[book.id]
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {added[book.id] ? "✅ Adicionado" : "Adicionar"}
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-6">
            {page > 1 && (
              <button onClick={() => search(page - 1)} className="px-4 py-1 border rounded hover:bg-gray-100">
                ⬅️ Anterior
              </button>
            )}
            <button onClick={() => search(page + 1)} className="px-4 py-1 border rounded hover:bg-gray-100">
              ➡️ Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}
