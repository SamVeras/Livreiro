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
    <div>
      <form onSubmit={handleSubmit}>
        <input placeholder="Buscar livros" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit" disabled={loading}>
          Buscar
        </button>
      </form>

      {loading && <p>Carregando...</p>}

      {!loading && results.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {results.map((book) => (
              <div
                key={book.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  width: "220px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {book.coverId && (
                  <img
                    src={getCoverImageUrl(book.coverId)}
                    alt="Capa"
                    style={{ width: "100%", marginBottom: "0.5rem" }}
                  />
                )}
                <strong>{book.title}</strong>
                <p>{book.author}</p>
                <p style={{ fontSize: "0.85rem" }}>Publicado em: {book.publishedDate || "—"}</p>
                <button disabled={added[book.id]} onClick={() => addBook(book)} style={{ marginTop: "0.5rem" }}>
                  {added[book.id] ? "✅ Adicionado" : "Adicionar"}
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1rem" }}>
            {page > 1 && <button onClick={() => search(page - 1)}>⬅️ Anterior</button>}
            <button onClick={() => search(page + 1)} style={{ marginLeft: "0.5rem" }}>
              ➡️ Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}
