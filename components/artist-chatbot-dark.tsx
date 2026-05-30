'use client'

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ArtistChatbotProps {
  artistName: string
  artistSpecialty: string
}

export default function ArtistChatbotDark({ artistName, artistSpecialty }: ArtistChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Xin chào! Tôi là trợ lý AI của ${artistName}. Tôi có thể giúp bạn tìm hiểu về lĩnh vực chuyên môn của nghệ nhân và trả lời các câu hỏi về kỹ thuật, lịch sử, và cách thực hành. Bạn muốn biết gì?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        `Đó là một câu hỏi tuyệt vời! Tôi rất vui được chia sẻ kiến thức về lĩnh vực này.`,
        `Cảm ơn bạn đã quan tâm. ${artistName} đã dành nhiều năm để hoàn thiện kỹ năng này.`,
        `Đây là một khía cạnh quan trọng. Hãy để tôi giải thích chi tiết hơn...`,
        `Bạn có thể tìm hiểu thêm bằng cách tham gia các lớp học hoặc workshop của chúng tôi.`,
      ]

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <h3 className="font-semibold text-white">Trò chuyện với AI {artistName}</h3>
        <p className="text-xs text-gray-400">Hỏi về lĩnh vực chuyên môn</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-zinc-800 text-gray-200 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs text-gray-400 mt-1 text-right">
                {message.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 text-gray-200 px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
              <Loader size={16} className="animate-spin" />
              <span className="text-sm">Đang suy nghĩ...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-zinc-800 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-zinc-700 rounded-lg bg-zinc-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-primary hover:bg-primary disabled:opacity-50 flex-shrink-0"
          >
            <Send size={16} />
          </Button>
        </div>
      </form>
    </div>
  )
}
