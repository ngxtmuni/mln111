"use client"

import Masonry from "react-responsive-masonry"
import { Card, CardContent } from "@/components/ui/card"

interface GalleryItem {
  id: number;
  type: "image" | "text";
  src?: string;
  alt?: string;
  content?: string;
  author: string;
  likes?: number;
  comments?: number;
}

interface CommunityGalleryProps {
  items: GalleryItem[];
}

export default function CommunityGallery({ items }: CommunityGalleryProps) {
  return (
    <Masonry columnsCount={3} gutter="1rem">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            {item.type === 'image' && item.src && (
              <img src={item.src} alt={item.alt || ""} className="w-full h-auto object-cover rounded-lg" />
            )}
            {item.type === 'text' && (
              <p className="text-lg">{item.content}</p>
            )}
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <span>By {item.author}</span>
              {item.type === 'image' && (
                <div className="flex items-center space-x-4">
                  <span>Likes: {item.likes}</span>
                  <span>Comments: {item.comments}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </Masonry>
  )
}
