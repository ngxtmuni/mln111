import ArtistDetailClient from "@/components/artist-detail-client";
import { allArtists } from "@/lib/artists";
import { use } from 'react';

const getArtistById = (id: number) => {
  const artist = allArtists.find((a) => a.id === id);
  return artist;
};

export default function ArtistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = Number.parseInt(resolvedParams.id, 10);
  const artist = getArtistById(id);

  return <ArtistDetailClient artist={artist} />;
}