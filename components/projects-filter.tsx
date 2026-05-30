"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ProjectsFilterProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  category: string
  status: string
  search: string
}

export default function ProjectsFilter({ onFilterChange }: ProjectsFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    status: "all",
    search: "",
  })

  const categories = [
    { id: "all", label: "Tất cả" },
    { id: "art", label: "Mỹ thuật" },
    { id: "music", label: "Âm nhạc" },
    { id: "architecture", label: "Kiến trúc" },
    { id: "craft", label: "Thủ công" },
    { id: "literature", label: "Văn học" },
  ]

  const statuses = [
    { id: "all", label: "Tất cả" },
    { id: "active", label: "Đang diễn ra" },
    { id: "upcoming", label: "Sắp tới" },
    { id: "completed", label: "Hoàn thành" },
  ]

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const resetFilters = { category: "all", status: "all", search: "" }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Tìm kiếm</label>
        <input
          type="text"
          placeholder="Nhập tên dự án..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">Danh mục</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={filters.category === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("category", cat.id)}
              className={filters.category === cat.id ? "bg-primary hover:bg-primary/90" : ""}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">Trạng thái</label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Button
              key={status.id}
              variant={filters.status === status.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("status", status.id)}
              className={filters.status === status.id ? "bg-primary hover:bg-primary/90" : ""}
            >
              {status.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-2 bg-transparent"
      >
        <X size={16} />
        Xóa bộ lọc
      </Button>
    </div>
  )
}
