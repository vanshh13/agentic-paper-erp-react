import { useState, useRef, useEffect } from 'react'
import InteractiveAIAvatar from '../../components/interactive-ai-avatar'
import { Send, Paperclip, X } from 'lucide-react'
import ChatInput from '../../components/chats/chat-input-box'

// Chat Messages Component
const ChatMessagesComp = ({ chatMessages, showSkeletonOfAi }) => {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, showSkeletonOfAi])

  // Function to render file previews
  const renderFilePreview = (file) => {
    const openFileInNewTab = (file) => {
      const fileURL = URL.createObjectURL(file)
      window.open(fileURL, '_blank')
    }

    const downloadFile = (file) => {
      const fileURL = URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = fileURL
      a.download = file.name
      if (document.body) {
        document.body.appendChild(a)
        a.click()
        if (document.body.contains(a)) {
          document.body.removeChild(a)
        }
      }
      URL.revokeObjectURL(fileURL)
    }

    if (file.type.startsWith('image/')) {
      return (
        <div className="mt-2">
          <img 
            src={URL.createObjectURL(file)} 
            alt={file.name}
            className="max-w-[200px] max-h-[200px] rounded-lg object-cover cursor-pointer"
            onClick={() => openFileInNewTab(file)}
          />
          <div className="mt-1 flex space-x-2">
            <button
              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                openFileInNewTab(file)
              }}
            >
              Open Full Size
            </button>
            <button
              className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                downloadFile(file)
              }}
            >
              Download
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">{file.name}</p>
        </div>
      )
    } else {
      // Determine file type icon
      let fileIcon = (
        <svg className="w-8 h-8 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )

      if (file.type.includes('pdf')) {
        fileIcon = (
          <svg className="w-8 h-8 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      } else if (file.type.includes('excel') || file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        fileIcon = (
          <svg className="w-8 h-8 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        fileIcon = (
          <svg className="w-8 h-8 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      }

      return (
        <div className="mt-2 p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
          <div 
            className="flex items-center"
            onClick={() => openFileInNewTab(file)}
          >
            {fileIcon}
            <div>
              <p className="text-sm text-white">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <div className="mt-2 flex space-x-2">
            <button
              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                openFileInNewTab(file)
              }}
            >
              Open
            </button>
            <button
              className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                downloadFile(file)
              }}
            >
              Download
            </button>
          </div>
        </div>
      )
    }
  }

  if (!chatMessages?.length && !showSkeletonOfAi) return null

  return (
    <div className="flex flex-col space-y-3 p-4">
      {chatMessages.map(({ role, message, files }, index) => {
        return (
          <div
            key={index}
            className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start max-w-[80%] ${role === 'user'
                ? 'flex-row-reverse space-x-reverse'
                : 'flex-row'
                }`}
            >
              {/* Avatar */}
              {role === 'user' ? (
                <></>
              ) : (
                <div className="w-10 h-10 flex-shrink-0">
                  <InteractiveAIAvatar />
                </div>
              )}

              {/* Message Content */}
              <div
                className={`flex ${role === 'user' ? 'items-end' : 'items-start'
                  }`}
              >
                <div
                  className={`p-3 rounded-2xl ${role === 'user'
                    ? 'bg-blue-500 text-white rounded-tr-none'
                    : 'bg-gray-900 text-white rounded-tl-none'
                    }`}
                >
                  <div className="text-sm">
                    <div style={{ whiteSpace: 'pre-line' }}>{message}</div>
                    
                    {/* File previews */}
                    {files && files.length > 0 && (
                      <div className="mt-2">
                        {files.map((file, fileIndex) => (
                          <div key={fileIndex}>
                            {renderFilePreview(file)}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Copy button for AI messages */}
                    {role === 'assistant' && (
                      <button
                        className="ml-2 p-1 rounded hover:bg-gray-700 transition"
                        onClick={() => navigator.clipboard.writeText(message)}
                        title="Copy message"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012 2h9a2 2 0 012 2v1" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
      
      {/* AI Thinking Skeleton */}
      {showSkeletonOfAi && (
        <div className="flex justify-start p-6">
          <div className="flex items-start space-x-4 max-w-[80%] group">
            {/* Avatar skeleton with pulse effect */}
            <div className="relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-800 via-cyan-700 to-cyan-800 animate-pulse shadow-lg" />
            </div>

            {/* Message content */}
            <div className="flex flex-col space-y-3">
              {/* Message bubble */}
              <div className="p-5 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl rounded-tl-none shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-cyan-700/20">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-cyan-500/20 to-cyan-400/20" />
                </div>

                {/* Text lines with dynamic widths and smooth animations */}
                <div className="space-y-3 relative">
                  <div className="flex space-x-2">
                    <div className="w-40 h-4 bg-gradient-to-r from-cyan-800 via-cyan-700 to-cyan-800 rounded-full animate-pulse" />
                    <div className="w-20 h-4 bg-gradient-to-r from-cyan-800 via-cyan-700 to-cyan-800 rounded-full animate-pulse" />
                  </div>
                  <div className="w-56 h-4 bg-gradient-to-r from-cyan-800 via-cyan-700 to-cyan-800 rounded-full animate-pulse" />
                  <div className="flex space-x-2">
                    <div className="w-32 h-4 bg-gradient-to-r from-cyan-800 via-cyan-700 to-cyan-800 rounded-full animate-pulse" />
                    <div className="w-24 h-4 bg-gradient-to-r from-cyan-800 via-cyan-700 to-cyan-800 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  )
}


// Main Chat Screen UI Component
export default function ChatScreenUI() {
  const [chatMessages, setChatMessages] = useState([])
  const [showSkeletonOfAi, setShowSkeletonOfAi] = useState(false)
  const [isProcessingMessage, setIsProcessingMessage] = useState(false)

  const handleSendMessage = (message, files = []) => {
    // Add user message
    setChatMessages(prev => [
      ...prev,
      {
        role: 'user',
        message: message || (files.length > 0 ? `${files.length} file(s) uploaded` : ''),
        files: files.length > 0 ? files : undefined
      }
    ])

    // Show AI thinking skeleton
    setShowSkeletonOfAi(true)
    setIsProcessingMessage(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          message: 'This is a sample AI response. Replace this with your actual API integration.'
        }
      ])
      setShowSkeletonOfAi(false)
      setIsProcessingMessage(false)
    }, 2000)
  }

  const handleStopRequest = () => {
    setShowSkeletonOfAi(false)
    setIsProcessingMessage(false)
  }

  // Get time-based greeting
  const getGreeting = () => {
    const now = new Date()
    const hours = now.getHours()
    
    if (hours >= 0 && hours < 12) {
      return 'Good Morning'
    } else if (hours >= 12 && hours < 17) {
      return 'Good Afternoon'
    } else {
      return 'Good Evening'
    }
  }

  const [greeting] = useState(getGreeting())

  return (
    <div className="relative h-screen bg-[oklch(0.15_0_0)] text-[oklch(0.95_0_0)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-[oklch(0.25_0_0)] bg-[oklch(0.15_0_0)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <InteractiveAIAvatar />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[oklch(0.95_0_0)]">
                AI Assistant
              </h1>
              <p className="text-xs text-[oklch(0.70_0_0)]">
                Hey {greeting}, I am Your AI Assistant
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto bg-[oklch(0.15_0_0)]">
        {chatMessages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4">
                <InteractiveAIAvatar />
              </div>
              <p className="text-lg text-[oklch(0.70_0_0)]">
                Start a conversation with your AI Assistant
              </p>
            </div>
          </div>
        )}
        <ChatMessagesComp 
          chatMessages={chatMessages}
          showSkeletonOfAi={showSkeletonOfAi}
        />
      </div>

      {/* Chat Input Area */}
      <div className="flex-shrink-0 p-4 border-t border-[oklch(0.25_0_0)] bg-[oklch(0.15_0_0)]">
        <ChatInput
          onSend={handleSendMessage}
          isProcessingMessage={isProcessingMessage}
          onStop={handleStopRequest}
          onAgenticChange={() => {}}
        />
      </div>
    </div>
  )
}

