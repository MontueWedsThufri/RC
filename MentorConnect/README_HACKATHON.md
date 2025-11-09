# 🎓 MentorConnect - Complete Hackathon Project

## 🌟 Overview
MentorConnect is a full-stack web application connecting students with alumni mentors. Built with React + Node.js + JSON file storage.

## ✨ Features Implemented

### Frontend (React + TailwindCSS)
- ✅ Modern Landing Page with Hero, Features, Testimonials
- ✅ Student & Mentor Registration
- ✅ Student & Mentor Login
- ✅ Student Dashboard with Goals
- ✅ Mentor Dashboard with Requests & Sessions
- ✅ Mentor Matching Algorithm
- ✅ Real-time Messaging Interface
- ✅ Goal Tracking System
- ✅ AI Chatbot Assistant
- ✅ Dark Mode Toggle
- ✅ Responsive Design

### Backend (Node.js + Express)
- ✅ RESTful API Endpoints
- ✅ Student Registration & Authentication
- ✅ Mentor Registration & Authentication
- ✅ Data Persistence (JSON Files)
- ✅ Message Management
- ✅ Goal Tracking API
- ✅ Mentorship Request System
- ✅ CORS Enabled
- ✅ Error Handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)

### Installation

#### Option 1: Automated (Recommended)
```bash
# Double-click install-all.bat
# OR run:
./install-all.bat
```

#### Option 2: Manual
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Running the Application

#### Step 1: Start Backend Server
```bash
# Option A: Double-click start-backend.bat
# Option B: Run manually
cd server
npm start
```

Backend runs on: **http://localhost:5000**

#### Step 2: Start Frontend (New Terminal)
```bash
npm run dev
```

Frontend runs on: **http://localhost:5174**

## 📂 Project Structure

```
MentorConnect/
├── server/                     # Backend Server
│   ├── server.js              # Express API Server
│   ├── package.json           # Backend dependencies
│   └── data/                  # JSON Data Storage ⭐
│       ├── students.json      # All student registrations
│       ├── mentors.json       # All mentor registrations
│       ├── messages.json      # Chat messages
│       ├── goals.json         # Student goals
│       └── requests.json      # Mentorship requests
│
├── src/                       # Frontend Source
│   ├── components/           # React Components
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Chatbot.jsx
│   │   └── ...
│   ├── pages/                # Page Components
│   │   ├── Landing.jsx
│   │   ├── RegisterStudent.jsx
│   │   ├── RegisterMentor.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── MentorDashboard.jsx
│   │   └── ...
│   ├── services/             # API Integration
│   │   └── api.js           # Backend API calls
│   ├── state/               # State Management
│   │   └── AppContext.jsx
│   └── data/                # Mock Data (fallback)
│
└── public/                  # Static Assets
```

## 🎯 Key Functionalities

### 1. Student Flow
1. Register → `/register-student`
2. Login → `/login-student`
3. Dashboard → View goals, mentors, progress
4. Find Mentors → Browse and request mentorship
5. Messages → Chat with mentors
6. Goals → Track learning objectives

### 2. Mentor Flow
1. Register → `/register-mentor`
2. Login → `/login-mentor`
3. Dashboard → View requests & scheduled sessions
4. Accept/Decline Requests
5. Manage Sessions
6. Message Students

### 3. Data Persistence
All data is saved in JSON files located at `server/data/`:
- Registration details (name, email, skills, interests)
- Login sessions
- Messages
- Goals and milestones
- Mentorship requests

## 🔌 API Endpoints

### Students
- `POST /api/students/register` - Register student
- `POST /api/students/login` - Login student
- `GET /api/students` - Get all students

### Mentors
- `POST /api/mentors/register` - Register mentor
- `POST /api/mentors/login` - Login mentor
- `GET /api/mentors` - Get all mentors

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages` - Get all messages

### Goals
- `POST /api/goals` - Add goal
- `PUT /api/goals/:id` - Update goal
- `GET /api/goals` - Get all goals

### Requests
- `POST /api/requests` - Create request
- `GET /api/requests` - Get all requests

## 🏆 Hackathon Demo Tips

### 1. Show Registration
- Register a new student
- Open `server/data/students.json`
- Show the saved data in real-time!

### 2. Show Login Persistence
- Login with registered account
- Refresh page
- Show user stays logged in

### 3. Show Backend Integration
- Open browser DevTools (F12)
- Go to Network tab
- Perform actions (register, login)
- Show API calls being made

### 4. Highlight Features
- Modern UI with dark mode
- AI Chatbot
- Real-time data persistence
- Responsive design
- Matching algorithm

### 5. Show JSON Files
**This is your proof of backend integration!**
```
server/data/students.json
server/data/mentors.json
server/data/messages.json
server/data/goals.json
server/data/requests.json
```

## 🛠️ Technology Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router v6
- Lucide Icons
- Context API

### Backend
- Node.js
- Express.js
- File System (fs) for JSON storage
- CORS enabled

## 📊 Sample Data Files

After registration, your JSON files will look like:

**students.json:**
```json
[
  {
    "id": "stu_1699123456789",
    "name": "John Doe",
    "email": "john@example.com",
    "interests": ["AI", "Web Dev"],
    "skills": ["React", "Python"],
    "goals": ["Land internship"],
    "createdAt": "2025-11-09T08:30:00.000Z"
  }
]
```

**mentors.json:**
```json
[
  {
    "id": "m1699123456789",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "title": "Senior Software Engineer",
    "background": "IIT Delhi, Ex-Google",
    "skills": ["System Design", "React"],
    "interests": ["EdTech", "Startups"],
    "bio": "Passionate about mentoring...",
    "availability": "2 hrs/week",
    "rating": 0,
    "createdAt": "2025-11-09T08:35:00.000Z"
  }
]
```

## 🐛 Troubleshooting

### Backend won't start?
```bash
cd server
npm install
npm start
```

### Frontend can't connect?
- Check backend is running on port 5000
- Check browser console for errors
- Ensure CORS is working

### Port already in use?
- Backend: Change PORT in `server/server.js`
- Frontend: Change port in `vite.config.js`

### Data not saving?
- Check `server/data/` folder exists
- Look at server console logs
- Verify backend is running

## 📝 Evaluation Points

✅ **Full-Stack**: React frontend + Node.js backend
✅ **Database**: JSON file storage (easily upgradeable to MongoDB)
✅ **Authentication**: Login/Registration system
✅ **CRUD Operations**: Create, Read, Update data
✅ **API Integration**: RESTful endpoints
✅ **UI/UX**: Modern, responsive, accessible
✅ **Features**: Matching, Messaging, Goals, Chatbot
✅ **Code Quality**: Clean, organized, documented

## 🎥 Demo Script

1. **Start Backend** → Show terminal running
2. **Start Frontend** → Open in browser
3. **Register Student** → Fill form, submit
4. **Show JSON File** → Open students.json, show data
5. **Login** → Use registered credentials
6. **Browse Features** → Dashboard, matching, goals
7. **Register Mentor** → Show mentor flow
8. **Show Mentor Dashboard** → Requests, sessions
9. **Toggle Dark Mode** → Show theme switching
10. **Open Chatbot** → Ask questions, show responses

## 📧 Contact & Support

For hackathon queries, show this complete working project!

---

**Built for Hackathon** 🚀
**Good Luck!** 🎓
