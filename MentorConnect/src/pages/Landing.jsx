import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import { Search, MessageSquare, Target, Award, Users, Calendar, Star } from 'lucide-react'

export default function Landing(){
  return (
    <div>
      <Hero />
      
      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Everything you need to succeed</h2>
          <p className="text-lg text-slate-600 mt-3">Powerful features to help you connect, learn, and grow</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-8 hover:shadow-xl transition-shadow group">
            <div className="h-14 w-14 rounded-xl bg-primary-100 text-primary-600 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
              <Search size={28} />
            </div>
            <h3 className="font-bold text-xl mb-2">Find Mentors Easily</h3>
            <p className="text-slate-600">Advanced filters by skills, interests, and background. See ratings, reviews, and availability at a glance.</p>
          </div>
          <div className="card p-8 hover:shadow-xl transition-shadow group">
            <div className="h-14 w-14 rounded-xl bg-tealish-500/10 text-tealish-500 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare size={28} />
            </div>
            <h3 className="font-bold text-xl mb-2">Chat and Collaborate</h3>
            <p className="text-slate-600">Built-in messaging system. Schedule sessions, share resources, and stay connected with your mentor.</p>
          </div>
          <div className="card p-8 hover:shadow-xl transition-shadow group">
            <div className="h-14 w-14 rounded-xl bg-amber-100 text-amber-600 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
              <Target size={28} />
            </div>
            <h3 className="font-bold text-xl mb-2">Track Your Progress</h3>
            <p className="text-slate-600">Set goals, create milestones, and visualize your growth with progress bars and insights.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">How it works</h2>
            <p className="text-lg text-slate-600 mt-3">Get started in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 rounded-full bg-primary-600 text-white text-2xl font-bold items-center justify-center mb-4">1</div>
              <h3 className="font-bold text-xl mb-2">Create Your Profile</h3>
              <p className="text-slate-600">Sign up as a student and tell us about your interests, skills, and goals.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex h-16 w-16 rounded-full bg-primary-600 text-white text-2xl font-bold items-center justify-center mb-4">2</div>
              <h3 className="font-bold text-xl mb-2">Find Your Mentor</h3>
              <p className="text-slate-600">Browse our curated list of alumni mentors and request mentorship.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex h-16 w-16 rounded-full bg-primary-600 text-white text-2xl font-bold items-center justify-center mb-4">3</div>
              <h3 className="font-bold text-xl mb-2">Start Learning</h3>
              <p className="text-slate-600">Connect, set goals, track progress, and achieve your career aspirations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">What our users say</h2>
          <p className="text-lg text-slate-600 mt-3">Real stories from students and mentors</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="flex gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="text-slate-700 italic mb-4">"MentorConnect helped me land my dream internship. My mentor's guidance was invaluable!"</p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-100 grid place-items-center text-primary-700 font-bold">A</div>
              <div>
                <div className="font-semibold">Anjali Kumar</div>
                <div className="text-sm text-slate-600">CS Student, IIT Delhi</div>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="text-slate-700 italic mb-4">"As a mentor, I love giving back. This platform makes it so easy to connect with motivated students."</p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-tealish-500/10 grid place-items-center text-tealish-500 font-bold">R</div>
              <div>
                <div className="font-semibold">Rohan Patel</div>
                <div className="text-sm text-slate-600">Software Engineer, Google</div>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="text-slate-700 italic mb-4">"The goal tracking feature kept me accountable. Best mentorship platform I've used!"</p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 grid place-items-center text-amber-600 font-bold">S</div>
              <div>
                <div className="font-semibold">Sneha Reddy</div>
                <div className="text-sm text-slate-600">MBA Student, IIM Bangalore</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-tealish-500 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start your journey?</h2>
          <p className="text-xl mb-8 text-primary-50">Join thousands of students and mentors building meaningful connections</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register-student" className="btn bg-white text-primary-700 hover:bg-slate-50 px-8 py-3 text-lg font-semibold">Get Started as Student</Link>
            <Link to="/register-mentor" className="btn bg-primary-700 text-white hover:bg-primary-800 px-8 py-3 text-lg font-semibold border-2 border-white">Become a Mentor</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
