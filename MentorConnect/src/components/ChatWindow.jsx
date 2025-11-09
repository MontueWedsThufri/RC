import { useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../state/AppContext'
import { Trash2, Send } from 'lucide-react'

export default function ChatWindow({ peerId }){
  const { user, messages, sendMessage, deleteMessage, mentors, students } = useApp()
  const [text, setText] = useState('')
  const listRef = useRef(null)

  const threadId = useMemo(()=> user ? [user.id, peerId].sort().join('-') : null, [user, peerId])
  const thread = threadId ? messages.filter(m => m.threadId === threadId && !m.meta?.ai && m.from !== 'ai-assistant') : []
  
  // Get the peer information
  const peer = useMemo(() => {
    if (!user) return null
    const allContacts = user.role === 'student' ? mentors : students
    return allContacts.find(c => c.id === peerId)
  }, [user, peerId, mentors, students])

  useEffect(()=>{
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [thread.length])

  const onSend = async () => {
    if (!text.trim()) return
    if (!user) return
    
    try {
      await sendMessage(peerId, text.trim())
      setText('')
    } catch (error) {
      alert(error.message || 'Failed to send message. Please try again.')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const handleDeleteMessage = async (messageId) => {
    const confirmed = window.confirm('Are you sure you want to delete this message?')
    if (confirmed) {
      try {
        await deleteMessage(messageId)
      } catch (error) {
        alert('Failed to delete message. Please try again.')
      }
    }
  }

  return (
    <div className="card p-0 h-full flex flex-col overflow-hidden">
      {/* Chat Header */}
      {user && peer && (
        <div className="px-4 py-3 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-600 text-white text-sm font-bold grid place-items-center">
              {peer.name[0]}
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">{peer.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {peer.title || peer.institute || 'Online'}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!user && (
        <div className="flex-1 flex items-center justify-center text-slate-600 dark:text-slate-400 p-4">
          Please login to send and view messages.
        </div>
      )}
      {user && (
        <>
          <div ref={listRef} className="flex-1 overflow-auto space-y-2 p-4">
            {thread.length === 0 && (
              <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400 text-center">
                <div>
                  <Send size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No messages yet.</p>
                  <p className="text-sm mt-1">Send a message to start the conversation!</p>
                </div>
              </div>
            )}
            {thread.map(m => {
              const isSelf = m.from === user.id
              return (
                <div
                  key={m.id}
                  className={`max-w-[75%] px-3 py-2 rounded-lg group relative ${
                    isSelf
                      ? 'bg-primary-600 text-white self-end ml-auto'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                  } ${isSelf ? 'self-end ml-auto' : 'self-start mr-auto'}`}
                >
                  <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold mb-1 opacity-70">
                    {isSelf ? (
                      'You'
                    ) : (
                      peer?.name || 'Mentor'
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                  <div className="text-[10px] opacity-70 mt-1">{new Date(m.ts).toLocaleString()}</div>
                  {isSelf && (
                    <button
                      onClick={() => handleDeleteMessage(m.id)}
                      className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${isSelf ? 'hover:bg-primary-700' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                      title="Delete message"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          <div className="p-4 border-t dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex gap-2">
              <input 
                value={text} 
                onChange={e=>setText(e.target.value)} 
                onKeyPress={handleKeyPress}
                placeholder="Type a message (Press Enter to send)" 
                className="border dark:border-slate-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button 
                className="btn btn-primary px-4 flex items-center gap-2" 
                onClick={onSend}
                disabled={!text.trim()}
              >
                <Send size={16} />
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
