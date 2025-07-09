import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddBook from "./pages/AddBook";
import MyBooks from "./pages/MyBooks";
import BookDetails from "./pages/BookDetails";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  const { name, logout, token } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-200 via-orange-100 to-rose-200">
      <nav className="bg-white/90 backdrop-blur-md border-b border-secondary-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-material">
                <span className="text-white font-bold text-lg">📖</span>
              </div>
              <span className="font-display text-xl font-semibold text-gradient group-hover:scale-105 transition-transform">
                Livreiro
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {!token ? (
                <>
                  <Link to="/login" className="text-secondary-600 hover:text-primary-600 font-medium transition-colors">
                    Entrar
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Criar Conta
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/add" className="text-secondary-600 hover:text-primary-600 font-medium transition-colors">
                    Adicionar Livro
                  </Link>
                  <Link
                    to="/my-books"
                    className="text-secondary-600 hover:text-primary-600 font-medium transition-colors"
                  >
                    Meus Livros
                  </Link>
                  <div className="flex items-center space-x-4">
                    <span className="text-secondary-500 text-sm">
                      Olá, <span className="font-semibold text-secondary-700">{name}</span>
                    </span>
                    <button
                      onClick={logout}
                      className="text-secondary-500 hover:text-red-600 font-medium transition-colors"
                    >
                      Sair
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button className="text-secondary-600 hover:text-primary-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={token ? <Home /> : <Welcome />} />
          <Route
            path="/my-books/:id"
            element={
              <PrivateRoute>
                <BookDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-books"
            element={
              <PrivateRoute>
                <MyBooks />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/add"
            element={
              <PrivateRoute>
                <AddBook />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      <footer className="bg-white/90 backdrop-blur-md border-t border-secondary-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-secondary-600 text-sm">
              Criado por{" "}
              <a
                href="https://github.com/SamVeras"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Samuel Veras
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
