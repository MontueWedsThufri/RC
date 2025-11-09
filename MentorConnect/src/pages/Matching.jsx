import { useMemo, useState } from 'react'
import FilterBar from '../components/FilterBar'
import MentorCard from '../components/MentorCard'
import { useApp } from '../state/AppContext'
import { rankMentors } from '../utils/matching'

export default function Matching(){
  const { mentors, students, user } = useApp()
  const me = (user && user.role === 'student' && students.find(s => s.id === user.id)) || students[0]
  const [filters, setFilters] = useState({ q: '', skill: '', interest: '' })

  const filtered = useMemo(() => {
    const ranked = rankMentors(me, mentors)
    return ranked.filter(m => {
      const q = filters.q.toLowerCase()
      const hitQ = !q || m.name.toLowerCase().includes(q) || m.background.toLowerCase().includes(q)
      const hitSkill = !filters.skill || m.skills.some(s => s.toLowerCase().includes(filters.skill.toLowerCase()))
      const hitInterest = !filters.interest || m.interests.some(i => i.toLowerCase().includes(filters.interest.toLowerCase()))
      return hitQ && hitSkill && hitInterest
    })
  }, [mentors, filters, me])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Find your mentor</h1>
        {me.institute && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Showing mentors from <span className="font-semibold text-primary-600 dark:text-primary-400">{me.institute}</span>
          </p>
        )}
      </div>
      <FilterBar onFilter={setFilters} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(m => <MentorCard key={m.id} mentor={m} />)}
      </div>
      {filtered.length===0 && <div className="card p-6 text-slate-600 dark:text-slate-400">No mentors from your institute match your filters. {me.institute ? 'Try clearing filters or check back later for more mentors from ' + me.institute + '.' : 'Try clearing filters.'}</div>}
    </div>
  )
}
