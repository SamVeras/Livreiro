import { useEffect, useState } from 'react';
import { bookAPI } from '../api/api';

export default function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    bookAPI.get('/books').then(res => setBooks(res.data));
  }, []);

  return (
    <div>
      <h2>Livros Disponíveis</h2>
      <ul>
        {books.map(book => (
          <li key={book._id}>
            <strong>{book.title}</strong> - {book.author} ({book.genre})
            <p>{book.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
