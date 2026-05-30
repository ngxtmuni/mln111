"use client"

import { useState } from "react"

interface CommunityTabsProps {
  onTabChange: (tab: string) => void
}

export default function CommunityTabs({ onTabChange }: CommunityTabsProps) {
  const [activeTab, setActiveTab] = useState("gallery")

  const tabs = [
    { id: "gallery", label: "Thư viện ảnh" },
    { id: "forum", label: "Diễn đàn" },
    { id: "contests", label: "Cuộc thi" },
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange(tabId)
  }

  return (
    <div className="flex gap-2 border-b border-border mb-8 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
            activeTab === tab.id
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
