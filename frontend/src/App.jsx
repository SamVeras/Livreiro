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
    <div>
      <nav>
        <Link to="/">Home</Link>
        {!token && (
          <>
            {" "}
            | <Link to="/login">Login</Link> | <Link to="/register">Registrar</Link>
          </>
        )}
        {token && (
          <>
            {" "}
            | <Link to="/add">Adicionar</Link> | <Link to="/my-books">Meus Livros</Link>
          </>
        )}
        {token && (
          <>
            {" "}
            | Logado como <strong>{name}</strong> <button onClick={logout}>Sair</button>
          </>
        )}
      </nav>

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
    </div>
  );
}
