import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-4">
        <div className="mb-12">
          {/* <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-material-lg">
            <span className="text-4xl">📚</span>
          </div> */}
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-gradient">Livreiro</h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Gerencie sua biblioteca pessoal de livros.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card p-6 text-center transition-all duration-300">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📖</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Organize sua leitura</h3>
            <p className="text-secondary-600 text-sm">Registre e acompanhe seus livros lidos e em andamento.</p>
          </div>
          <div className="card p-6 text-center transition-all duration-300">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Avalie e comente</h3>
            <p className="text-secondary-600 text-sm">Anote opiniões e atualize seu progresso.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary">
              Criar conta
            </Link>
            <Link to="/login" className="btn-secondary">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
