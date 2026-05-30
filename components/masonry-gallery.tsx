"use client"

import React, { useCallback, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Heart, MessageCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { CommunityPost } from "@/lib/api"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface MasonryItemProps {
  item: CommunityPost
  index: number
  itemRef: (el: HTMLDivElement | null) => void
  resizeGridItem: () => void
  onClick: (id: string) => void
  currentUserId?: string | null
  isAuthenticated?: boolean
  onToggleLike?: (id: string) => void
  onEditPost?: (id: string) => void
  onDeletePost?: (id: string) => void
}

const imageCardVariants = [
  "aspect-[5/6]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[6/5]",
] as const

const MasonryItem: React.FC<MasonryItemProps> = ({
  item,
  index,
  itemRef,
  resizeGridItem,
  onClick,
  currentUserId,
  isAuthenticated,
  onToggleLike,
  onEditPost,
  onDeletePost,
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const hasImage = Boolean(item.coverUrl || (item.imageUrls && item.imageUrls.length > 0))
  const isFeatured = hasImage && index % 13 === 0
  const imageAspectClass = imageCardVariants[index % imageCardVariants.length]
  const isOwner = Boolean(currentUserId && currentUserId === item.authorId)

  useEffect(() => {
    const currentContentRef = contentRef.current
    if (!currentContentRef) return

    const observer = new ResizeObserver(() => {
      resizeGridItem()
    })
    observer.observe(currentContentRef)
    return () => observer.disconnect()
  }, [resizeGridItem])

  return (
    <motion.div
      ref={itemRef}
      className={isFeatured ? "item md:col-span-2" : "item"}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        ref={contentRef}
        className={`item-content relative group cursor-pointer overflow-hidden rounded-lg border border-white/5 shadow-sm ${
          hasImage ? `${isFeatured ? "aspect-[5/4]" : imageAspectClass} bg-neutral-950` : "bg-gradient-to-br from-neutral-800 to-neutral-950 p-5 sm:p-6"
        }`}
        onClick={() => onClick(item.id)}
      >
        {isOwner && (onEditPost || onDeletePost) && (
          <div className="absolute right-3 top-3 z-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
                <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-black/60 text-white hover:bg-black/75">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
                {onEditPost && (
                  <DropdownMenuItem onClick={() => onEditPost(item.id)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                )}
                {onDeletePost && (
                  <DropdownMenuItem onClick={() => onDeletePost(item.id)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa bài
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {hasImage ? (
          <img
            src={item.coverUrl || item.imageUrls?.[0]}
            alt={item.title || "Community post"}
            className="absolute inset-0 h-full w-full object-cover"
            onLoad={resizeGridItem}
          />
        ) : (
          <div className="flex h-fit flex-col justify-start">
            <div className="mb-3 text-primary/40">
              <MessageCircle className="h-7 w-7" />
            </div>
            <p className="break-words whitespace-pre-wrap text-sm italic leading-relaxed text-white/80">
              "{item.content || "Không có nội dung văn bản"}"
            </p>
          </div>
        )}

        <div className="absolute inset-0 flex flex-col justify-between bg-black/50 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="truncate text-lg font-bold text-white drop-shadow-md">{item.title}</div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/50 bg-gray-300">
                {item.authorAvatarUrl ? (
                  <img src={item.authorAvatarUrl} alt={item.authorName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white text-sm font-bold uppercase text-gray-700">
                    {item.authorName?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="truncate text-sm font-medium text-white drop-shadow-md">{item.authorName}</span>
                  {item.authorRole === "artist" && (
                    <span className="shrink-0 rounded border border-primary/30 bg-primary/20 px-1 py-0.5 text-[8px] font-bold uppercase tracking-tighter text-primary-foreground">
                      Nghệ nhân
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-white drop-shadow-md">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  className="flex items-center space-x-1"
                  disabled={!isAuthenticated || !onToggleLike}
                  onClick={(event) => {
                    event.stopPropagation()
                    if (isAuthenticated && onToggleLike) {
                      onToggleLike(item.id)
                    }
                  }}
                >
                  <Heart className={`h-4 w-4 ${item.hasLiked ? "fill-red-500 text-red-500" : ""}`} />
                  <span className="text-sm font-medium">{item.totalLikes || 0}</span>
                </button>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.totalComments || 0}</span>
                </div>
              </div>
              {!isOwner && <MoreHorizontal className="h-5 w-5 opacity-70" />}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface MasonryGalleryProps {
  items: CommunityPost[]
  onPostClick: (id: string) => void
  currentUserId?: string | null
  isAuthenticated?: boolean
  onToggleLike?: (id: string) => void
  onEditPost?: (id: string) => void
  onDeletePost?: (id: string) => void
}

const MasonryGallery: React.FC<MasonryGalleryProps> = ({
  items,
  onPostClick,
  currentUserId,
  isAuthenticated,
  onToggleLike,
  onEditPost,
  onDeletePost,
}) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const resizeGridItem = useCallback((item: HTMLDivElement | null) => {
    const grid = gridRef.current
    if (!grid || !item) return

    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-auto-rows"))
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-row-gap"))

    const itemContent = item.querySelector(".item-content") as HTMLDivElement
    if (!itemContent) return

    const rowSpan = Math.ceil((itemContent.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap))
    item.style.gridRowEnd = `span ${rowSpan}`
  }, [])

  const resizeAllGridItems = useCallback(() => {
    itemRefs.current.forEach((item) => {
      resizeGridItem(item)
    })
  }, [resizeGridItem])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(resizeAllGridItems, 200)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", handleResize)
    }
  }, [resizeAllGridItems])

  useEffect(() => {
    const timeoutId = setTimeout(resizeAllGridItems, 200)
    return () => clearTimeout(timeoutId)
  }, [items, resizeAllGridItems])

  return (
    <div ref={gridRef} className="grid grid-flow-dense grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4" style={{ gridAutoRows: "20px" }}>
      {items.map((item, index) => (
        <MasonryItem
          key={item.id}
          item={item}
          index={index}
          onClick={onPostClick}
          currentUserId={currentUserId}
          isAuthenticated={isAuthenticated}
          onToggleLike={onToggleLike}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
          resizeGridItem={() => resizeGridItem(itemRefs.current.get(item.id) || null)}
          itemRef={(el) => {
            if (el) itemRefs.current.set(item.id, el)
            else itemRefs.current.delete(item.id)
          }}
        />
      ))}
    </div>
  )
}

export default MasonryGallery
