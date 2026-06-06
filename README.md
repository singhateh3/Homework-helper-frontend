# 📚 Homework Helper — Community Q&A Platform

> A full-stack peer-to-peer learning platform where students ask questions, share answers, and vote on the best content.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel&logoColor=white)](https://laravel.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌐 Live Demo

| Service     | URL                                                                        |
| ----------- | -------------------------------------------------------------------------- |
| Frontend    | [homework-helper.vercel.app](https://homework-helper.vercel.app)           |
| Backend API | [homework-helper-api.railway.app](https://homework-helper-api.railway.app) |

---

## ✨ Features

- 🔐 **Secure Authentication** — Registration & login with Laravel Sanctum JWT tokens
- ❓ **Q&A System** — Full CRUD for questions and answers
- 👍 **Voting System** — Upvote/downvote with optimistic UI and duplicate prevention
- 📱 **Responsive Design** — Mobile, tablet, and desktop ready
- 📊 **Community Stats** — Trending topics, top contributors, recent activity
- 🏷️ **Topics & Tags** — Categorize questions by subject
- ⚡ **Fast UX** — Optimistic UI updates for instant feedback

---

## 🛠️ Tech Stack

### Frontend

| Tool                                                           | Purpose                   |
| -------------------------------------------------------------- | ------------------------- |
| [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/) | UI framework & build tool |
| [React Router DOM](https://reactrouter.com/)                   | Client-side routing       |
| [Tailwind CSS](https://tailwindcss.com/)                       | Styling                   |
| [Axios](https://axios-http.com/)                               | HTTP client               |
| Context API                                                    | State management          |

### Backend

| Tool                                                | Purpose            |
| --------------------------------------------------- | ------------------ |
| [Laravel 11](https://laravel.com/)                  | PHP framework      |
| [MySQL](https://www.mysql.com/) + Eloquent          | Database & ORM     |
| [Laravel Sanctum](https://laravel.com/docs/sanctum) | API authentication |

### Deployment

| Service                         | Role             |
| ------------------------------- | ---------------- |
| [Railway](https://railway.app/) | Backend hosting  |
| [Vercel](https://vercel.com/)   | Frontend hosting |

---

## 🚀 Getting Started

### Prerequisites

- PHP >= 8.1 & Composer
- Node.js >= 18 & npm
- MySQL >= 5.7

### Backend Setup

```bash
git clone https://github.com/yourusername/homework-helper-backend.git
cd homework-helper-backend

composer install
cp .env.example .env
php artisan key:generate

# Configure your DB in .env, then:
php artisan migrate --seed
php artisan serve
```

### Frontend Setup

```bash
git clone https://github.com/yourusername/homework-helper-frontend.git
cd homework-helper-frontend

npm install
cp .env.example .env.local
# Set VITE_API_URL=http://localhost:8000/api in .env.local

npm run dev
```

---

## 📁 Project Structure

```
homework-helper/
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/API/
│   │   │   ├── AuthController.php
│   │   │   ├── QuestionController.php
│   │   │   ├── AnswerController.php
│   │   │   └── VoteController.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Question.php
│   │   │   ├── Answer.php
│   │   │   └── Vote.php
│   │   └── Traits/HasVotes.php
│   ├── database/migrations/
│   └── routes/api.php
│
└── frontend/
    └── src/
        ├── components/       # Reusable UI components
        ├── pages/            # Route-level page components
        ├── context/          # AuthContext
        ├── services/api.js   # Axios API layer
        └── router.jsx
```

---

## 🌐 API Reference

| Method   | Endpoint                      | Description            | Auth |
| -------- | ----------------------------- | ---------------------- | ---- |
| `POST`   | `/api/register`               | Register new user      | —    |
| `POST`   | `/api/login`                  | User login             | —    |
| `POST`   | `/api/logout`                 | User logout            | ✅   |
| `GET`    | `/api/user`                   | Get authenticated user | ✅   |
| `GET`    | `/api/questions`              | List all questions     | —    |
| `GET`    | `/api/questions/{id}`         | Get single question    | —    |
| `POST`   | `/api/questions`              | Create question        | ✅   |
| `PUT`    | `/api/questions/{id}`         | Update question        | ✅   |
| `DELETE` | `/api/questions/{id}`         | Delete question        | ✅   |
| `GET`    | `/api/top-questions`          | Recent questions       | —    |
| `GET`    | `/api/questions/{id}/answers` | Get answers            | —    |
| `POST`   | `/api/answers`                | Create answer          | ✅   |
| `POST`   | `/api/questions/{id}/vote`    | Vote on question       | ✅   |
| `POST`   | `/api/answers/{id}/vote`      | Vote on answer         | ✅   |
| `GET`    | `/api/stats`                  | Platform statistics    | —    |

---

## 🔒 Security

- Passwords hashed with **bcrypt**
- API protected with **Laravel Sanctum** tokens
- **CORS** configured for secure cross-origin access
- **SQL injection** prevented via Eloquent ORM
- **XSS** protection via Laravel's built-in escaping

---

## 🗺️ Roadmap

- [ ] Real-time notifications (WebSockets)
- [ ] Full-text search with filters
- [ ] Reputation badges & gamification
- [ ] Markdown support in answers
- [ ] Email verification & password reset
- [ ] OAuth (Google, GitHub)
- [ ] File attachments

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the [MIT License](LICENSE).

---

## 📬 Contact

**Your Name** — your.email@example.com

- 🔗 Frontend Repo: [github.com/singhateh3/homework-helper-frontend](https://github.com/yourusername/homework-helper-frontend)
- 🔗 Backend Repo: [github.com/singhateh3/homework-helper](https://github.com/yourusername/homework-helper-backend)

---

⭐ **Star this project if you found it helpful!**
