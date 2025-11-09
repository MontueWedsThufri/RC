import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useApp } from '../state/AppContext'
import MentorCard from '../components/MentorCard'
import GoalTracker from '../components/GoalTracker'
import { rankMentors } from '../utils/matching'
import { Trash2, Star, Calendar, Clock, ExternalLink } from 'lucide-react'
import RatingModal from '../components/RatingModal'

export default function StudentDashboard(){
  const { user, mentors, students, deleteStudentProfile, requests, submitRating, sessions } = useApp()
  const navigate = useNavigate()
  const me = (user && user.role === 'student' && students.find(s => s.id === user.id)) || students[0]
  const recommended = rankMentors(me, mentors).slice(0,3)
  
  const [ratingModalOpen, setRatingModalOpen] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState(null)
  
  // Get accepted mentorship requests for this student
  const acceptedMentorships = user && user.role === 'student'
    ? requests
        .filter(r => r.studentId === user.id && r.status === 'accepted')
        .map(r => mentors.find(m => m.id === r.mentorId))
        .filter(Boolean)
    : []

  const upcomingSessions = useMemo(() => {
    if (!user || user.role !== 'student') return []
    return sessions
      .filter(session => session.studentId === user.id)
      .map(session => {
        const mentor = mentors.find(m => m.id === session.mentorId)
        return {
          ...session,
          mentorName: mentor ? mentor.name : session.mentorId,
          formattedDate: new Date(session.scheduledAt).toLocaleString(),
        }
      })
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
  }, [sessions, user, mentors])

  const handleDeleteProfile = async () => {
    if (!user) return
    
    const confirmed = window.confirm(
      'Are you sure you want to delete your profile? This action cannot be undone. All your data, goals, and messages will be permanently deleted.'
    )
    
    if (confirmed) {
      try {
        await deleteStudentProfile(user.id)
        alert('Your profile has been deleted successfully.')
        navigate('/')
      } catch (error) {
        alert('Failed to delete profile. Please try again.')
      }
    }
  }

  const handleOpenRatingModal = (mentor) => {
    setSelectedMentor(mentor)
    setRatingModalOpen(true)
  }

  const handleSubmitRating = async (rating, comment) => {
    if (!selectedMentor) return
    await submitRating(selectedMentor.id, rating, comment, 'mentor')
    alert(`Thank you for rating ${selectedMentor.name}!`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      {user && (
        <div className="card p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome, {me.name}!</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {me.institute && <span>{me.institute} • </span>}
              {me.email}
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
      <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Recommended mentors</h2>
            {me.institute && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                From {me.institute}
              </p>
            )}
          </div>
          <Link to="/matching" className="text-primary-700 dark:text-primary-400 text-sm hover:underline">View all</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {recommended.map(m => <MentorCard key={m.id} mentor={m} />)}
        </div>
        {recommended.length === 0 && me.institute && (
          <div className="card p-4 text-slate-600 dark:text-slate-400 text-center">
            <p>No mentors from {me.institute} found yet.</p>
            <p className="text-sm mt-2">Be the first to invite alumni mentors from your college!</p>
          </div>
        )}
        
        {/* My Mentors - Accepted Mentorships */}
        {acceptedMentorships.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">My Mentors</h2>
            <div className="space-y-3">
              {acceptedMentorships.map(mentor => (
                <div key={mentor.id} className="card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary-600 text-white text-lg font-bold grid place-items-center">
                      {mentor.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{mentor.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{mentor.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenRatingModal(mentor)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm"
                  >
                    <Star size={16} />
                    Rate Mentor
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Upcoming Sessions */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
            <span className="chip bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
              {upcomingSessions.length} scheduled
            </span>
          </div>
          {upcomingSessions.length === 0 ? (
            <div className="card p-6 text-center text-slate-600 dark:text-slate-400">
              <p>No sessions scheduled yet.</p>
              <p className="text-sm mt-2">Accepted mentors will schedule sessions for you here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map(session => (
                <div key={session.id} className="card p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{session.topic || 'Mentorship Session'}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                        With {session.mentorName}
                      </p>
                    </div>
                    <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">{session.status}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
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
                    <p className="text-sm text-slate-500 dark:text-slate-400 border-t pt-2">
                      Notes: {session.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Active mentorship progress</h2>
          <div className="card p-4 text-slate-600 dark:text-slate-400">{user? 'Start a mentorship to see progress here.' : 'Login as a student to track your mentorship progress.'}</div>
        </div>
      </div>
      <aside className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Goals</h2>
          <Link to="/goals" className="text-sm text-primary-700">Open</Link>
        </div>
        <GoalTracker />
      </aside>
      </div>
      
      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        onSubmit={handleSubmitRating}
        targetName={selectedMentor?.name || ''}
        targetRole="mentor"
      />
    </div>
  )
}
