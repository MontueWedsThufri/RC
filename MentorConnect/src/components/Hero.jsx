import { Link } from 'react-router-dom'
import { Sparkles, TrendingUp, MessageCircle } from 'lucide-react'

export default function Hero(){
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-tealish-500/10">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"/>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-tealish-500/20 rounded-full blur-3xl"/>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            <Sparkles size={16} />
            <span>Connect. Learn. Grow.</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Connect with
            <span className="bg-gradient-to-r from-primary-600 to-tealish-500 bg-clip-text text-transparent"> Alumni Mentors</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
            Discover mentors, set goals, and track your growth with a clean, modern experience. Meaningful connections. Real progress.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">For Students</p>
                <div className="flex gap-2">
                  <Link to="/register-student" className="btn btn-primary px-5 py-2.5 flex-1">
                    Register
                  </Link>
                  <Link to="/login-student" className="btn btn-outline px-5 py-2.5 flex-1">
                    Login
                  </Link>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">For Mentors</p>
                <div className="flex gap-2">
                  <Link to="/register-mentor" className="btn btn-primary px-5 py-2.5 flex-1">
                    Register
                  </Link>
                  <Link to="/login-mentor" className="btn btn-outline px-5 py-2.5 flex-1">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8 pt-6">
            <div>
              <div className="text-3xl font-bold text-slate-900">500+</div>
              <div className="text-sm text-slate-600">Active Mentors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">2000+</div>
              <div className="text-sm text-slate-600">Students Connected</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">4.9★</div>
              <div className="text-sm text-slate-600">Average Rating</div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 to-tealish-500 rounded-2xl blur-2xl opacity-20"/>
          <div className="relative card p-2 bg-white/80 backdrop-blur">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop" alt="Mentorship" className="rounded-xl w-full h-auto" />
          </div>
          <div className="absolute -bottom-4 -left-4 card p-4 bg-white shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-700 grid place-items-center">
                <TrendingUp size={24} />
              </div>
              <div>
                <div className="text-sm text-slate-600">Success Rate</div>
                <div className="text-lg font-bold text-slate-900">95%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
