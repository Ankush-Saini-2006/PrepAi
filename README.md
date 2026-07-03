# PrepAI - AI Career & Placement Coach

A production-ready MERN stack application that helps students and professionals prepare for placements with AI-powered resume analysis, coding profile insights, job application tracking, smart task planning, and personalized career roadmaps.

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Redux Toolkit, Axios, React Hook Form, Framer Motion, Recharts, React Hot Toast

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt, Multer, Cloudinary, Nodemailer, Helmet, Morgan, dotenv

**AI:** Google Gemini API, pdf-parse

## Folder Structure

```text
prepai/
  backend/
    config/
    controllers/
    models/
    routes/
    middleware/
    services/
    utils/
    uploads/
    app.js
    server.js
  frontend/
    src/
      app/
      components/
      config/
      features/
      hooks/
      pages/
      redux/
      routes/
      services/
      utils/
      App.jsx
      main.jsx
```

## Core Features

- **Auth:** JWT-based register/login/logout, forgot/reset password via email, protected routes.
- **Resume Analyzer:** Upload PDF resumes, parse with `pdf-parse`, store uploads, and generate Gemini feedback.
- **Resume vs Job Description Matching:** Compare a resume PDF with a pasted job description and save structured match history.
- **AI Career Chatbot:** Career, coding, resume, roadmap, company, aptitude, and placement guidance powered by Gemini.
- **AI Smart Task Manager:** Manual and Gemini-generated preparation tasks, calendars, study plans, reminders, and progress charts.
- **AI Coding Profile Analyzer:** Connect LeetCode, GitHub, and Codeforces profiles, cache public data, and generate AI readiness insights.
- **Job Tracker:** CRUD job applications with status pipeline and dashboard stats.
- **Career Roadmap:** AI-generated milestone-based learning roadmap tailored to target role, current level, and skills.
- **Dashboard:** Recharts-powered overview of preparation, applications, tasks, coding scores, and roadmap progress.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/resumes/upload` | Upload resume PDF |
| POST | `/api/resumes/:id/analyze` | AI analyze resume |
| POST | `/api/resume-job-match/analyze` | Compare resume with a job description |
| POST | `/api/chat` | Send a career chatbot message |
| POST | `/api/tasks` | Create a smart task |
| POST | `/api/study-plans/generate` | Generate an AI study plan |
| POST | `/api/coding-profiles/connect` | Connect and analyze coding profiles |
| POST | `/api/jobs` | Add job application |
| POST | `/api/roadmaps/generate` | Generate AI career roadmap |

All protected routes require `Authorization: Bearer <token>` header or the configured auth cookie.

## Notes

- Multer stores files locally and temporarily before forwarding to Cloudinary when configured.
- Gemini responses are parsed through prompt instructions in `backend/services/geminiService.js`.
- Public coding profile data is cached in MongoDB for later analysis history.
