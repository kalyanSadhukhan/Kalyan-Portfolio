# Kalyan Portfolio | Full-Stack Professional Showcase

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.3-brightgreen)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/Frontend-React%2018-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)](https://www.typescriptlang.org/)
[![AI Ready](https://img.shields.io/badge/AI-Gemini%20RAG-orange)](https://ai.google.dev/)

A modern, high-performance portfolio monorepo featuring a **Spring Boot** backend and a **React + Vite** frontend. This project goes beyond a static site, incorporating a production-grade **RAG (Retrieval-Augmented Generation) AI Chatbot** and a secure **Admin Dashboard** for content management.

## 🚀 Key Features

### 🤖 AI-Powered RAG Chatbot
- **Context-Aware Assistance**: Uses Spring AI and Google Gemini to answer questions about the portfolio owner's experience.
- **Intelligent Routing**: Dynamically routes queries to the appropriate knowledge context.
- **Efficient Retrieval**: Implements a RAG pipeline to minimize LLM token usage while providing accurate responses.

### 🔐 Multi-Role Admin Dashboard
- **Content Management**: Full CRUD operations for Projects, Skills, Education, and Achievements.
- **Secure Access**: Protected by JWT-based authentication and Spring Security.
- **Dynamic Updates**: Changes in the admin panel reflect instantly on the public-facing portfolio.

### 🎨 Modern Responsive UI
- **Tech Stack**: Built with Tailwind CSS and shadcn/ui for a premium, accessible user experience.
- **Data Visualization**: Integrated Recharts for skills and experience metrics.
- **Dark Mode**: Native support for themed viewing.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS & shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form & Zod Validation
- **Navigation**: React Router 6

### Backend
- **Framework**: Spring Boot 3.3 (Java 17)
- **Security**: Spring Security & JWT
- **Database**: PostgreSQL (Neon) with Spring Data JPA
- **AI Integration**: Spring AI & Google Gemini API
- **Utilities**: Lombok, Jackson, Paul Schwarz Dotenv

## 📂 Project Structure

```bash
.
├── backend          # Spring Boot API
│   ├── src          # Core logic (AI, Security, Controllers, Services)
│   └── pom.xml      # Maven configuration
├── frontend         # React Application
│   ├── src          # Components, Pages, Admin Panel
│   └── package.json # NPM configuration
└── README.md        # This file
```

## ⚙️ Getting Started

### Prerequisites
- JDK 17+
- Node.js 18+
- PostgreSQL Database (Local or Cloud)
- Google Gemini API Key (for AI features)

### Environment Setup

#### Backend (`/backend/.env`)
```env
DATABASE_URL=your_db_url
GOOGLE_GENAI_API_KEY=your_gemini_key
JWT_SECRET=your_jwt_secret
```

#### Frontend (`/frontend/.env`)
```env
VITE_API_URL=http://localhost:8080
```

### Quick Start

1.  **Clone the Repo**
    ```bash
    git clone https://github.com/kalyansadhukhan/Kalyan-Portfolio.git
    cd Kalyan-Portfolio
    ```

2.  **Start the Backend**
    ```bash
    cd backend
    ./mvnw spring-boot:run
    ```

3.  **Start the Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Built with ❤️ by [Kalyan Sadhukhan](https://github.com/kalyansadhukhan)*
