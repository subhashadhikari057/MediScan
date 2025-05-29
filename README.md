# 🩺 MediScan - AI-Powered Healthcare Platform
# Full-stack healthcare web application with AI-based features.

## 📘 Project Info
project:
  name: MediScan
  description: AI-Powered Healthcare Platform connecting users with verified doctors.
  tagline: Full-stack app with AI-powered symptom checker and appointment management.
  author: Subhash Adhikari
  made_with: "❤️ and React"

## 🚀 Features

features:

  # 🔐 Authentication & Authorization
  authentication_and_authorization:
    - JWT-based login & signup
    - Google Sign-In with profile completion
    - Role-based access: user, doctor, admin

  # 👤 User Features
  user_features:
    - Search and view verified doctors
    - Book, view, and cancel appointments
    - AI-powered Symptom Checker
    - Editable profile with medical history

  # 🩺 Doctor Features
  doctor_features:
    - Manage appointments (reschedule, status update)
    - View patient medical details (if shared)
    - Public doctor profile and discovery

  # 🛠️ Admin Features
  admin_features:
    - Role-based dashboards: Admin, Doctor, User
    - Manage users and doctors (view, delete, edit)
    - Reschedule or cancel any appointment
    - View platform statistics

  # 🧠 AI Integrations
  ai_features:
    - Symptom Checker using OpenAI LLMs
    - HealthScanner for lab report analysis
    - OCR support for document text extraction

## 🛠️ Tech Stack

tech_stack:
  frontend: React.js + TailwindCSS
  backend: Node.js + Express
  database: MongoDB Atlas
  authentication: JWT + Firebase (Google Auth)
  ai_services: OpenAI GPT

## 📁 Project Structure

project_structure:
  client:
    - src/
    - components/
    - pages/
    - utils/
  server:
    - controllers/
    - routes/
    - models/
    - middlewares/

## 🔧 Setup Instructions

setup_instructions:

  # ✅ Prerequisites
  prerequisites:
    - Node.js v18+
    - MongoDB Atlas account
    - Firebase project for Google Auth
    - OpenAI API Key

  # 1️⃣ Backend Setup
  backend:
    commands:
      - cd server
      - npm install
      - touch .env
    env_variables:
      - PORT=5000
      - MONGO_URI=your_mongodb_uri
      - JWT_SECRET=your_jwt_secret
      - OPENROUTER_API_KEY=your_openai_api_key
      - OCR_SPACE_API_KEY=your_ocr_api_key
    run: npm run dev

  # 2️⃣ Frontend Setup
  frontend:
    commands:
      - cd client
      - npm install
      - touch .env
    env_variables:
      - REACT_APP_API_URL=http://localhost:5000
      - REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
      - REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
    run: npm start

## 📌 Future Roadmap

roadmap:
  - Skin disease detection from images
  - Email/SMS appointment reminders
  - PDF export of medical reports
