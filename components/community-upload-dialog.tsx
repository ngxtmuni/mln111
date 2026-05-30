"use client"

import { CommunityPostEditorDialog } from "@/components/community-post-editor-dialog"

interface CommunityUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (postId: string) => void
}

export function CommunityUploadDialog(props: CommunityUploadDialogProps) {
  return <CommunityPostEditorDialog {...props} mode="create" />
}
