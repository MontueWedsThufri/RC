import { useState, useMemo } from 'react'
import { useApp } from '../state/AppContext'
import ChatWindow from '../components/ChatWindow'
import { MessageSquare } from 'lucide-react'

export default function Messages(){
  const { mentors, students, user, messages } = useApp()
  
  // Get current user's full profile with institute
  const currentUserProfile = useMemo(() => {
    if (!user) return null
    const allUsers = user.role === 'student' ? students : mentors
    return allUsers.find(u => u.id === user.id)
  }, [user, students, mentors])

  // Get contacts based on user role and filter by same institute
  const contacts = useMemo(() => {
    if (!user || !currentUserProfile) return []
    
    // If student, show mentors; if mentor, show students
    const potentialContacts = user.role === 'student' ? mentors : students
    
    // Filter by same institute (case-insensitive)
    if (!currentUserProfile.institute || currentUserProfile.institute.trim() === '') {
      return potentialContacts // If no institute, show all
    }
    
    return potentialContacts.filter(contact => {
      if (!contact.institute || contact.institute.trim() === '') return false
      return contact.institute.toLowerCase().trim() === currentUserProfile.institute.toLowerCase().trim()
    })
  }, [user, currentUserProfile, mentors, students])

  // Get conversations with message counts
  const conversationsWithCounts = useMemo(() => {
    if (!user) return []
    return contacts.map(contact => {
      const threadId = [user.id, contact.id].sort().join('-')
      const threadMessages = messages.filter(m => m.threadId === threadId)
      const lastMessage = threadMessages[threadMessages.length - 1]
      return {
        ...contact,
        messageCount: threadMessages.length,
        lastMessage: lastMessage?.text || '',
        lastMessageTime: lastMessage?.ts || ''
      }
    }).sort((a, b) => {
      // Sort by last message time, most recent first
      if (!a.lastMessageTime) return 1
      if (!b.lastMessageTime) return -1
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    })
  }, [contacts, messages, user])

  const [activePeer, setActivePeer] = useState(conversationsWithCounts[0]?.id || '')
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 grid md:grid-cols-3 gap-6" style={{ minHeight: '70vh' }}>
      <aside className="card p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <MessageSquare size={20} className="text-primary-600" />
          {user?.role === 'student' ? 'Mentors' : 'Students'}
        </h3>
        {currentUserProfile && currentUserProfile.institute && (
          <div className="mb-3 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-xs text-primary-700 dark:text-primary-300">
            <span className="font-medium">From {currentUserProfile.institute} only</span>
          </div>
        )}
        {!user && (
          <div className="text-sm text-slate-600 dark:text-slate-400 p-3">
            Please login to view messages
          </div>
        )}
        {user && conversationsWithCounts.length === 0 && (
          <div className="text-sm text-slate-600 dark:text-slate-400 p-3">
            {currentUserProfile?.institute ? (
              <>
                No {user.role === 'student' ? 'mentors' : 'students'} from <span className="font-semibold">{currentUserProfile.institute}</span> yet.
                {user.role === 'student' && ' Check the Find Mentors page to connect!'}
              </>
            ) : (
              <>No contacts yet. {user.role === 'student' ? 'Find mentors to connect with!' : 'Wait for students to reach out!'}</>
            )}
          </div>
        )}
        <div className="space-y-1">
          {conversationsWithCounts.map(contact => (
            <button 
              key={contact.id} 
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activePeer===contact.id 
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100'
              }`} 
              onClick={()=>setActivePeer(contact.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{contact.name}</div>
                  {contact.lastMessage && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {contact.lastMessage.substring(0, 30)}{contact.lastMessage.length > 30 ? '...' : ''}
                    </div>
                  )}
                </div>
                {contact.messageCount > 0 && (
                  <div className="ml-2 px-2 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                    {contact.messageCount}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </aside>
      <div className="md:col-span-2">
        {activePeer && user ? <ChatWindow peerId={activePeer} /> : <div className="card p-6 text-slate-600 dark:text-slate-400 text-center">Select a conversation to start chatting</div>}
      </div>
    </div>
  )
}
