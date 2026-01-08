import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, X, Copy, Check, Loader2 } from 'lucide-react'
import InteractiveAIAvatar from './components/InteractiveAIAvatar-main'

// Placeholder for ChatInput - replace with your actual component
const ChatInput = ({ onSend, isProcessingMessage, onStop }) => {
  const [message, setMessage] = useState('')
  
  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && !isProcessingMessage && onSend(message)}
        placeholder="Type your message..."
        className="flex-1 input-surface px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        disabled={isProcessingMessage}
      />
      {isProcessingMessage ? (
        <button
          onClick={onStop}
          className="px-4 py-3 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          Stop
        </button>
      ) : (
        <button
          onClick={() => onSend(message)}
          disabled={!message.trim()}
          className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

// Chat Messages Component
const ChatMessagesComp = ({ chatMessages, showSkeletonOfAi }) => {
  const messagesEndRef = useRef(null)
  const [copiedIndex, setCopiedIndex] = useState(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, showSkeletonOfAi])

  const handleCopy = (message, index) => {
    navigator.clipboard.writeText(message)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

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
        <div className="mt-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <img 
            src={URL.createObjectURL(file)} 
            alt={file.name}
            className="max-w-[280px] max-h-[280px] rounded-xl object-cover cursor-pointer shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02]"
            onClick={() => openFileInNewTab(file)}
          />
          <div className="mt-2 flex gap-2">
            <button
              className="px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-lg hover:opacity-90 transition-all duration-200 font-medium"
              onClick={(e) => {
                e.stopPropagation()
                openFileInNewTab(file)
              }}
            >
              Open Full Size
            </button>
            <button
              className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs rounded-lg hover:bg-accent transition-all duration-200 font-medium"
              onClick={(e) => {
                e.stopPropagation()
                downloadFile(file)
              }}
            >
              Download
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{file.name}</p>
        </div>
      )
    } else {
      // Determine file type icon
      let fileIcon = (
        <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )

      if (file.type.includes('pdf')) {
        fileIcon = (
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      } else if (file.type.includes('excel') || file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        fileIcon = (
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        fileIcon = (
          <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      }

      return (
        <div className="mt-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-3 card-surface cursor-pointer hover:bg-accent transition-all duration-200 group">
            <div 
              className="flex items-center gap-3"
              onClick={() => openFileInNewTab(file)}
            >
              <div className="flex-shrink-0 transform group-hover:scale-110 transition-transform duration-200">
                {fileIcon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                className="flex-1 px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-lg hover:opacity-90 transition-all duration-200 font-medium"
                onClick={(e) => {
                  e.stopPropagation()
                  openFileInNewTab(file)
                }}
              >
                Open
              </button>
              <button
                className="flex-1 px-3 py-1.5 bg-secondary text-secondary-foreground text-xs rounded-lg hover:bg-accent transition-all duration-200 font-medium"
                onClick={(e) => {
                  e.stopPropagation()
                  downloadFile(file)
                }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  if (!chatMessages?.length && !showSkeletonOfAi) return null

  return (
    <div className="flex flex-col space-y-6 p-6">
      {chatMessages.map(({ role, message, files }, index) => {
        return (
          <div
            key={index}
            className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={`flex items-start max-w-[85%] gap-3 ${
                role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              {role === 'assistant' && (
                <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden shadow-card">
                  <InteractiveAIAvatar />
                </div>
              )}

              {/* Message Content */}
              <div className="flex flex-col gap-2">
                <div
                  className={`group relative px-5 py-3.5 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 ${
                    role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'card-surface rounded-tl-sm'
                  }`}
                >
                  <div className="text-[15px] leading-relaxed">
                    <div style={{ whiteSpace: 'pre-line' }}>{message}</div>
                    
                    {/* File previews */}
                    {files && files.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {files.map((file, fileIndex) => (
                          <div key={fileIndex}>
                            {renderFilePreview(file)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Copy button for AI messages */}
                  {role === 'assistant' && (
                    <button
                      className="absolute -bottom-8 right-0 p-2 rounded-lg hover:bg-accent transition-all duration-200 opacity-0 group-hover:opacity-100"
                      onClick={() => handleCopy(message, index)}
                      title="Copy message"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  )}
                </div>

                {/* Timestamp */}
                <div className={`text-xs text-muted-foreground px-2 ${role === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        )
      })}
      
      {/* AI Thinking Skeleton */}
      {showSkeletonOfAi && (
        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-3 duration-500">
          <div className="flex items-start gap-3 max-w-[85%]">
            {/* Avatar skeleton */}
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-secondary animate-pulse shadow-card" />

            {/* Message content */}
            <div className="flex flex-col gap-2">
              <div className="px-5 py-4 card-surface rounded-2xl rounded-tl-sm shadow-card min-w-[300px]">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="w-32 h-3.5 bg-muted rounded-full animate-pulse" />
                    <div className="w-20 h-3.5 bg-muted rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  </div>
                  <div className="w-48 h-3.5 bg-muted rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  <div className="flex gap-2">
                    <div className="w-28 h-3.5 bg-muted rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
                    <div className="w-24 h-3.5 bg-muted rounded-full animate-pulse" style={{ animationDelay: '600ms' }} />
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex gap-1.5 mt-4">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
  const [isDarkMode] = useState(true)
  const [chatMessages, setChatMessages] = useState([])
  const [showSkeletonOfAi, setShowSkeletonOfAi] = useState(false)
  const [isProcessingMessage, setIsProcessingMessage] = useState(false)

  const getGreetingText = () => {
    const hours = new Date().getHours()
    if (hours >= 0 && hours < 12) return 'Good Morning'
    if (hours >= 12 && hours < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  useEffect(() => {
    const greeting = getGreetingText()
    setChatMessages([
      {
        role: 'assistant',
        message: `${greeting}! I'm your AI Assistant. How can I help you today?`
      }
    ])
  }, [])

  const handleSendMessage = (message, files = []) => {
    if (!message.trim() && files.length === 0) return

    setChatMessages(prev => [
      ...prev,
      {
        role: 'user',
        message: message || (files.length > 0 ? `${files.length} file(s) uploaded` : ''),
        files: files.length > 0 ? files : undefined
      }
    ])

    setShowSkeletonOfAi(true)
    setIsProcessingMessage(true)

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
  return (
    <div
      className="relative h-screen bg-background text-foreground overflow-hidden flex flex-col"
      data-theme={isDarkMode ? 'dark' : 'light'}
    >
      {/* FIXED HEADER 
          - Removed 'p-5' to eliminate top/side margins
          - Added 'h-16' for a consistent fixed height
          - Added 'px-5' for side padding only
      */}
      <header className="flex-shrink-0 h-16 border-b border-border bg-card/80 backdrop-blur-md z-20 flex items-center shadow-sm">
        <div className="w-full px-5 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-primary/20">
              <InteractiveAIAvatar />
            </div>
            <h1 className="text-md font-bold text-foreground">AI Assistant</h1>
          </div>
        </div>
      </header>

      {/* SCROLLABLE CONTENT 
          - flex-1 ensures it takes up all space between header and footer
      */}
      <main className="flex-1 overflow-y-auto bg-background custom-scrollbar">
        <ChatMessagesComp 
          chatMessages={chatMessages}
          showSkeletonOfAi={showSkeletonOfAi}
        />
      </main>

      {/* FIXED FOOTER */}
<footer className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl p-5 z-20">
<div className="bg-card/80 backdrop-blur-md rounded-2xl border border-border shadow-lg p-2">
  <ChatInput
    onSend={handleSendMessage}
    isProcessingMessage={isProcessingMessage}
    onStop={handleStopRequest}
  />
</div>
</footer>
    </div>
  )
}