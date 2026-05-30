'use client'

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LibrarySearchProps {
  onSearch: (query: string) => void
  onFilterChange: (filter: string) => void
}

export default function LibrarySearchDark({ onSearch, onFilterChange }: LibrarySearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "article", label: "Bài viết" },
    { id: "video", label: "Video" },
    { id: "document", label: "Tài liệu" },
    { id: "image", label: "Hình ảnh" },
    { id: "audio", label: "Âm thanh" },
  ]

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  const handleFilter = (filterId: string) => {
    setSelectedFilter(filterId)
    onFilterChange(filterId)
  }

  return (
    <div className="space-y-6 mb-12">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm bài viết, video, tài liệu..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-12 pr-4 py-3 border border-zinc-700 rounded-lg bg-zinc-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={selectedFilter === filter.id ? "default" : "outline"}
            onClick={() => handleFilter(filter.id)}
            className={`transition-colors duration-300 rounded-full px-6 py-2 text-sm font-semibold 
              ${
                selectedFilter === filter.id
                  ? "bg-primary hover:bg-primary text-white border-transparent"
                  : "bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }`}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
