import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="bg-white">
      <div className="max-w-xl mx-auto p-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Bem-vindo!</h2>
        <p className="text-gray-700 mb-6">
          Registre, acompanhe e avalie os livros que você leu ou está lendo.
          <br />
          Crie uma conta para começar seu histórico de leitura.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
            Criar Conta
          </Link>
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
