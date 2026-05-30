import type React from "react"
import { AuthShell } from "@/components/auth-shell"

export default function ContestsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthShell>{children}</AuthShell>
}
