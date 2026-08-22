# ❤️ AI Health & Fitness Assistant

An AI-powered web application designed to help users manage their basic health and fitness information in one place.

The application provides tools for BMI calculation, health record management, AI-powered health assistance, fitness tips, user profiles, and emergency information.

---

## 🌐 Live Demo

🔗 **Live Website:**  
https://ai-health-fitness-assistant.onrender.com

> Note: The application is deployed for demonstration purposes. The free hosting service may take some time to wake up when the application has been inactive.

---

## 📌 Project Overview

Managing health and fitness information can become difficult when different tools are used for different purposes.

The **AI Health & Fitness Assistant** provides a single platform where users can:

- Create an account and securely log in
- Calculate and track BMI
- Store and manage health records
- Ask health and fitness-related questions to an AI assistant
- View personalized fitness tips
- Manage basic profile information
- Access emergency information
- View health information from a central dashboard

The application combines a web interface, backend APIs, MongoDB database, and Google's Gemini API to provide these features.

---

## ✨ Features

### 🔐 User Authentication

- User registration
- User login
- Password protection using hashing
- Logout functionality
- User session information using Local Storage

### ⚖️ BMI Calculator

- Calculate Body Mass Index
- Display BMI value
- Determine BMI category
- Save BMI information
- View BMI history
- Display latest BMI on dashboard

### 📝 Health Records

Users can store and manage health information such as:

- Age
- Gender
- Blood group
- Medical conditions
- Allergies
- Medications
- Emergency contact
- Other health information

Users can:

- Create records
- View records
- Edit records
- Delete records

### 🤖 AI Health Coach

The application integrates Google's Gemini API to provide AI-powered health and fitness assistance.

The AI assistant can provide general information about:

- Exercise
- Fitness
- Nutrition
- Healthy lifestyle
- General wellness

The AI assistant can also use available user health information to provide more relevant responses.

> ⚠️ The AI assistant provides general informational guidance and is not a replacement for a qualified healthcare professional.

### 👤 My Profile

Users can view their basic account information including:

- Name
- Email
- Account status

### 💪 Fitness Tips

The fitness section provides guidance related to:

- Cardio
- Strength training
- Flexibility
- Nutrition
- Sleep and recovery
- Fitness consistency

It also includes a random fitness tip generator.

### 🚑 Emergency Information

Provides general emergency guidance and important emergency information for users in India.

The application includes:

**112 — India's integrated emergency number**

> For serious emergencies, users should contact emergency services or seek immediate professional medical care.

### 📊 Dashboard

The dashboard provides a central overview of:

- Latest BMI
- Health record availability
- AI Health Coach
- Quick access to application features

---

## 🛠️ Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### AI

- Google Gemini API
- `@google/generative-ai`

### Authentication & Security

- bcryptjs
- JSON Web Token
- dotenv
- CORS

### Deployment

- Render

---

## 📂 Project Structure

```text
AI-Health-Fitness-Assistant/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── bmiController.js
│   ├── chatController.js
│   └── healthController.js
│
├── models/
│   ├── User.js
│   ├── BMI.js
│   └── HealthRecord.js
│
├── routes/
│   ├── authRoutes.js
│   ├── bmiRoutes.js
│   ├── chatRoutes.js
│   └── healthRoutes.js
│
├── public/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── bmi.html
│   ├── records.html
│   ├── chat.html
│   ├── profile.html
│   ├── fitness.html
│   ├── emergency.html
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── dashboard.css
│   │   ├── bmi.css
│   │   ├── records.css
│   │   ├── chat.css
│   │   ├── profile.css
│   │   ├── fitness.css
│   │   └── emergency.css
│   │
│   └── js/
│       ├── login.js
│       ├── register.js
│       ├── dashboard.js
│       ├── bmi.js
│       ├── records.js
│       ├── chat.js
│       ├── profile.js
│       ├── fitness.js
│       └── emergency.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
