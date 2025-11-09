import { useMemo, useState } from 'react'
import { useApp } from '../state/AppContext'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, User, CheckCircle, XCircle, Video, Trash2, PlusCircle, ExternalLink } from 'lucide-react'

export default function MentorDashboard(){
  const { requests, mentors, students, user, deleteMentorProfile, acceptRequest, rejectRequest, sessions, scheduleSession } = useApp()
  const navigate = useNavigate()
  const currentMentor = user && user.role === 'mentor' && mentors.find(m => m.id === user.id)

  if (!user || user.role !== 'mentor') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="card p-8 text-center space-y-4">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Mentor Dashboard Restricted</h1>
          <p className="text-slate-600 dark:text-slate-400">
            This dashboard is available only to mentors. {user ? 'Switch to your mentor account to continue.' : 'Please sign in as a mentor to continue.'}
          </p>
          <button
            onClick={() => navigate(user && user.role === 'student' ? '/student-dashboard' : '/')}
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: 60,
    topic: '',
    meetingLink: '',
    notes: ''
  })

  const studentsWithAcceptedRequests = useMemo(() => {
    if (!currentMentor) return []
    return requests
      .filter(r => r.mentorId === currentMentor.id && r.status === 'accepted')
      .map(r => students.find(s => s.id === r.studentId))
      .filter(Boolean)
  }, [requests, students, currentMentor])

  const upcomingSessions = useMemo(() => {
    if (!currentMentor) return []
    return sessions
      .filter(session => session.mentorId === currentMentor.id)
      .map(session => {
        const student = students.find(s => s.id === session.studentId)
        return {
          ...session,
          studentName: student ? student.name : session.studentId,
          formattedDate: new Date(session.scheduledAt).toLocaleString()
        }
      })
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
  }, [sessions, currentMentor, students])
  
  // Filter requests to only show students from the same institute and add student details
  const filteredRequests = requests
    .filter(r => {
      if (!currentMentor || r.mentorId !== currentMentor.id) return false
      if (!currentMentor.institute || currentMentor.institute.trim() === '') return true
      const student = students.find(s => s.id === r.studentId)
      if (!student || !student.institute || student.institute.trim() === '') return false
      return student.institute.toLowerCase().trim() === currentMentor.institute.toLowerCase().trim()
    })
    .map(r => {
      const student = students.find(s => s.id === r.studentId)
      return {
        ...r,
        studentName: student ? `${student.name}${student.institute ? ` (${student.institute})` : ''}` : r.studentId,
        date: new Date(r.createdAt).toLocaleString()
      }
    })
  
  const handleDeleteProfile = async () => {
    if (!user) return
    
    const confirmed = window.confirm(
      'Are you sure you want to delete your mentor profile? This action cannot be undone. All your data, sessions, and messages will be permanently deleted.'
    )
    
    if (confirmed) {
      try {
        await deleteMentorProfile(user.id)
        alert('Your profile has been deleted successfully.')
        navigate('/')
      } catch (error) {
        alert('Failed to delete profile. Please try again.')
      }
    }
  }

  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptRequest(requestId)
      alert('Mentorship request accepted!')
    } catch (error) {
      alert('Failed to accept request. Please try again.')
    }
  }

  const handleRejectRequest = async (requestId) => {
    const confirmed = window.confirm('Are you sure you want to decline this mentorship request?')
    if (confirmed) {
      try {
        await rejectRequest(requestId)
        alert('Mentorship request declined.')
      } catch (error) {
        alert('Failed to decline request. Please try again.')
      }
    }
  }

  const handleOpenModal = () => {
    if (studentsWithAcceptedRequests.length === 0) {
      alert('You need to have an accepted mentorship request before scheduling a session.')
      return
    }
    setSelectedStudentId(studentsWithAcceptedRequests[0]?.id || '')
    setFormData({ date: '', time: '', duration: 60, topic: '', meetingLink: '', notes: '' })
    setModalOpen(true)
  }

  const handleScheduleSession = async (e) => {
    e.preventDefault()
    if (!selectedStudentId) {
      alert('Please select a student')
      return
    }
    if (!formData.date || !formData.time) {
      alert('Please select date and time')
      return
    }
    const scheduledAt = new Date(`${formData.date}T${formData.time}:00`)
    try {
      await scheduleSession({
        studentId: selectedStudentId,
        scheduledAt: scheduledAt.toISOString(),
        topic: formData.topic,
        duration: Number(formData.duration),
        meetingLink: formData.meetingLink,
        notes: formData.notes
      })
      alert('Session scheduled successfully!')
      setModalOpen(false)
    } catch (error) {
      alert(error.message || 'Failed to schedule session.')
    }
  }
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      {user && currentMentor && (
        <div className="card p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome, {currentMentor.name}!</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {currentMentor.title}
              {currentMentor.institute && <span> • {currentMentor.institute}</span>}
              <span> • {currentMentor.email}</span>
            </p>
          </div>
          <button
            onClick={handleDeleteProfile}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
          >
            <Trash2 size={16} />
            Delete Profile
          </button>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your mentorship requests and sessions
            {currentMentor && currentMentor.institute && (
              <span className="ml-2 text-primary-600 dark:text-primary-400 font-medium">
                • {currentMentor.institute} students only
              </span>
            )}
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Student Requests */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User size={20} className="text-primary-600" />
              Student Requests
            </h2>
            <span className="chip bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">{filteredRequests.length} total</span>
          </div>
          <div className="space-y-3">
            {filteredRequests.length === 0 && (
              <div className="card p-6 text-center text-slate-600 dark:text-slate-300">
                <p>No mentorship requests yet.</p>
                <p className="text-sm mt-2">Requests from students will appear here.</p>
              </div>
            )}
            {filteredRequests.map(r => (
              <div key={r.id} className="card p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{r.studentName || r.studentId}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{r.topic || 'General mentorship request'}</p>
                  </div>
                  <span className={`chip text-xs ${
                    r.status === 'accepted' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    r.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>{r.status}</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-300 flex items-center gap-1">
                    <Clock size={12} />
                    {r.date}
                  </span>
                  {r.status === 'pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAcceptRequest(r.id)} 
                        className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-xs rounded-lg transition-colors flex items-center gap-1"
                      >
                        <CheckCircle size={14} />
                        Accept
                      </button>
                      <button 
                        onClick={() => handleRejectRequest(r.id)} 
                        className="px-3 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs rounded-lg transition-colors flex items-center gap-1"
                      >
                        <XCircle size={14} />
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Scheduled Sessions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar size={20} className="text-tealish-500" />
              Scheduled Sessions
            </h2>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-3 py-1.5 bg-tealish-500 hover:bg-tealish-600 text-white rounded-lg text-sm"
            >
              <PlusCircle size={16} />
              Schedule Session
            </button>
          </div>
          <div className="space-y-3">
            {upcomingSessions.length === 0 ? (
              <div className="card p-6 text-center text-slate-600 dark:text-slate-300">
                <p>No scheduled sessions yet.</p>
                <p className="text-sm mt-2">Use the "Schedule Session" button to plan your next mentorship session.</p>
              </div>
            ) : (
              upcomingSessions.map(session => (
                <div key={session.id} className="card p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{session.topic || 'Mentorship Session'}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                        With {session.studentName}
                      </p>
                    </div>
                    <span className="chip bg-tealish-500/10 text-tealish-600 dark:text-tealish-400 text-xs">{session.status}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {session.formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {session.duration || 60} minutes
                    </span>
                    {session.meetingLink && (
                      <a
                        href={session.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        <ExternalLink size={14} /> Join link
                      </a>
                    )}
                  </div>
                  {session.notes && (
                    <p className="text-sm text-slate-500 dark:text-slate-300 border-t pt-2">
                      Notes: {session.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b dark:border-slate-700">
              <h2 className="text-lg font-semibold">Schedule a Session</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleScheduleSession}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student</label>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
                >
                  {studentsWithAcceptedRequests.map(student => (
                    <option key={student.id} value={student.id}>{student.name}{student.institute ? ` (${student.institute})` : ''}</option>
                  ))}
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={formData.duration}
                    onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meeting Link (optional)</label>
                  <input
                    type="url"
                    value={formData.meetingLink}
                    onChange={e => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
                    placeholder="https://..."
                    className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Session Topic</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={e => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="e.g., Resume Review, Mock Interview"
                  className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows="3"
                  className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
                  placeholder="Share prep work or agenda for this session"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-tealish-500 hover:bg-tealish-600 text-white"
                >
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
