import { useState } from 'react'
import { useApp } from '../state/AppContext'
import ProgressBar from './ProgressBar'
import { Trash2 } from 'lucide-react'

export default function GoalTracker(){
  const { goals, addGoal, addMilestone, toggleMilestone, deleteMilestone } = useApp()
  const [newGoal, setNewGoal] = useState('')
  const [newMilestone, setNewMilestone] = useState({})

  return (
    <div className="space-y-4">
      <div className="card p-4 flex gap-2">
        <input value={newGoal} onChange={e=>setNewGoal(e.target.value)} placeholder="Add a new goal" className="border dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white"/>
        <button className="btn btn-primary" onClick={()=>{ if(newGoal.trim()){ addGoal(newGoal.trim()); setNewGoal('') } }}>Add</button>
      </div>
      {goals.map(g => (
        <div key={g.id} className="card p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white">{g.title}</h3>
            <span className="text-sm text-slate-600">{g.progress}%</span>
          </div>
          <div className="my-3"><ProgressBar value={g.progress} /></div>
          <div className="space-y-2">
            {g.milestones.map(m => (
              <div key={m.id} className="flex items-center gap-2">
                <label className="flex items-center gap-2 flex-1">
                  <input type="checkbox" checked={m.done} onChange={()=>toggleMilestone(g.id, m.id)} />
                  <span className={m.done? 'line-through text-slate-500 dark:text-slate-400':'text-slate-800 dark:text-slate-200'}>{m.text}</span>
                </label>
                <button
                  onClick={() => deleteMilestone(g.id, m.id)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                  title="Delete milestone"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input value={newMilestone[g.id]||''} onChange={e=>setNewMilestone(prev=>({...prev,[g.id]:e.target.value}))} placeholder="Add milestone" className="border dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white"/>
            <button className="btn btn-outline" onClick={()=>{ const t=(newMilestone[g.id]||'').trim(); if(t){ addMilestone(g.id,t); setNewMilestone(prev=>({...prev,[g.id]:''})) } }}>Add</button>
          </div>
        </div>
      ))}
    </div>
  )
}
