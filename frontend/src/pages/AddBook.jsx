import { useState } from "react";
import BookSearch from "../components/BookSearch";
import ManualBookEntry from "../components/ManualBookEntry";

export default function AddBook() {
  const [mode, setMode] = useState("search");

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient">Adicionar Livro</h1>
        <p className="text-xl text-secondary-600">Escolha como deseja adicionar um novo livro</p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setMode("search")}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            mode === "search"
              ? "bg-primary-500 text-white shadow-material-lg"
              : "bg-white text-secondary-600 hover:bg-secondary-50 border border-secondary-200"
          }`}
        >
          Buscar
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            mode === "manual"
              ? "bg-primary-500 text-white shadow-material-lg"
              : "bg-white text-secondary-600 hover:bg-secondary-50 border border-secondary-200"
          }`}
        >
          Inserir manualmente
        </button>
      </div>

      {mode === "search" ? <BookSearch /> : <ManualBookEntry />}
    </div>
  );
}
