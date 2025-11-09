import { useState } from 'react'

export default function FilterBar({ onFilter }){
  const [q, setQ] = useState('')
  const [skill, setSkill] = useState('')
  const [interest, setInterest] = useState('')
  return (
    <div className="card p-4 grid md:grid-cols-4 gap-3">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name, background" className="border rounded-lg px-3 py-2 w-full"/>
      <input value={skill} onChange={e=>setSkill(e.target.value)} placeholder="Skill (e.g., React)" className="border rounded-lg px-3 py-2 w-full"/>
      <input value={interest} onChange={e=>setInterest(e.target.value)} placeholder="Interest (e.g., AI)" className="border rounded-lg px-3 py-2 w-full"/>
      <button className="btn btn-primary" onClick={()=>onFilter({ q, skill, interest })}>Apply Filters</button>
    </div>
  )
}
