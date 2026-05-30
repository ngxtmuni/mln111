"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, User } from "lucide-react"

interface Submission {
  id: number;
  title: string;
  author: string;
  votes: number;
  imageUrl: string;
}

interface ContestSubmissionsProps {
  items: Submission[];
}

export default function ContestSubmissions({ items }: ContestSubmissionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-0">
            <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <div className="flex items-center text-muted-foreground mt-2">
                <User className="w-4 h-4 mr-2" />
                <span>{item.author}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-red-500">
                  <Heart className="w-5 h-5 mr-2" />
                  <span>{item.votes}</span>
                </div>
                <Button className="bg-primary hover:bg-primary">
                  Bình chọn
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
