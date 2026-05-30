import { Suspense } from "react"
import AdminSubmissionsContent from "./content"
import { Loader2 } from "lucide-react"

export default function AdminSubmissionsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        }>
            <AdminSubmissionsContent />
        </Suspense>
    )
}
