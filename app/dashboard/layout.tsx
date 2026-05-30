import DashboardSidebar from "@/components/dashboard-sidebar"
import { AuthShell } from "@/components/auth-shell"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthShell>
            <div className="flex min-h-screen bg-background pt-20">
                <DashboardSidebar />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </AuthShell>
    )
}
