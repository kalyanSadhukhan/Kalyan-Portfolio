# Kalyan Developer Portfolio

This is a modern personal portfolio website built to showcase projects, skills, and professional experience. It features a responsive design, dynamic glassmorphism UI, interactive components, and an admin dashboard.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Spring Boot, Java, H2 Database (in-memory, configurable to PostgreSQL/MySQL)
- **Authentication**: JWT-based security

## Features

- **Public View**: Hero section, About, Skills, Projects, Certification, and Hobbies. Fully responsive and styled with dynamic hover/glow effects.
- **Admin Dashboard**: Secured via JWT authentication. Manage content (CRUD operations for profile, skills, projects, hobbies, and education) directly from the dashboard.
- **AI Assistant**: Personalized chat widget built with the Gemini API to interactively answer user questions about the portfolio.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 17+
- Maven (optional, wrapper included in backend)

### Frontend Setup

1. Navigate to the frontend directory.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables (copy `example.env.local` to `.env.local` and add your Gemini API URL if used).
4. Run the development server:
   ```sh
   npm run dev
   ```
5. The frontend runs at `http://localhost:8083`.

### Backend Setup

1. Navigate to the backend directory (`portfolio-backend`).
2. Run the Spring Boot application using Maven or your IDE.
3. The backend API runs by default on `http://localhost:8081`.

## License

All rights reserved by Kalyan Sadhukhan.
