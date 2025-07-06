import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { name } = useAuth();

  return (
    <div>
      <h2>Bem-vindo{name && `, ${name}`}!</h2>
      <p>Este é seu espaço pessoal para registrar e acompanhar seus livros.</p>

      <ul>
        <li>
          <Link to="/add">📚 Adicionar um novo livro</Link>
        </li>
        <li>
          <Link to="/my-books">📖 Ver seus livros</Link>
        </li>
      </ul>
    </div>
  );
}
