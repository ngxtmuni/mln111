"use client"

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

export default function ArtistChatbot({ artistName, artistSpecialty }: ArtistChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Xin chào! Tôi là trợ lý AI của ${artistName}. Tôi có thể giúp bạn tìm hiểu về ${artistSpecialty} và trả lời các câu hỏi về kỹ thuật, lịch sử, và cách thực hành. Bạn muốn biết gì?`,
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

    // Add user message
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
        `Đó là một câu hỏi tuyệt vời về ${artistSpecialty}! Tôi rất vui được chia sẻ kiến thức về lĩnh vực này.`,
        `Cảm ơn bạn đã quan tâm. ${artistName} đã dành nhiều năm để hoàn thiện kỹ năng này.`,
        `Đây là một khía cạnh quan trọng của ${artistSpecialty}. Hãy để tôi giải thích chi tiết hơn...`,
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
    <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col h-96">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Trò chuyện với AI {artistName}</h3>
        <p className="text-xs text-muted-foreground">Hỏi về {artistSpecialty}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted text-foreground rounded-bl-none"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
              <Loader size={16} className="animate-spin" />
              <span className="text-sm">Đang suy nghĩ...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-border p-4 bg-background">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="sm"
            className="bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            <Send size={16} />
          </Button>
        </div>
      </form>
    </div>
  )
}
