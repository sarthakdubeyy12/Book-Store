import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-xl text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">📚 Welcome to the Bookstore App</h1>
        <p className="text-gray-600 mb-6 text-lg">
          Discover, manage, and keep track of your favorite books — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition">
              Register
            </button>
          </Link>
          <Link to="/login">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition">
              Login
            </button>
          </Link>
          <Link to="/books">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition">
              Bookstore
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}