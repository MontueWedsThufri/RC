import GoalTracker from '../components/GoalTracker'

export default function Goals(){
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Goals & Progress</h1>
      <GoalTracker />
    </div>
  )
}
