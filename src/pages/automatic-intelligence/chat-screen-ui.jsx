import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Paperclip,
  X,
  FileIcon,
  FileText,
  Table
} from 'lucide-react'
import InteractiveAIAvatarLogo from '../../components/interactive-ai-avatar'
import { useSelector } from 'react-redux'
import Typewriter from 'typewriter-effect';

// 1. Fixed the symbol helper to be more robust
const getFileSymbol = (file) => {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  if (name.endsWith('.xlsx') || name.endsWith('.xls') || type.includes('spreadsheet')) return <Table className="w-4 h-4 text-green-500" />;
  if (name.endsWith('.docx') || name.endsWith('.doc') || type.includes('word')) return <FileText className="w-4 h-4 text-blue-500" />;
  if (type.includes('pdf')) return <FileIcon className="w-4 h-4 text-red-500" />;
  return <FileIcon className="w-4 h-4 text-muted-foreground" />;
}

const ChatInput = ({ onSend, isProcessingMessage }) => {
  const [message, setMessage] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  // Auto-expand logic
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = '40px'
      const scrollHeight = textarea.scrollHeight
      const maxHeight = 160
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden'
    }
  }, [message])

  const handleSubmission = () => {
    if (message.trim() || selectedFiles.length > 0) {
      onSend(message, selectedFiles.map(f => f.file))
      setMessage('')
      // Cleanup Object URLs to prevent memory leaks
      selectedFiles.forEach(f => { if (f.preview) URL.revokeObjectURL(f.preview) });
      setSelectedFiles([])
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setSelectedFiles(prev => [...prev, ...files]);
    e.target.value = null; // Reset input
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1 max-h-32 overflow-y-auto">
          {selectedFiles.map((item) => (
            <div key={item.id} className="flex items-center gap-2 p-1.5 bg-accent/40 rounded-xl border border-border/50 animate-in fade-in zoom-in duration-200">
              {item.preview ? <img src={item.preview} className="w-6 h-6 rounded object-cover" alt="" /> : getFileSymbol(item.file)}
              <span className="text-[10px] font-medium max-w-[60px] truncate">{item.file.name}</span>
              <button
                onClick={() => setSelectedFiles(prev => prev.filter(f => f.id !== item.id))}
                className="hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative flex items-end gap-2 p-1.5 bg-card rounded-[26px] border border-border shadow-sm focus-within:ring-2 focus-within:ring-primary/10 transition-all">
        <div className="flex items-center pb-1 pl-1">
          <input type="file" ref={fileInputRef} hidden multiple onChange={handleFileChange} />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent">
            <Paperclip className="w-5 h-5" />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), !isProcessingMessage && handleSubmission())}
          placeholder="Message AI Assistant..."
          className="flex-1 min-h-[40px] max-h-[160px] py-2.5 bg-transparent resize-none focus:outline-none text-[15px] leading-normal"
        />

        <div className="pb-1 pr-1">
          <button
            onClick={handleSubmission}
            disabled={(!message.trim() && selectedFiles.length === 0) || isProcessingMessage}
            className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full disabled:opacity-20 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

const ChatMessagesComp = ({ chatMessages }) => {
  const messagesEndRef = useRef(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  return (
    <div className="flex flex-col space-y-8 py-8 w-full">
      {chatMessages.map(({ role, message, files }, index) => (
        <div key={index} className={`flex w-full ${role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
          <div className={`flex items-start max-w-[85%] md:max-w-[75%] gap-3 ${role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {role === 'assistant' && (
              <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden border border-border shadow-sm">
                <InteractiveAIAvatarLogo />
              </div>
            )}
            <div className={`flex flex-col gap-2 ${role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-2.5 rounded-2xl text-[15px] shadow-sm ${role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted/50 border border-border/50 rounded-tl-none'}`}>
                <div className="whitespace-pre-line">{message}</div>
              </div>

              {/* Render Attached Files */}
              {files?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-accent/20 rounded-lg border border-border/40 text-[12px]">
                      {getFileSymbol(file)}
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
export default function ChatScreenUI() {
  const [chatMessages, setChatMessages] = useState([])
  const [showSkeletonOfAi, setShowSkeletonOfAi] = useState(false)
  const [isProcessingMessage, setIsProcessingMessage] = useState(false)
  const isDark = useSelector((state) => state.theme.isDarkMode)
  const user = useSelector((state => state.auth.user))

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleSendMessage = (message, files = []) => {
    setChatMessages(prev => [...prev, { role: 'user', message, files }]);
    setShowSkeletonOfAi(true);
    setIsProcessingMessage(true);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'assistant', message: 'I have received your message and am processing it.' }]);
      setShowSkeletonOfAi(false);
      setIsProcessingMessage(false);
    }, 1500);
  };

  const isInitialState = chatMessages.length === 0;

  return (
    <div className="flex flex-col w-full h-full bg-background text-foreground overflow-hidden font-sans relative">
      <main className="flex-1 overflow-y-auto custom-scrollbar w-full scroll-smooth">
        <div className="flex flex-col min-h-full w-full">
          {chatMessages.length === 0 ? (
            <div className="flex-1 flex flex-col p-6 text-center">
              {/* Parent container with reduced padding */}
              <div className="flex-1 flex flex-col p-2 text-center items-center">
                <>
                  {/*Adjusted py for height and px for width */}
                  <div className="relative py-8 px-32 md:px-64 mx-auto w-fit group overflow-hidden bg-card rounded-[1.5rem] border border-border shadow-card animate-in fade-in zoom-in duration-500 animate-border-glow">

                    {/* Animated Glowing Border */}
                    <div className="absolute inset-0 rounded-[1.5rem] p-[2px]">
                      <div className="w-full h-full rounded-[1.5rem] bg-card relative overflow-hidden">
                        {/* Top border animation */}
                        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-[border-flow-top_3s_linear_infinite]" />
                        {/* Right border animation */}
                        <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-transparent via-primary/60 to-transparent animate-[border-flow-right_3s_linear_infinite_0.75s]" />
                        {/* Bottom border animation */}
                        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-transparent via-primary/60 to-transparent animate-[border-flow-bottom_3s_linear_infinite_1.5s]" />
                        {/* Left border animation */}
                        <div className="absolute bottom-0 left-0 w-[2px] h-full bg-gradient-to-t from-transparent via-primary/60 to-transparent animate-[border-flow-left_3s_linear_infinite_2.25s]" />
                      </div>
                    </div>

                    {/* Static Horizontal Accent Line */}
                    <div className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-700 group-hover:via-primary/60" />
                    {/* Header Label with margin-bottom simulation */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20">
                      <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                        <span className="text-[9px] font-mono tracking-[0.2em] text-primary uppercase">Hey I'm Chat bot</span>
                      </div>
                      {/* This creates the visual "margin" under the label before the avatar starts */}
                      <div className="h-2" />
                    </div>

                    {/* Avatar - Wrapped in a container with mt to respect the top label */}
                    <div className="relative z-10 flex items-center justify-center mt-4">
                      <div className="relative w-24 h-24 md:w-32 md:h-32">
                        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-card via-muted to-card shadow-2xl border border-border/50 flex items-center justify-center transition-all duration-700 group-hover:scale-105 group-hover:border-primary/50">
                          <InteractiveAIAvatarLogo size="100%" />
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-muted/10 to-transparent pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Typewriter Text - Zero gap with the frame */}
                  <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
                    <div className="text-muted-foreground max-w-lg mx-auto text-xl md:text-2xl font-semibold leading-snug tracking-tight">
                      <Typewriter
                        key={`${getGreeting()}-${user.username}`}
                        options={{
                          strings: [`${getGreeting()} ${user.username}, how can I help?`],
                          autoStart: true,
                          delay: 40,
                          cursor: "",
                          deleteSpeed: 999999,
                        }}
                      />
                    </div>
                  </div>
                </>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <ChatMessagesComp
                chatMessages={chatMessages}
                showSkeletonOfAi={showSkeletonOfAi}
              />
            </div>
          )}
        </div>
      </main>

      {/* Input Footer */}
      <footer className="flex-shrink-0 w-full bg-background/95 backdrop-blur-sm p-4 pt-2">
        <div className="max-w-4xl mx-auto w-full">
          <ChatInput
            onSend={handleSendMessage}
            isProcessingMessage={isProcessingMessage}
            onStop={() => setIsProcessingMessage(false)}
          />
          <p className="text-[11px] text-center text-muted-foreground mt-3 opacity-70">
            AI can make mistakes. Verify important info.
          </p>
        </div>
      </footer>
    </div>
  )
}