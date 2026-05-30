"use client"

import type React from "react"
import { AuthProvider } from "@/components/auth-provider"
import { FirebaseActionHandler } from "@/components/auth/firebase-action-handler"
import Navigation from "@/components/navigation"

export function NavigationShell({ children }: { children?: React.ReactNode }) {
  return (
    <AuthProvider>
      <FirebaseActionHandler />
      <Navigation />
      {children}
    </AuthProvider>
  )
}
