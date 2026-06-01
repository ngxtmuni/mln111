"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"
import CozeChatbox from "./coze-chatbox"
import { Button } from "@/components/ui/button"

export default function CozeChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    console.log("🎯 [Widget] Chat widget mounted")
    setIsMounted(true)
    return () => {
      console.log("🎯 [Widget] Chat widget unmounted")
    }
  }, [])

  const handleToggle = (open: boolean) => {
    console.log("🎯 [Widget] Chat toggled:", open ? "OPEN" : "CLOSED")
    setIsOpen(open)
  }

  if (!isMounted) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen ? (
        // Chat Window
        <div className="w-96 h-screen max-h-96 bg-card rounded-lg shadow-2xl border border-border overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CozeChatbox onClose={() => handleToggle(false)} />
        </div>
      ) : (
        // Chat Button
        <Button
          onClick={() => handleToggle(true)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-primary hover:bg-primary/90"
        >
          <MessageCircle size={24} />
        </Button>
      )}
    </div>
  )
}
