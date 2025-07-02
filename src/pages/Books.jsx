import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import jwtDecode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', genre: '', publishedYear: '' });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const currentUser = token ? jwtDecode(token) : null;

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books');
      setBooks(res.data);
      console.log('✅ Books fetched:', res.data);
    } catch (err) {
      toast.error('Failed to fetch books');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const { title, author, genre, publishedYear } = form;

    if (!title || !author || !genre || !publishedYear) {
      toast.warn('All fields are required!');
      return;
    }

    try {
      if (editId) {
        await api.put(`/books/${editId}`, form);
        toast.success('Book updated successfully!');
      } else {
        await api.post('/books', form);
        toast.success('Book added successfully!');
      }
      setForm({ title: '', author: '', genre: '', publishedYear: '' });
      setEditId(null);
      fetchBooks();
    } catch (err) {
      toast.error('Error saving book');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/books/${id}`);
      fetchBooks();
      toast.success('Book deleted');
    } catch (err) {
      toast.error('Error deleting book');
    }
  };

  const handleEdit = (book) => {
    setForm(book);
    setEditId(book.id);
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-blue-100 py-10 px-4">
      <div className="mt-24 max-w-6xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-800">📚 Book Dashboard</h2>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>

        {/* Book Form */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">
            {editId ? '✏️ Update Book' : '➕ Add a New Book'}
          </h3>
          <form onSubmit={handleAddOrUpdate} className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="p-3 border rounded-lg"
            />
            <input
              placeholder="Author"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="p-3 border rounded-lg"
            />
            <input
              placeholder="Genre"
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              className="p-3 border rounded-lg"
            />
            <input
              placeholder="Published Year"
              type="number"
              value={form.publishedYear}
              onChange={(e) => setForm({ ...form, publishedYear: e.target.value })}
              className="p-3 border rounded-lg"
            />
            <button
              type="submit"
              className="col-span-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
            >
              {editId ? '✏️ Update Book' : '➕ Add Book'}
            </button>
          </form>
        </div>

        {/* Uploaded Books */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">📚 Uploaded Books</h3>
          {books.length === 0 ? (
            <p className="text-gray-500 text-center">No books available. Start by adding one above.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex gap-6 min-w-fit">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="min-w-[280px] max-w-xs bg-gray-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm"
                  >
                    <h4 className="text-xl font-bold text-blue-700">{book.title}</h4>
                    <p className="text-gray-700">Author: {book.author}</p>
                    <p className="text-gray-700">Genre: {book.genre}</p>
                    <p className="text-gray-700">Published: {book.publishedYear}</p>

                    {/* 🔒 Show buttons only if user is creator */}
                    {book.userId === currentUser?.userId && (
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => handleEdit(book)}
                          className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}