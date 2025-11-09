import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { Award } from 'lucide-react'

export default function RegisterMentor(){
  const { registerMentor } = useApp()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institute: '',
    title: '',
    background: '',
    skills: '',
    interests: '',
    bio: '',
    availability: '1 hr/week'
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.title) {
      alert('Please fill in required fields')
      return
    }
    
    const mentorData = {
      name: formData.name,
      email: formData.email,
      institute: formData.institute,
      title: formData.title,
      background: formData.background,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
      bio: formData.bio,
      availability: formData.availability,
      rating: 0
    }
    
    try {
      await registerMentor(mentorData)
      alert('Registration successful! Welcome to MentorConnect.')
      navigate('/mentor')
    } catch (error) {
      alert(error.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-tealish-500/10 dark:bg-tealish-500/20 text-tealish-500 grid place-items-center">
            <Award size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Mentor Registration</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Share your expertise with students</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Smith"
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
                placeholder="jane@example.com"
                className="border dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Institute/College/University</label>
            <input 
              type="text" 
              name="institute"
              value={formData.institute}
              onChange={handleChange}
              placeholder="BIT Mesra, IIT Delhi, Stanford University, etc."
              className="border dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Job Title *</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Senior Software Engineer"
              className="border dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Background / Education</label>
            <input 
              type="text" 
              name="background"
              value={formData.background}
              onChange={handleChange}
              placeholder="IIT Delhi, Ex-Google"
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
              placeholder="React, System Design, Career Coaching"
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
              placeholder="EdTech, AI, Startups"
              className="border dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell students about yourself and how you can help them..."
              rows="3"
              className="border dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Availability</label>
            <select 
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="border dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800"
            >
              <option>1 hr/week</option>
              <option>2 hrs/week</option>
              <option>3 hrs/week</option>
              <option>Flexible</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-full py-3">Create Mentor Profile</button>
        </form>

        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-4">
          Already have an account? <Link to="/login-mentor" className="text-primary-600 dark:text-primary-400 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  )
}
