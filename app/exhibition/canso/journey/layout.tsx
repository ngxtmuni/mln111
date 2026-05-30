import { JourneyProvider } from './context';
import { AuthShell } from "@/components/auth-shell"

export default function JourneyLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthShell>
            <JourneyProvider>
                {children}
            </JourneyProvider>
        </AuthShell>
    );
}
