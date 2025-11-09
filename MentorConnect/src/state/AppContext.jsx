import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import mentorsData from '../data/mentors'
import studentsData from '../data/students'
import initialMessages from '../data/messages'
import { studentsAPI, mentorsAPI, messagesAPI, goalsAPI, requestsAPI, ratingsAPI, sessionsAPI, aiAPI } from '../services/api'

const AppContext = createContext(null)

export function AppProvider({ children }){
  const [user, setUser] = useState(null)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const [mentors, setMentors] = useState(mentorsData)
  const [students, setStudents] = useState(studentsData)
  const [messages, setMessages] = useState(initialMessages)
  const [goals, setGoals] = useState([
    { id: 'g1', title: 'Land an internship', progress: 60, milestones: [
      { id: 'm1', text: 'Update resume', done: true },
      { id: 'm2', text: 'Apply to 10 roles', done: true },
      { id: 'm3', text: 'Mock interview practice', done: false },
    ]},
  ])
  const [requests, setRequests] = useState([])
  const [ratings, setRatings] = useState([])
  const [sessions, setSessions] = useState([])
  const [assistantBusy, setAssistantBusy] = useState(false)

  // Load data from backend on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [mentorsData, studentsData, messagesData, goalsData, requestsData, ratingsData, sessionsData] = await Promise.all([
          mentorsAPI.getAll(),
          studentsAPI.getAll(),
          messagesAPI.getAll(),
          goalsAPI.getAll(),
          requestsAPI.getAll(),
          ratingsAPI.getAll(),
          sessionsAPI.getAll()
        ])
        if (mentorsData.length) setMentors(mentorsData)
        if (studentsData.length) setStudents(studentsData)
        if (messagesData.length) setMessages(messagesData)
        if (goalsData.length) setGoals(goalsData)
        if (requestsData.length) setRequests(requestsData)
        if (ratingsData.length) setRatings(ratingsData)
        if (sessionsData.length) setSessions(sessionsData)
      } catch (error) {
        console.error('Failed to load data from backend:', error)
      }
    }
    loadData()
  }, [])

  // Real-time message polling - refresh messages every 2 seconds
  useEffect(() => {
    const pollMessages = async () => {
      try {
        const messagesData = await messagesAPI.getAll()
        setMessages(messagesData)
      } catch (error) {
        console.error('Failed to poll messages:', error)
      }
    }

    // Poll every 2 seconds for new messages
    const interval = setInterval(pollMessages, 2000)
    
    return () => clearInterval(interval)
  }, [])

  const sendMessage = async (peerId, text) => {
    if (!user) return
    try {
      const result = await messagesAPI.send(user.id, peerId, text)
      setMessages(prev => [...prev, result.data])
      return { success: true }
    } catch (error) {
      console.error('Failed to send message:', error)
      
      // Check if it's an institute mismatch error
      if (error.message && error.message.includes('different institutes')) {
        throw new Error('Cannot send messages to users from different institutes')
      }
      
      // For other errors, fallback to local state
      const threadId = [user.id, peerId].sort().join('-')
      const entry = { id: Date.now().toString(), threadId, from: user.id, to: peerId, text, ts: new Date().toISOString() }
      setMessages(prev => [...prev, entry])
      return { success: true, offline: true }
    }
  }

  const deleteMessage = async (messageId) => {
    try {
      await messagesAPI.delete(messageId)
      setMessages(prev => prev.filter(m => m.id !== messageId))
      return { success: true }
    } catch (error) {
      console.error('Failed to delete message:', error)
      throw error
    }
  }

  const askAssistant = async ({ threadId, message }) => {
    if (!message || !message.trim()) return
    setAssistantBusy(true)

    try {
      const history = messages
        .filter(m => m.threadId === threadId)
        .sort((a, b) => new Date(a.ts) - new Date(b.ts))
        .map(m => ({ role: m.from === user?.id ? 'user' : 'assistant', content: m.text }))

      const response = await aiAPI.chat({
        message,
        history,
        threadId,
        userId: user?.id,
      })

      const aiEntry = {
        id: response.messageId,
        threadId,
        from: 'ai-assistant',
        to: user?.id || 'anonymous',
        text: response.reply,
        ts: response.createdAt,
        meta: { ai: true },
      }

      setMessages(prev => [...prev, aiEntry])
      return { success: true, reply: response.reply }
    } catch (error) {
      console.error('Failed to contact AI assistant:', error)
      throw error
    } finally {
      setAssistantBusy(false)
    }
  }

  const addGoal = async (title) => {
    try {
      if (user) {
        const result = await goalsAPI.add(title, user.id)
        setGoals(prev => [...prev, result.goal])
      }
    } catch (error) {
      console.error('Failed to add goal:', error)
      // Fallback to local state
      const id = 'g' + Date.now()
      setGoals(prev => [...prev, { id, title, progress: 0, milestones: [] }])
    }
  }

  const addMilestone = (goalId, text) => {
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, milestones: [...g.milestones, { id: 'm'+Date.now(), text, done: false }] } : g))
  }

  const toggleMilestone = (goalId, milestoneId) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g
      const milestones = g.milestones.map(m => m.id === milestoneId ? { ...m, done: !m.done } : m)
      const doneCount = milestones.filter(m => m.done).length
      const progress = milestones.length ? Math.round((doneCount / milestones.length) * 100) : g.progress
      return { ...g, milestones, progress }
    }))
  }

  const deleteMilestone = (goalId, milestoneId) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g
      const milestones = g.milestones.filter(m => m.id !== milestoneId)
      const doneCount = milestones.filter(m => m.done).length
      const progress = milestones.length ? Math.round((doneCount / milestones.length) * 100) : g.progress
      return { ...g, milestones, progress }
    }))
  }

  const deleteGoal = async (goalId) => {
    try {
      if (user) {
        await goalsAPI.delete(goalId)
      }
      setGoals(prev => prev.filter(g => g.id !== goalId))
      return { success: true }
    } catch (error) {
      console.error('Failed to delete goal:', error)
      // Fallback to local state
      setGoals(prev => prev.filter(g => g.id !== goalId))
      return { success: true, offline: true }
    }
  }

  const requestMentorship = async (mentorId) => {
    if (!user) return
    const exists = requests.find(r => r.mentorId === mentorId && r.studentId === user.id)
    if (exists) return
    try {
      const result = await requestsAPI.create(mentorId, user.id)
      setRequests(prev => [...prev, result.request])
      return { success: true }
    } catch (error) {
      console.error('Failed to create request:', error)
      // Fallback to local state
      setRequests(prev => [...prev, { id: 'req_'+Date.now(), mentorId, studentId: user.id, status: 'pending', createdAt: new Date().toISOString() }])
      return { success: true, offline: true }
    }
  }

  const acceptRequest = async (requestId) => {
    try {
      const result = await requestsAPI.updateStatus(requestId, 'accepted')
      setRequests(prev => prev.map(r => r.id === requestId ? result.request : r))
      return { success: true }
    } catch (error) {
      console.error('Failed to accept request:', error)
      throw error
    }
  }

  const rejectRequest = async (requestId) => {
    try {
      const result = await requestsAPI.updateStatus(requestId, 'rejected')
      setRequests(prev => prev.map(r => r.id === requestId ? result.request : r))
      return { success: true }
    } catch (error) {
      console.error('Failed to reject request:', error)
      throw error
    }
  }

  const submitRating = async (toId, rating, comment, toRole) => {
    if (!user) return
    try {
      const result = await ratingsAPI.submit(user.id, toId, rating, comment, user.role, toRole)
      setRatings(prev => {
        const existingIndex = prev.findIndex(r => r.fromId === user.id && r.toId === toId)
        if (existingIndex !== -1) {
          const updated = [...prev]
          updated[existingIndex] = result.rating
          return updated
        }
        return [...prev, result.rating]
      })
      return { success: true }
    } catch (error) {
      console.error('Failed to submit rating:', error)
      throw error
    }
  }

  const scheduleSession = async ({ studentId, scheduledAt, topic, duration, meetingLink, notes }) => {
    if (!user || user.role !== 'mentor') {
      throw new Error('Only mentors can schedule sessions')
    }

    try {
      const payload = {
        mentorId: user.id,
        studentId,
        scheduledAt,
        topic,
        duration,
        meetingLink,
        notes,
      }

      const result = await sessionsAPI.create(payload)
      setSessions(prev => [...prev, result.session])
      return { success: true, session: result.session }
    } catch (error) {
      console.error('Failed to schedule session:', error)
      throw error
    }
  }

  // Auth actions
  const loginStudent = (studentId) => {
    const s = students.find(x => x.id === studentId) || { id: studentId, name: 'Student', interests: [], skills: [] }
    setUser({ id: s.id, role: 'student', name: s.name })
  }

  const loginMentor = (mentorId) => {
    const m = mentors.find(x => x.id === mentorId) || { id: mentorId, name: 'Mentor' }
    setUser({ id: m.id, role: 'mentor', name: m.name })
  }

  const logout = () => setUser(null)

  // Registration actions
  const registerStudent = async (studentData) => {
    try {
      const result = await studentsAPI.register(studentData)
      setStudents(prev => [...prev, result.student])
      setUser({ id: result.student.id, role: 'student', name: result.student.name })
      return result
    } catch (error) {
      console.error('Failed to register student:', error)
      // Fallback to local state
      const newId = 'stu_' + Date.now()
      const newStudent = { id: newId, ...studentData }
      setStudents(prev => [...prev, newStudent])
      setUser({ id: newId, role: 'student', name: studentData.name })
      throw error
    }
  }

  const registerMentor = async (mentorData) => {
    try {
      const result = await mentorsAPI.register(mentorData)
      setMentors(prev => [...prev, result.mentor])
      setUser({ id: result.mentor.id, role: 'mentor', name: result.mentor.name })
      return result
    } catch (error) {
      console.error('Failed to register mentor:', error)
      // Fallback to local state
      const newId = 'm' + Date.now()
      const newMentor = { id: newId, ...mentorData }
      setMentors(prev => [...prev, newMentor])
      setUser({ id: newId, role: 'mentor', name: mentorData.name })
      throw error
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev
      localStorage.setItem('darkMode', JSON.stringify(next))
      return next
    })
  }

  // Delete profile actions
  const deleteStudentProfile = async (studentId) => {
    try {
      await studentsAPI.delete(studentId)
      setStudents(prev => prev.filter(s => s.id !== studentId))
      if (user && user.id === studentId) {
        setUser(null)
      }
      return { success: true }
    } catch (error) {
      console.error('Failed to delete student profile:', error)
      throw error
    }
  }

  const deleteMentorProfile = async (mentorId) => {
    try {
      await mentorsAPI.delete(mentorId)
      setMentors(prev => prev.filter(m => m.id !== mentorId))
      if (user && user.id === mentorId) {
        setUser(null)
      }
      return { success: true }
    } catch (error) {
      console.error('Failed to delete mentor profile:', error)
      throw error
    }
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const value = useMemo(() => ({
    user, setUser,
    mentors, students,
    messages, sendMessage, deleteMessage,
    goals, addGoal, addMilestone, toggleMilestone, deleteMilestone,
    requests, requestMentorship, acceptRequest, rejectRequest,
    ratings, submitRating,
    sessions, scheduleSession,
    assistantBusy, askAssistant,
    loginStudent, loginMentor, logout,
    registerStudent, registerMentor,
    deleteStudentProfile, deleteMentorProfile,
    darkMode, toggleDarkMode,
  }), [user, mentors, students, messages, goals, requests, ratings, sessions, assistantBusy, darkMode])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
