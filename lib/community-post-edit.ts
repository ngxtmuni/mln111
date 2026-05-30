import { CommunityPostDetail, CommunityPostEditorMedia } from "@/lib/api";

export function buildEditableCommunityMedia(post: CommunityPostDetail): CommunityPostEditorMedia[] {
  return [...(post.media ?? [])]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((media) => ({
      clientId: media.id,
      id: media.id,
      caption: media.caption ?? "",
      previewUrl: media.imageUrl,
      isExisting: true,
    }));
}

export function createEditableCommunityMediaFromFile(file: File): CommunityPostEditorMedia {
  return {
    clientId: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
    caption: "",
    previewUrl: URL.createObjectURL(file),
    file,
    isExisting: false,
  };
}

export function moveCommunityMediaItem(
  items: CommunityPostEditorMedia[],
  fromIndex: number,
  toIndex: number,
): CommunityPostEditorMedia[] {
  if (fromIndex === toIndex || toIndex < 0 || toIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}
