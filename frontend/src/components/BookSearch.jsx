import { useState } from "react";
import axios from "axios";
import { bookAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function BookSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { token } = useAuth();

  const search = async (e) => {
    e.preventDefault();
    const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
    setResults(res.data.items || []);
  };

  const addBook = async (book) => {
    const info = book.volumeInfo;
    const data = {
      title: info.title || "Sem título",
      author: (info.authors && info.authors[0]) || "Desconhecido",
      genre: (info.categories && info.categories[0]) || "Gênero indefinido",
      description: info.description || "Sem descrição",
    };

    try {
      await bookAPI.post("/books", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Livro adicionado!");
    } catch {
      alert("Erro ao adicionar livro");
    }
  };

  return (
    <div>
      <form onSubmit={search}>
        <input placeholder="Buscar livro (título, autor...)" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit">Buscar</button>
      </form>

      <ul>
        {results.map((book) => {
          const info = book.volumeInfo;
          return (
            <li key={book.id} style={{ marginBottom: "1em" }}>
              <strong>{info.title}</strong> — {(info.authors && info.authors.join(", ")) || "Autor desconhecido"}
              <br />
              <em>{(info.categories && info.categories.join(", ")) || "Sem categoria"}</em>
              <p>{info.description?.substring(0, 200) || "Sem descrição"}</p>
              <button onClick={() => addBook(book)}>Adicionar</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
