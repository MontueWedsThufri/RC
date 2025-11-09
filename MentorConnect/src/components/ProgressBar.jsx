export default function ProgressBar({ value }){
  return (
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div className="h-2 rounded-full bg-tealish-500" style={{ width: `${Math.min(Math.max(value,0),100)}%` }} />
    </div>
  )
}
