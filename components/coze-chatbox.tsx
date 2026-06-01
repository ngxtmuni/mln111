"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, X, Loader2 } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface CozeChatboxProps {
  onClose?: () => void
}

export default function CozeChatbox({ onClose }: CozeChatboxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! 👋 Tôi là trợ lý AI của Kết Nối Di Sản. Có thể giúp gì cho bạn?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log("💬 [Chat] Chatbox component mounted")
    return () => {
      console.log("💬 [Chat] Chatbox component unmounted")
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    console.log("🚀 [Chat] Sending message:", input)

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call Coze API
      console.log("📡 [Chat] Calling /api/coze with payload:", {
        message: input,
        conversation_id: "default",
      })

      const response = await fetch("/api/coze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          conversation_id: "default",
        }),
      })

      console.log("📦 [Chat] API Response Status:", response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("❌ [Chat] API Error Response:", errorData)
        throw new Error(errorData.error || "Failed to get response")
      }

      const data = await response.json()
      console.log("✅ [Chat] API Success Response:", data)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.",
        sender: "bot",
        timestamp: new Date(),
      }

      console.log("💬 [Chat] Adding bot message:", botMessage.text)
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("❌ [Chat] Error sending message to Coze:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Xin lỗi, có lỗi xảy ra: ${error instanceof Error ? error.message : "Vui lòng thử lại."}`,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      console.log("✋ [Chat] Message processing complete")
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col h-full w-full shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/10 p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground text-base">
            Kết Nối Di Sản
          </h3>
          <p className="text-xs text-muted-foreground">
            Trợ lý AI cho di sản văn hóa
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm leading-relaxed ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted text-foreground rounded-bl-none border border-border"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-2 rounded-lg rounded-bl-none border border-border flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Đang gõ...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-border p-4 bg-card">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi về di sản..."
            className="flex-1 px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="rounded-lg"
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  )
}
