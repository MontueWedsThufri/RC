import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! I\'m your MentorConnect assistant. How can I help you today?', sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = { id: Date.now(), text: input, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(input)
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }])
    }, 500)
  }

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase()
    
    if (input.includes('mentor') || input.includes('find')) {
      return 'You can find mentors by clicking "Find Mentors" in the navigation menu. You can filter by skills, interests, and background!'
    } else if (input.includes('register') || input.includes('sign up')) {
      return 'To register, click on the "Register" button for Students or Mentors on the home page. Fill out the form and you\'re all set!'
    } else if (input.includes('login')) {
      return 'You can login using the "Login" buttons in the navigation bar or on the home page. Select your profile and continue!'
    } else if (input.includes('goal') || input.includes('track')) {
      return 'Track your goals by going to the Goals page from the navigation menu. You can add goals, create milestones, and monitor your progress!'
    } else if (input.includes('message') || input.includes('chat')) {
      return 'You can message mentors through the Messages page. Once connected with a mentor, you can start a conversation!'
    } else if (input.includes('session') || input.includes('schedule')) {
      return 'Mentors can view and manage scheduled sessions from their dashboard. Students can request sessions after connecting with a mentor.'
    } else if (input.includes('help') || input.includes('how')) {
      return 'I can help you with:\n• Finding mentors\n• Registration and login\n• Goal tracking\n• Messaging\n• Scheduling sessions\n\nWhat would you like to know more about?'
    } else {
      return 'I\'m here to help! You can ask me about finding mentors, registration, goals, messaging, or scheduling sessions. What would you like to know?'
    }
  }

  const quickActions = [
    'Find a mentor',
    'How to register?',
    'Track my goals',
    'Schedule a session'
  ]

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col z-50 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-tealish-500 p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur grid place-items-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">MentorConnect Bot</h3>
                <p className="text-xs text-white/80">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 flex flex-wrap gap-2 border-t dark:border-slate-700">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(action)
                    handleSend()
                  }}
                  className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleSend}
                className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-xl transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-r from-primary-600 to-tealish-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50 grid place-items-center"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  )
}
