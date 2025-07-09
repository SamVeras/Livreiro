export function normalizeGoogleBook(item) {
  return {
    id: item.id,
    title: item.volumeInfo?.title || "",
    author: item.volumeInfo?.authors?.join(", ") || "",
    genre: item.volumeInfo?.categories?.join(", ") || "",
    description: item.volumeInfo?.description || "",
    coverImage: item.volumeInfo?.imageLinks?.thumbnail || "",
    publishedDate: item.volumeInfo?.publishedDate || "",
  };
}

export async function searchBooks_Google(query, startIndex = 0) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&startIndex=${startIndex}&maxResults=12`;
  const res = await fetch(url);
  const data = await res.json();
  return {
    results: (data.items || []).map(normalizeGoogleBook),
    hasMore: (data.totalItems || 0) > startIndex + 12,
  };
}
