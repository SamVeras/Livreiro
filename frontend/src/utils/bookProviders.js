import axios from "axios";

// Transforma resultado da Google Books API em formato padronizado
function mapGoogleBooksResults(items) {
  return (items || []).map((item) => {
    const info = item.volumeInfo;
    return {
      id: item.id,
      title: info.title || "Sem título",
      author: info.authors?.[0] || "Autor desconhecido",
      description: info.description || "Sem descrição",
      genre: info.categories?.[0] || "Gênero indefinido",
      coverImage: info.imageLinks?.thumbnail || "",
      publishedDate: info.publishedDate || "",
    };
  });
}

// Busca livros da Google Books API
export async function searchBooks_Google(query, startIndex = 0) {
  const res = await axios.get(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=12`
  );
  return {
    results: mapGoogleBooksResults(res.data.items),
    hasMore: res.data.totalItems > startIndex + 12,
  };
}
