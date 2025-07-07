import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { name } = useAuth();

  return (
    <div className="">
      <div className="max-w-xl mx-auto p-4 text-center bg-white rounded-lg shadow border">
        <h2 className="text-3xl font-bold mb-4">Bem-vindo{name && `, ${name}`}!</h2>
        <p className="text-gray-700 mb-6">
          Este é seu espaço pessoal para registrar, acompanhar e avaliar seus livros.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/add" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
            ➕ Adicionar Livro
          </Link>
          <Link to="/my-books" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
            📚 Meus Livros
          </Link>
        </div>
      </div>
    </div>
  );
}
