'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ExhibitionJourney, api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';

interface JourneyContextType {
    journey: ExhibitionJourney | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    loadJourney: (userEmail?: string) => Promise<void>;
    checkin: (stage: number, file: File) => Promise<void>;
    clearJourney: () => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export function JourneyProvider({ children }: { children: React.ReactNode }) {
    const [journey, setJourney] = useState<ExhibitionJourney | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    const [email, setEmail] = useState<string | null>(null);
    const [participantName, setParticipantName] = useState<string | null>(null);

    // Wait for auth to resolve before deciding the source of email
    useEffect(() => {
        if (authLoading) return;
        const skipAuthenticatedAutoSync = localStorage.getItem('exhibitionSkipAuthAutoSync') === 'true';

        if (user?.email && !skipAuthenticatedAutoSync) {
            // Logged-in user: auto-sync with their account email & name
            setEmail(user.email);
            setParticipantName(user.name ?? null);
            // Also persist to localStorage so thong-diep page can read it
            localStorage.setItem('exhibitionEmail', user.email);
            if (user.name) localStorage.setItem('exhibitionParticipantName', user.name);
        } else {
            // Guest: fall back to localStorage
            const storedEmail = localStorage.getItem('exhibitionEmail');
            const storedName = localStorage.getItem('exhibitionParticipantName');
            if (storedEmail) {
                setEmail(storedEmail);
                setParticipantName(storedName);
            } else {
                setJourney(null);
                setIsLoading(false);
                router.push('/exhibition/canso');
            }
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        if (email) {
            loadJourney(email).finally(() => setIsLoading(false));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, participantName]);

    const loadJourney = async (userEmail?: string) => {
        const targetEmail = userEmail ?? email;
        if (!targetEmail) {
            setJourney(null);
            setError('Không tìm thấy email để tải hành trình.');
            return;
        }

        try {
            setError(null);
            const resolvedName = user?.name ?? participantName ?? undefined;
            const data = await api.exhibition.getJourney(targetEmail, resolvedName);
            setJourney(data);
        } catch {
            setJourney(null);
            setError('Không thể tải hành trình của bạn lúc này. Vui lòng thử lại sau.');
        }
    };

    const checkin = async (stage: number, file: File) => {
        if (!journey || !email || isSaving) return;
        setIsSaving(true);
        try {
            setError(null);
            const updated = await api.exhibition.checkin(email, stage, file);
            setJourney(updated);
        } catch (err: any) {
            setError(err?.message || 'Không thể upload ảnh, vui lòng thử lại.');
            throw err;
        } finally {
            setIsSaving(false);
        }
    };

    const clearJourney = () => {
        localStorage.setItem('exhibitionSkipAuthAutoSync', 'true');
        setEmail(null);
        setParticipantName(null);
        setJourney(null);
        localStorage.removeItem('exhibitionEmail');
        localStorage.removeItem('exhibitionParticipantName');
        router.push('/exhibition/canso');
    };

    return (
        <JourneyContext.Provider value={{ journey, isLoading, isSaving, error, loadJourney, checkin, clearJourney }}>
            {children}
        </JourneyContext.Provider>
    );
}

export const useJourney = () => {
    const context = useContext(JourneyContext);
    if (context === undefined) {
        throw new Error('useJourney must be used within a JourneyProvider');
    }
    return context;
};
