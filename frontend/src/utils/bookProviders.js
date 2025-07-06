import axios from "axios";

function mapOpenLibraryResults(raw) {
  return raw.docs.map((doc) => ({
    id: doc.key, // ex: "/works/OL12345W"
    title: doc.title || "Sem título",
    author: doc.author_name?.[0] || "Autor desconhecido",
    coverId: doc.cover_i,
    publishedDate: doc.first_publish_year?.toString() || "",
    workKey: doc.key, // usado para buscar dados detalhados depois
  }));
}

export async function searchBooks_OpenLibrary(query, page = 1) {
  const res = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&page=${page}`);
  return {
    results: mapOpenLibraryResults(res.data),
    hasMore: page * 100 < res.data.numFound,
  };
}

export async function getBookDetails_OpenLibrary(workKey) {
  try {
    const res = await axios.get(`https://openlibrary.org${workKey}.json`);
    const desc = res.data.description;
    const subject = res.data.subjects?.[0];

    return {
      description: typeof desc === "string" ? desc : desc?.value || "Sem descrição",
      genre: subject || "Gênero indefinido",
    };
  } catch {
    return {
      description: "Sem descrição",
      genre: "Gênero indefinido",
    };
  }
}

export function getCoverImageUrl(coverId) {
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : "";
}
