"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { applyActionCode } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

function ActionHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");
    const actionCode = searchParams.get("oobCode");

    useEffect(() => {
        if (!mode || !actionCode) return;

        const handleAction = async () => {
            switch (mode) {
                case "resetPassword":
                    // Redirect to the confirm-forgot-password page with the code
                    router.push(`/confirm-forgot-password?oobCode=${actionCode}`);
                    break;
                case "recoverEmail":
                    // Handle email recovery (not implemented yet, but good to have)
                    break;
                case "verifyEmail":
                    try {
                        await applyActionCode(auth, actionCode);
                        // Force logout to ensure next login gets a fresh token with emailVerified: true
                        await auth.signOut();
                        // Redirect to login with verified flag
                        router.push("/login?verified=true");
                    } catch (error) {
                        console.error("Email verification failed", error);
                        router.push("/login?error=verification_failed");
                    }
                    break;
                default:
                    break;
            }
        };

        handleAction();
    }, [mode, actionCode, router]);

    return null;
}

export function FirebaseActionHandler() {
    return (
        <Suspense fallback={null}>
            <ActionHandler />
        </Suspense>
    );
}
