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
    // bg-gradient-to-br from-blue-300
    <div className="min-h-screen bg-gradient-to-br from-amber-200 to-rose-400 text-gray-900">
      <nav className="bg-white shadow p-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-4">
          <Link to="/" className="font-bold text-lg">
            📖 Livreiro
          </Link>

          <div className="flex flex-wrap items-center gap-4 ml-auto text-sm">
            {!token && (
              <>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
                <Link to="/register" className="hover:underline">
                  Registrar
                </Link>
              </>
            )}
            {token && (
              <>
                <Link to="/add" className="hover:underline">
                  Adicionar
                </Link>
                <Link to="/my-books" className="hover:underline">
                  Meus Livros
                </Link>
                <span className="text-gray-600">
                  Logado como <strong>{name}</strong>
                </span>
                <button onClick={logout} className="text-red-600 hover:underline">
                  Sair
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6">
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
    </div>
  );
}
