"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Star, CheckCircle } from "lucide-react"

interface ArtistCardProps {
  id: number
  name: string
  specialty: string
  bio: string
  image: string
  location: string
  followers: number
  rating: number
  verified: boolean
}

export default function ArtistCardDark({
  id,
  name,
  specialty,
  bio,
  image,
  location,
  followers,
  rating,
  verified,
}: ArtistCardProps) {
  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-primary transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-zinc-800">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        {verified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1.5 flex items-center justify-center">
            <CheckCircle size={16} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white group-hover:text-primary/80 transition-colors">
          {name}
        </h3>
        <p className="text-primary text-sm font-semibold mb-3">{specialty}</p>

        <p className="text-gray-400 text-sm mb-4 h-10 line-clamp-2">{bio}</p>

        {/* Info */}
        <div className="space-y-2.5 mb-5 text-sm text-gray-300">
          <div className="flex items-center gap-2.5">
            <MapPin size={16} className="text-gray-400" />
            <span>{location}</span>
          </div>
        </div>

        {/* Button */}
        <Link href={`/artists/${id}`} passHref>
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors">
            Xem hồ sơ
          </Button>
        </Link>
      </div>
    </div>
  )
}
