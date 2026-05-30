"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, api, startKeepAlive, invalidateTokenCache } from '@/lib/api';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    firebaseUser: null,
    logout: () => { },
    refreshUser: async () => { },
    isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        startKeepAlive(); // Ping backend mỗi 10 phút để tránh Render cold start
        const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
            setFirebaseUser(fUser);
            setIsLoading(false);
            if (fUser) {
                // Security Check: Token Rotation & Age
                const tokenResult = await fUser.getIdTokenResult();
                const tokenIssuedAt = new Date(parseInt(tokenResult.issuedAtTime) * 1000);
                const now = new Date();
                // If token is older than 1 hour (optional strict check), force refresh
                // Firebase SDK handles rotation automatically, but this ensures we don't use stale tokens from storage
                const tokenAgeMinutes = (now.getTime() - tokenIssuedAt.getTime()) / 1000 / 60;
                if (tokenAgeMinutes > 60) {
                    await fUser.getIdToken(true);
                }

                const requireEmailVerification = process.env.NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION !== 'false';

                if (!requireEmailVerification || fUser.emailVerified) {
                    if (isSyncing) return; // Prevent race conditions

                    try {
                        const userData = await api.auth.getProfile();
                        console.log("AuthProvider: User profile fetched", userData);
                        setUser(userData);
                    } catch (error: any) {
                        console.error("User authenticated in Firebase but profile fetch failed or backend unreachable.", error);
                        // Keep Firebase session active even if backend profile is temporarily unavailable.
                    }
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const refreshUser = async () => {
        if (!firebaseUser) return;
        try {
            const userData = await api.auth.getProfile(true);
            setUser(userData);
        } catch (error) {
            console.error("Failed to refresh user profile", error);
        }
    };

    const logout = async () => {
        invalidateTokenCache(); // Xóa cached token khi logout
        const { firebaseAuth } = await import('@/lib/firebase/auth');
        await firebaseAuth.logout();
        setUser(null);
        setFirebaseUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, firebaseUser, logout, refreshUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
