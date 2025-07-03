# 📘 Bookstore REST API (Node.js + Express + JWT + File Storage)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)

# 📘 Bookstore REST API (Node.js + Express + JWT + File Storage)

A RESTful API for a simple Bookstore application built using **Node.js**, **Express**, **JWT authentication**, and **file-based persistence** (JSON).  
Supports secure CRUD operations on books and user management.

---

## ✅ Features Implemented

### 🔐 User Authentication
- `POST /auth/register` → Register with email & password
- `POST /auth/login` → Login & receive JWT token
- Protected all `/books` routes with JWT middleware

### 📚 Book Management (CRUD)
- `GET /books` → List all books (with pagination & optional genre filter)
- `GET /books/:id` → Get a single book by ID
- `POST /books` → Add a new book
- `PUT /books/:id` → Update book (only by creator)
- `DELETE /books/:id` → Delete book (only by creator)

### 🗂 Data Structure

```json
{
  "id": "UUID",
  "title": "string",
  "author": "string",
  "genre": "string",
  "publishedYear": number,
  "userId": "creator's user ID"
}
```

### 📦 Persistence
- Users stored in `data/users.json`
- Books stored in `data/books.json`
- Uses `fs.promises` for async file operations

### 🧩 Middleware
- Logger for all incoming requests
- JWT token auth middleware
- Global error handling & 404 routes

---

## 🚀 BONUS Features Added

- 🔎 **Search by genre**: `/books?genre=Fiction`
- 📄 **Pagination**: `/books?page=1&limit=5`
- 🧠 **Only book creators can update/delete**
- 🌐 **Frontend (React + Vite)**  
- ☁️ **Live deployed version on Render**

---

## 🧪 API Testing Instructions

### 📥 Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```

### 🔐 Login (get token)

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```

➡️ Copy the returned token and use it as:

```http
Authorization: Bearer <your_token_here>
```

---

### 📚 Books

#### Get all books
```http
GET /books
Headers: Authorization: Bearer token
```

#### Add a book
```http
POST /books
Content-Type: application/json
Authorization: Bearer token

{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "genre": "Fiction",
  "publishedYear": 1988
}
```

#### Update book
```http
PUT /books/:id
Authorization: Bearer token
```

#### Delete book
```http
DELETE /books/:id
Authorization: Bearer token
```

---

## 🛠️ Setup Instructions

### Prerequisites:
- Node.js v18+
- npm

---

### ▶️ Run Locally

```bash
git clone https://github.com/sarthakdubeyy12/Book-Store
cd Book-Store/backend
npm install
node app.js
```

Server starts on `http://localhost:3000`

---

## 🌐 Deployment URLs

> ✅ Not required in task, but included for bonus

| Component   | URL                                               |
|-------------|---------------------------------------------------|
| **Backend** | https://book-store-jnlc.onrender.com              |
| **Frontend**| https://bookstore-frontend-cini.onrender.com      |

---

## 👨‍💻 Frontend (BONUS - React + Vite)

- Built a simple UI with:
  - Register/Login forms
  - Add/Edit/Delete books
  - Toast notifications
  - JWT-based auth handling

Code is in root `/src`, built with Vite + TailwindCSS.

---

## 📦 Tools & Libraries Used

- `express`
- `jsonwebtoken`
- `uuid`
- `cors`
- `fs.promises`
- `vite`, `react`, `axios`, `react-toastify` (for frontend)

---

## 📜 Notes

> ✅ The frontend and deployment were added to demonstrate initiative and full-stack capability.  
> Only the backend API was required per assignment — all other parts are bonus.
