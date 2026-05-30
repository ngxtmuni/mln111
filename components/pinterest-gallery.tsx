"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Heart, MessageCircle } from "lucide-react"

interface GalleryItem {
  id: number
  title: string
  image: string
  author: string
  likes: number
  comments: number
  category: string
}

interface PinterestGalleryProps {
  items: GalleryItem[]
}

export default function PinterestGallery({ items }: PinterestGalleryProps) {
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set())

  const toggleLike = (e: React.MouseEvent, itemId: number) => {
    e.preventDefault()
    e.stopPropagation()
    const newLiked = new Set(likedItems)
    if (newLiked.has(itemId)) {
      newLiked.delete(itemId)
    } else {
      newLiked.add(itemId)
    }
    setLikedItems(newLiked)
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {items.map((item) => (
        <Link key={item.id} href={`/community/${item.id}`}>
          <div className="group relative overflow-hidden rounded-lg break-inside-avoid cursor-pointer bg-muted">
            {/* Image Container */}
            <div className="relative overflow-hidden bg-muted">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">{item.category}</p>
                <h3 className="font-bold text-sm line-clamp-2">{item.title}</h3>
                <p className="text-xs text-gray-200 mt-1">Bởi {item.author}</p>
              </div>

              {/* Action Buttons on Hover */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Like Button */}
                <button
                  onClick={(e) => toggleLike(e, item.id)}
                  className="bg-white/90 hover:bg-white rounded-full p-2 transition-all duration-200 shadow-lg"
                >
                  <Heart
                    size={18}
                    className={likedItems.has(item.id) ? "fill-primary text-primary" : "text-gray-600"}
                  />
                </button>

                {/* Comment Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  className="bg-white/90 hover:bg-white rounded-full p-2 transition-all duration-200 shadow-lg"
                >
                  <MessageCircle size={18} className="text-gray-600" />
                </button>
              </div>

              {/* Stats at Bottom */}
              <div className="absolute bottom-2 left-2 flex gap-3 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full">
                  <Heart size={14} />
                  <span>{item.likes}</span>
                </div>
                <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full">
                  <MessageCircle size={14} />
                  <span>{item.comments}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
