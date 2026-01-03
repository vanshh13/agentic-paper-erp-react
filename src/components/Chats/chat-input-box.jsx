import { useState, useRef } from 'react'
import { Mic, X, Square, Send } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'

// Send Icon Component
const SendIconInChat = ({ isDisabled }) => {
  return (
    <Send 
      className={`h-5 w-5 ${isDisabled ? 'opacity-50' : ''}`} 
      fill={isDisabled ? 'none' : 'currentColor'}
    />
  )
}

export function ChatInput({
  className = '',
  onAgenticChange,
  onSend,
  onClicked,
  isProcessingMessage = false,
  onStop,
  ...props
}) {
  const [isAgentic, setIsAgentic] = useState(false)
  const [value, setValue] = useState('')
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null)
  const [error, setError] = useState(null)

  const handleAgenticChange = (checked) => {
    setIsAgentic(checked)
    if (onAgenticChange) {
      onAgenticChange(checked)
    }
  }

  const handleSend = () => {
    if (!value.trim() && files.length === 0) return

    console.log("Sending from ChatInput:", value, files)
    onSend(value.trim(), files)
    setValue('')
    setFiles([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      setFiles((prev) => {
        const newFiles = selectedFiles.filter(
          (file) => !prev.some((f) => f.name === file.name && f.size === file.size)
        )
        return [...prev, ...newFiles]
      })
      setError(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = (fileName) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName))
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="p-[2px] bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 rounded-lg shadow-lg mt-2 mb-1">
      <div
        className={`relative rounded-lg bg-[#28292C]/80 backdrop-blur-md p-2 transition-all duration-300 ${className}`}
        {...props}
      >
        {/* File Preview */}
        {files.length > 0 && (
          <div className="space-y-2 mb-2 mx-2">
            {files.map((f) => (
              <div
                key={f.name}
                className="flex items-center justify-between bg-[#1ABC9C] rounded px-3 py-1 shadow-md"
              >
                <span className="text-sm text-black truncate">{f.name}</span>
                <button
                  onClick={() => handleRemoveFile(f.name)}
                  className="text-black hover:text-zinc-200 ml-2 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-red-500 text-sm mb-2 mx-2">{error}</div>
        )}

        <TextareaAutosize
          value={value}
          onKeyDown={handleKeyDown}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent px-2 text-xl text-zinc-200 placeholder:text-zinc-400 focus:outline-none resize-none min-h-[52px] max-h-[200px] mb-2"
          placeholder="Type your message..."
          minRows={1}
          maxRows={8}
        />

        <div className="flex items-center gap-2 border-t border-zinc-800 pt-2 relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="*"
          />

          <button
            className="h-10 w-10 shrink-0 rounded-full bg-transparent text-zinc-200 hover:bg-gradient-to-r hover:from-[#1ABC9C] hover:to-[#6C63FF] hover:shadow-lg focus:outline-none transition-all duration-300"
            onClick={handleFileClick}
          >
            📎
          </button>

          <button
            className="h-10 w-10 shrink-0 rounded-full bg-transparent text-zinc-200 hover:bg-gradient-to-r hover:from-[#6C63FF] hover:to-[#FF6B6B] hover:shadow-lg focus:outline-none transition-all duration-300 animate-pulse"
            onClick={onClicked}
          >
            <Mic className="h-5 w-5 mx-auto" />
          </button>

          <div className="flex-1" />

          <button
            className={`h-6 w-6 shrink-0 rounded-full text-zinc-200 focus:outline-none transition-all duration-300 ${
              !value.trim() && files.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gradient-to-r hover:from-[#1ABC9C] hover:to-[#FF6B6B] hover:shadow-lg'
            }`}
            onClick={handleSend}
            disabled={!value.trim() && files.length === 0}
          >
            <SendIconInChat isDisabled={!value.trim() && files.length === 0} />
            <span className="sr-only">Send message</span>
          </button>

          {isProcessingMessage && (
            <button
              type="button"
              className="absolute right-0 top-0 -translate-y-0 h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-r from-red-600 to-red-400 text-white shadow-lg hover:from-red-700 hover:to-red-500 transition-all duration-300 z-10"
              onClick={onStop}
              title="Stop"
              style={{
                position: 'absolute',
                bottom: '20%',
                right: 0,
                top: '0%',
                transform: 'translateY(-130%)',
              }}
            >
              <Square className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatInput

