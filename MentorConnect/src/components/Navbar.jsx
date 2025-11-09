import { Link, NavLink } from 'react-router-dom'
import { MessageSquareMore, Goal, UsersRound, Moon, Sun } from 'lucide-react'
import { useApp } from '../state/AppContext'

export default function Navbar() {
  const { user, logout, darkMode, toggleDarkMode } = useApp()
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-all">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-br from-primary-50 to-tealish-500/10 dark:from-primary-900/30 dark:to-tealish-500/20 rounded-xl group-hover:scale-105 transition-transform">
            <img 
              src="https://img.icons8.com/color/96/graduation-cap--v1.png" 
              alt="MentorConnect Logo" 
              className="h-9 w-9 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">MentorConnect</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5 tracking-widest uppercase font-medium">Grow Together</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {user && (
            <>
              <NavLink to="/matching" className={({isActive})=>`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300':'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Find Mentors</NavLink>
              <NavLink to="/student" className={({isActive})=>`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300':'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Student</NavLink>
              <NavLink to="/mentor" className={({isActive})=>`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300':'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Mentor</NavLink>
              <NavLink to="/messages" className={({isActive})=>`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300':'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><span className="inline-flex items-center gap-1.5"><MessageSquareMore size={16}/>Messages</span></NavLink>
              <NavLink to="/goals" className={({isActive})=>`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300':'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><span className="inline-flex items-center gap-1.5"><Goal size={16}/>Goals</span></NavLink>
            </>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={toggleDarkMode} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105" aria-label="Toggle dark mode">
            {darkMode ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-slate-600" />}
          </button>
          {!user && (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login-student" className="btn btn-outline hover:scale-105 transition-transform">Student Login</Link>
              <Link to="/login-mentor" className="btn btn-primary shadow-md hover:shadow-lg hover:scale-105 transition-all">Mentor Login</Link>
            </div>
          )}
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div className="h-7 w-7 rounded-full bg-primary-600 text-white text-xs font-bold grid place-items-center">{user.name[0]}</div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.name}</span>
              </div>
              <button className="btn btn-outline hover:scale-105 transition-transform" onClick={logout}>Logout</button>
            </div>
          )}
          <div className="md:hidden">
            <UsersRound />
          </div>
        </div>
      </div>
    </header>
  )
}
