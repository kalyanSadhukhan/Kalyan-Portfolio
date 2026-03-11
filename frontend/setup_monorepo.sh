#!/bin/bash
set -e

# Define paths
MONOREPO_PATH="../Kalyan-Portfolio"
FRONTEND_PATH="../kalyan-dev"
BACKEND_PATH="../portfolio-backend"
REPO_URL="https://github.com/kalyanSadhukhan/Kalyan-Portfolio.git"

echo "Creating monorepo folder..."
rm -rf "$MONOREPO_PATH"
mkdir -p "$MONOREPO_PATH"
cd "$MONOREPO_PATH"

echo "Initializing git..."
git init

echo "Copying frontend..."
mkdir -p frontend
rsync -a --exclude 'node_modules' --exclude '.git' --exclude 'dist' --exclude '.DS_Store' "$FRONTEND_PATH/" ./frontend/

echo "Copying backend..."
mkdir -p backend
rsync -a --exclude 'target' --exclude '.git' --exclude '.idea' --exclude '.DS_Store' "$BACKEND_PATH/" ./backend/

echo "Creating root README..."
cat << 'README_EOF' > README.md
# Kalyan Portfolio

This repository is a monorepo containing the modern personal portfolio website built to showcase projects, skills, and professional experience.

## Repository Structure

- `/frontend` - React, TypeScript, Vite, Tailwind CSS, shadcn/ui.
- `/backend` - Spring Boot backend API with H2 Database and JWT Authentication.

## Getting Started

### Frontend
```sh
cd frontend
npm install
npm run dev
```

### Backend
```sh
cd backend
./mvnw spring-boot:run
```
README_EOF

echo "Creating root .gitignore..."
cat << 'GITIGNORE_EOF' > .gitignore
# System
.DS_Store
.idea/
.vscode/

# Ignore node_modules array
node_modules/

# Environment
.env
.env.local
.env.*.local
GITIGNORE_EOF

echo "Committing..."
git add .
git commit -m "Initial commit: Combine frontend and backend into monorepo"
git branch -M main

echo "Adding remote and pushing..."
git remote add origin "$REPO_URL"

# Try pushing with HTTPS
if git push -u origin main; then
  echo "Push with HTTPS successful."
else
  echo "HTTPS push failed, trying SSH..."
  git remote set-url origin "git@github.com:kalyanSadhukhan/Kalyan-Portfolio.git"
  git push -u origin main
fi
