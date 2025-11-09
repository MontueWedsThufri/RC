import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import StudentDashboard from './pages/StudentDashboard'
import MentorDashboard from './pages/MentorDashboard'
import Matching from './pages/Matching'
import MentorProfile from './pages/MentorProfile'
import Messages from './pages/Messages'
import Goals from './pages/Goals'
import { useApp } from './state/AppContext'
import LoginStudent from './pages/LoginStudent'
import LoginMentor from './pages/LoginMentor'
import RegisterStudent from './pages/RegisterStudent'
import RegisterMentor from './pages/RegisterMentor'

export default function App() {
  const { user } = useApp()
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login-student" element={<LoginStudent />} />
          <Route path="/login-mentor" element={<LoginMentor />} />
          <Route path="/register-student" element={<RegisterStudent />} />
          <Route path="/register-mentor" element={<RegisterMentor />} />
          <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/mentor" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />
          <Route path="/matching" element={<ProtectedRoute><Matching /></ProtectedRoute>} />
          <Route path="/mentor/:id" element={<ProtectedRoute><MentorProfile /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
