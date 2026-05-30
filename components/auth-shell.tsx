"use client"

import type React from "react"
import { AuthProvider } from "@/components/auth-provider"

export function AuthShell({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
