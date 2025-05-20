import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectUser } from '../../store/slices/authSlice'

const AIChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)

  useEffect(() => {
    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      setIsOpen(true)
      // Add initial greeting
      const greeting = isAuthenticated 
        ? `Hi ${user?.name?.split(' ')[0]}! Need help finding something?`
        : "Hi there! Need help finding something?"
      setMessages([{ text: greeting, isBot: true }])
    }, 5000)

    return () => clearTimeout(timer)
  }, [isAuthenticated, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    // Add user message
    setMessages(prev => [...prev, { text: inputMessage, isBot: false }])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response (replace with actual API call in production)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Based on your interests, I recommend checking out our new collection of premium products. Would you like me to show you some specific items?",
        isBot: true
      }])
      setIsTyping(false)
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl z-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">AI</span>
          </div>
          <span className="ml-2 font-medium">Shopping Assistant</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isBot
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-primary-600 text-white'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 text-gray-800">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default AIChatPopup