import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export default function LoginMentor(){
  const { mentors, loginMentor } = useApp()
  const [id, setId] = useState(mentors[0]?.id || '')
  const navigate = useNavigate()

  const onLogin = () => {
    if (!id) return
    loginMentor(id)
    navigate('/mentor')
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="card p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Mentor Login</h1>
        <label className="text-sm text-slate-600">Select your mentor profile</label>
        <select value={id} onChange={e=>setId(e.target.value)} className="border rounded-lg px-3 py-2 w-full bg-white">
          {mentors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <button className="btn btn-primary w-full" onClick={onLogin}>Continue</button>
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-4">
          Don't have an account? <Link to="/register-mentor" className="text-primary-600 dark:text-primary-400 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  )
}
