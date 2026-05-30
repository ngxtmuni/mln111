import { AuthShell } from "@/components/auth-shell";

export default function ThongDiepLayout({ children }: { children: React.ReactNode }) {
    return <AuthShell>{children}</AuthShell>;
}
