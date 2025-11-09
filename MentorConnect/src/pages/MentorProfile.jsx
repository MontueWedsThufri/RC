import { useParams } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export default function MentorProfile(){
  const { id } = useParams()
  const { mentors, requestMentorship, user, requests } = useApp()
  const m = mentors.find(x => x.id === id)
  if (!m) return <div className="mx-auto max-w-7xl px-4 py-8">Mentor not found</div>

  const existingRequest = user && user.role === 'student'
    ? requests.find(r => r.mentorId === m.id && r.studentId === user.id)
    : null

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 card p-6 space-y-3">
        <h1 className="text-2xl font-bold">{m.name}</h1>
        <p className="text-slate-600">{m.title} • {m.background}</p>
        <p>{m.bio}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {m.skills.map(s => <span key={s} className="chip">{s}</span>)}
        </div>
      </div>
      <aside className="space-y-4">
        <div className="card p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Availability</h3>
            <p className="text-slate-600">{m.availability}</p>
          </div>
          {user && user.role === 'student' ? (
            existingRequest ? (
              <div className="text-sm">
                {existingRequest.status === 'pending' && (
                  <span className="text-amber-600 dark:text-amber-400">Pending request sent.</span>
                )}
                {existingRequest.status === 'accepted' && (
                  <span className="text-green-600 dark:text-green-400">Mentorship accepted!</span>
                )}
                {existingRequest.status === 'rejected' && (
                  <span className="text-red-600 dark:text-red-400">Request declined.</span>
                )}
              </div>
            ) : (
              <button
                className="btn btn-primary w-full"
                onClick={() => requestMentorship(m.id)}
              >
                Request Mentorship
              </button>
            )
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {user ? 'Switch to a student account to request mentorship.' : 'Login as a student to request mentorship.'}
            </p>
          )}
        </div>
      </aside>
    </div>
  )
}
