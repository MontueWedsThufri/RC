import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { UserPlus } from 'lucide-react'

export default function RegisterStudent(){
  const { registerStudent } = useApp()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institute: '',
    interests: '',
    skills: '',
    goals: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      alert('Please fill in required fields')
      return
    }
    
    const studentData = {
      name: formData.name,
      email: formData.email,
      institute: formData.institute,
      interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      goals: formData.goals.split(',').map(s => s.trim()).filter(Boolean)
    }
    
    try {
      await registerStudent(studentData)
      alert('Registration successful! Welcome to MentorConnect.')
      navigate('/student')
    } catch (error) {
      alert(error.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 grid place-items-center">
            <UserPlus size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Student Registration</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Create your student profile</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="border dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="border dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Institute/College</label>
            <input 
              type="text" 
              name="institute"
              value={formData.institute}
              onChange={handleChange}
              placeholder="BIT Mesra, IIT Delhi, etc."
              className="border dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Interests (comma separated)</label>
            <input 
              type="text" 
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="AI, Startups, Web Development"
              className="border dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
            <input 
              type="text" 
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Python, DSA"
              className="border dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Goals (comma separated)</label>
            <textarea 
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              placeholder="Land an internship, Learn ML"
              rows="3"
              className="border dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full py-3">Create Account</button>
        </form>

        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-4">
          Already have an account? <Link to="/login-student" className="text-primary-600 dark:text-primary-400 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  )
}
