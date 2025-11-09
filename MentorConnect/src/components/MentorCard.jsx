import { Link } from 'react-router-dom'
import { Star, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useApp } from '../state/AppContext'
import { useMemo } from 'react'

export default function MentorCard({ mentor }){
  const { user, requests, requestMentorship, ratings } = useApp()
  
  // Calculate average rating for this mentor
  const averageRating = useMemo(() => {
    const mentorRatings = ratings.filter(r => r.toId === mentor.id && r.toRole === 'mentor')
    if (mentorRatings.length === 0) return 0
    const sum = mentorRatings.reduce((acc, r) => acc + r.rating, 0)
    return (sum / mentorRatings.length).toFixed(1)
  }, [ratings, mentor.id])
  
  // Check if student has already requested this mentor
  const existingRequest = user && user.role === 'student' 
    ? requests.find(r => r.mentorId === mentor.id && r.studentId === user.id)
    : null

  const handleRequest = async () => {
    if (!user) {
      alert('Please login as a student to request mentorship')
      return
    }
    try {
      await requestMentorship(mentor.id)
      alert('Mentorship request sent successfully!')
    } catch (error) {
      alert('Failed to send request. Please try again.')
    }
  }

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-lg">{mentor.name}</h3>
          <p className="text-sm text-slate-600">{mentor.title} • {mentor.background}</p>
        </div>
        <div className="flex items-center gap-1 text-amber-500">
          <Star size={16} fill="currentColor"/>
          {averageRating > 0 ? averageRating : 'No ratings'}
          {averageRating > 0 && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({ratings.filter(r => r.toId === mentor.id).length})
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-slate-700 line-clamp-2">{mentor.bio}</p>
      <div className="flex flex-wrap gap-2">
        {mentor.skills.slice(0,5).map((s)=> <span key={s} className="chip">{s}</span>)}
      </div>
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-slate-500">Availability: {mentor.availability}</span>
        <div className="flex gap-2">
          {user && user.role === 'student' && !existingRequest && (
            <button 
              className="btn btn-primary flex items-center gap-1" 
              onClick={handleRequest}
            >
              Request Mentorship
            </button>
          )}
          {user && user.role === 'student' && existingRequest && (
            <div className="flex items-center gap-1 text-sm">
              {existingRequest.status === 'pending' && (
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Clock size={16} /> Pending
                </span>
              )}
              {existingRequest.status === 'accepted' && (
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <CheckCircle size={16} /> Accepted
                </span>
              )}
              {existingRequest.status === 'rejected' && (
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                  <XCircle size={16} /> Rejected
                </span>
              )}
            </div>
          )}
          <Link className="btn btn-outline" to={`/mentor/${mentor.id}`}>View Profile</Link>
        </div>
      </div>
    </div>
  )
}
