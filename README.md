<<<<<<< HEAD
# PrepAI – AI Career & Placement Coach

A production-ready MERN stack application that helps students and professionals prepare for placements with AI-powered resume analysis, mock interviews, job application tracking, and personalized career roadmaps.

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Redux Toolkit, Axios, React Hook Form, Framer Motion, Monaco Editor, Recharts, React Hot Toast

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt, Multer, Cloudinary, Nodemailer, Helmet, Morgan, dotenv

**AI:** Google Gemini API, pdf-parse

> No TypeScript. No Firebase/Supabase. No Admin Panel.

## Folder Structure

```
prepai/
├── backend/
│   ├── config/          # db, cloudinary, gemini, mailer configs
│   ├── controllers/     # route handler logic
│   ├── models/          # Mongoose schemas (User, Resume, Interview, JobApplication, Roadmap)
│   ├── routes/          # Express routers
│   ├── middleware/      # auth, error handling, multer upload, validation
│   ├── services/        # geminiService, pdfService, cloudinaryService
│   ├── utils/           # ApiError, ApiResponse, generateToken, sendEmail
│   ├── uploads/         # temp local storage before Cloudinary upload
│   ├── app.js
│   ├── server.js
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/store.js         # Redux Toolkit store
    │   ├── features/            # auth, resume, interview, jobs, roadmap slices
    │   ├── components/
    │   │   ├── common/          # Button, Spinner, EmptyState
    │   │   └── layout/          # Navbar, Sidebar, DashboardLayout, PublicLayout
    │   ├── pages/                # Landing, auth, dashboard, resume, interview, jobs, roadmap, profile
    │   ├── routes/ProtectedRoute.jsx
    │   ├── hooks/useAuth.js
    │   ├── utils/axiosInstance.js
    │   ├── App.jsx
    │   └── main.jsx
    └── .env.example
```

## Getting Started

### 1. Backend Setup

```bash
cd backend
cp .env.example .env   # fill in MongoDB URI, JWT secret, Cloudinary, Gemini, SMTP keys
npm install
npm run dev             # starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev              # starts on http://localhost:5173
```

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for the full list of required variables, including:

- `MONGO_URI`, `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `GEMINI_API_KEY`, `GEMINI_MODEL`
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (Nodemailer)
- `VITE_API_BASE_URL` (frontend)

## Core Features

- **Auth:** JWT-based register/login/logout, forgot/reset password via email, protected routes.
- **Resume Analyzer:** Upload PDF resume → extract text (`pdf-parse`) → store on Cloudinary → AI-generated ATS score, strengths, weaknesses, suggestions, missing keywords (Gemini).
- **Mock Interview:** AI-generated technical/HR/coding questions, per-question AI feedback & scoring, Monaco Editor for coding answers, overall performance summary.
- **Job Tracker:** CRUD job applications with status pipeline (saved → applied → interviewing → offer/rejected) and stats for dashboard charts.
- **Career Roadmap:** AI-generated milestone-based learning roadmap tailored to target role, current level, and skills; track progress by toggling milestones.
- **Dashboard:** Recharts-powered overview of application stats, latest ATS score, and roadmap progress.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/resumes/upload` | Upload resume PDF |
| POST | `/api/resumes/:id/analyze` | AI analyze resume |
| POST | `/api/interviews/start` | Start AI mock interview |
| POST | `/api/interviews/:id/answer` | Submit answer for AI feedback |
| POST | `/api/jobs` | Add job application |
| POST | `/api/roadmaps/generate` | Generate AI career roadmap |

All protected routes require `Authorization: Bearer <token>` header or `token` cookie.

## Notes

- This boilerplate intentionally has **no admin panel** per project requirements.
- Multer stores files locally and temporarily before forwarding to Cloudinary, then deletes the local copy.
- Gemini responses are strictly parsed as JSON via prompt instructions in `services/geminiService.js`.
=======
# PrepAi
>>>>>>> 29f0c26fc44b59dad70be8656ec76f557a8cbf79
