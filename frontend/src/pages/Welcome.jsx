import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div>
      <h2>BookTracker 📘</h2>
      <p>Registre, acompanhe e avalie seus livros pessoais.</p>
      <p>
        <Link to="/login">Entrar</Link> ou <Link to="/register">Criar conta</Link>
      </p>
    </div>
  );
}
