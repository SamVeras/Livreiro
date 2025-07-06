import { useState } from "react";
import axios from "axios";
import { bookAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function BookSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [added, setAdded] = useState({});
  const { token } = useAuth();

  const fetchBooks = async (index = 0) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${index}&maxResults=10`
      );
      setResults(res.data.items || []);
      setStartIndex(index);
    } finally {
      setLoading(false);
    }
  };

  const search = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchBooks(0);
    }
  };

  const addBook = async (book) => {
    const info = book.volumeInfo;
    const data = {
      title: info.title || "Sem título",
      author: (info.authors && info.authors[0]) || "Desconhecido",
      genre: (info.categories && info.categories[0]) || "Gênero indefinido",
      description: info.description || "Sem descrição",
      coverImage: info.imageLinks?.thumbnail || "",
      publishedDate: info.publishedDate || "",
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
      <form onSubmit={search}>
        <input
          placeholder="Buscar livros (título, autor...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          Buscar
        </button>
      </form>

      {loading && <p>Carregando resultados...</p>}

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
            {results.map((book) => {
              const info = book.volumeInfo;
              const cover = info.imageLinks?.thumbnail;
              const shortDesc = info.description ? info.description.substring(0, 120) : "Sem descrição";

              return (
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
                  {cover && <img src={cover} alt="Capa" style={{ width: "100%" }} />}
                  <strong>{info.title}</strong>
                  <p>{(info.authors && info.authors.join(", ")) || "Autor desconhecido"}</p>
                  <p style={{ fontSize: "0.85rem" }}>
                    {shortDesc}
                    {info.description?.length > 120 && "..."}
                  </p>
                  <button disabled={added[book.id]} onClick={() => addBook(book)} style={{ marginTop: "0.5rem" }}>
                    {added[book.id] ? "✅ Adicionado" : "Adicionar"}
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "1rem" }}>
            {startIndex >= 10 && <button onClick={() => fetchBooks(startIndex - 10)}>⬅️ Anterior</button>}
            <button onClick={() => fetchBooks(startIndex + 10)} style={{ marginLeft: "0.5rem" }}>
              ➡️ Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}
