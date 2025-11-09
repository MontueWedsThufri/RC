# MentorConnect Backend Setup Guide

## 🚀 Complete Backend Integration

This guide will help you set up the Node.js backend for your MentorConnect hackathon project.

## 📁 Project Structure

```
MentorConnect/
├── server/
│   ├── server.js           # Backend API server
│   ├── package.json        # Backend dependencies
│   └── data/               # JSON data storage (auto-created)
│       ├── students.json
│       ├── mentors.json
│       ├── messages.json
│       ├── goals.json
│       └── requests.json
├── src/
│   ├── services/
│   │   └── api.js          # Frontend API service
│   └── ...
└── package.json            # Frontend dependencies
```

## 🔧 Installation Steps

### Step 1: Install Backend Dependencies

```bash
# Navigate to the server directory
cd server

# Install required packages
npm install
```

### Step 2: Start the Backend Server

```bash
# From the server directory
npm start
```

You should see:
```
✅ Server running on http://localhost:5000
📁 Data stored in: [path]/server/data
```

### Step 3: Start the Frontend (in a new terminal)

```bash
# Navigate back to the main directory
cd ..

# Start the frontend
npm run dev
```

## 🎯 How It Works

### Data Persistence
All registration and login data is automatically saved to JSON files in the `server/data/` folder:

- **students.json** - All student registrations
- **mentors.json** - All mentor registrations  
- **messages.json** - Chat messages
- **goals.json** - Student goals
- **requests.json** - Mentorship requests

### API Endpoints

#### Students
- `GET /api/students` - Get all students
- `POST /api/students/register` - Register new student
- `POST /api/students/login` - Student login

#### Mentors
- `GET /api/mentors` - Get all mentors
- `POST /api/mentors/register` - Register new mentor
- `POST /api/mentors/login` - Mentor login

#### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send message

#### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Add goal
- `PUT /api/goals/:id` - Update goal

#### Requests
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create mentorship request

## 📝 Testing Your Backend

### 1. Register a Student
Go to: http://localhost:5174/register-student
Fill the form and submit. Check `server/data/students.json` to see the saved data!

### 2. Register a Mentor
Go to: http://localhost:5174/register-mentor
Fill the form and submit. Check `server/data/mentors.json`!

### 3. View All Data
Open the JSON files in `server/data/` to see all stored information.

## 🛠️ Troubleshooting

### Backend not starting?
- Make sure you're in the `server` directory
- Run `npm install` first
- Check if port 5000 is available

### Frontend can't connect to backend?
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify CORS is enabled (already configured)

### Data not saving?
- Check `server/data/` folder exists (auto-created)
- Look at server console for error messages
- Ensure backend is running

## 🏆 For Your Hackathon Demo

1. **Start backend first**: `cd server && npm start`
2. **Start frontend**: `npm run dev` (in main directory)
3. **Show data persistence**: 
   - Register a student/mentor
   - Open the JSON files to show stored data
   - Login with the registered account
   - Show that data persists even after refresh!

## 📦 Dependencies Installed

### Backend (server/package.json)
- `express` - Web server framework
- `cors` - Enable cross-origin requests
- `nodemon` - Auto-restart server (dev only)

### Frontend (already has)
- React, Vite, TailwindCSS, etc.

## ✨ Features Implemented

✅ Student Registration & Login
✅ Mentor Registration & Login
✅ Message Sending
✅ Goal Tracking
✅ Mentorship Requests
✅ Data Persistence (JSON files)
✅ API Integration
✅ Error Handling & Fallbacks

## 🎓 Hackathon Tips

- **Show the JSON files** during demo to prove data persistence
- **Highlight the API endpoints** in your presentation
- **Mention scalability** - easy to switch from JSON to MongoDB later
- **Emphasize full-stack** - React frontend + Node.js backend
- **Show error handling** - graceful fallbacks if backend is down

Good luck with your hackathon! 🚀
