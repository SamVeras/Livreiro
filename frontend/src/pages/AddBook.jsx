import BookSearch from "../components/BookSearch";

export default function AddBook() {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Adicionar Livro</h2>
      <BookSearch />
    </div>
  );
}
