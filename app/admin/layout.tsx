import AdminSidebar from "@/components/admin-sidebar"
import { AuthShell } from "@/components/auth-shell"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthShell>
            <div className="flex min-h-screen bg-background pt-20">
                <AdminSidebar />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </AuthShell>
    )
}
