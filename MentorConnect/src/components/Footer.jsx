export default function Footer(){
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-600 dark:text-slate-400 flex items-center justify-between">
        <p>© {new Date().getFullYear()} MentorConnect</p>
        <p className="hidden sm:block">Built for demos. All data is mock.</p>
      </div>
    </footer>
  )
}
