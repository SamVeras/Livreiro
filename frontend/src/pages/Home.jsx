import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { name } = useAuth();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient">
          Bem-vindo{name && `, ${name}`}!
        </h1>
      </div>
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
