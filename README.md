# StudentHub

StudentHub is a full-stack student portal built with Django, MongoDB, React, Tailwind CSS, Celery, Redis, and Django Channels. The stack is structured for Docker-based local development and includes JWT auth, timetable Excel ingestion, attendance analytics, academic results, notices, clubs, events, placement workflows, and study tools.

## Run locally

1. Copy `.env.example` to `.env`.
2. Start the stack with `docker-compose up --build`.
3. Frontend: `http://localhost`
4. Backend API: `http://localhost/api/`

## Backend highlights

- MongoEngine document models for all collections
- DRF APIs with JWT auth in httpOnly cookies
- Channels websocket consumers for notices and attendance updates
- Celery workers for email reminders and alert tasks
- Excel parsing with support for both a canonical template and PDEU-style matrix timetables

## Frontend highlights

- Vite + React + Tailwind + Framer Motion
- React Router v6 route-based layouts
- TanStack Query for data fetching and cache control
- Recharts for analytics views
- Dark mode, skeletons, responsive layouts, and animated transitions

- Author's Note: Still developing and improving the UI and Adding more features.Making an one stop solution for Student Management Sytem.
