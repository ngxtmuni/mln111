import { auth } from "./firebase/config";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ketnoidisan-be.onrender.com';

export interface User {
    id: string;
    name: string;
    email: string;
    displayName?: string;
    bio?: string;
    phoneNumber?: string;
    avatarUrl?: string;
    coverUrl?: string;
    role: string;
}

export interface Contest {
    id: string;
    title: string;
    description: string;
    coverImageUrl?: string;
    status: 'UPCOMING' | 'OPEN' | 'CLOSED' | 'ENDED';
    submitOpenAt?: string;
    submitCloseAt?: string;
}

export interface Submission {
    id: string;
    title: string;
    description: string;
    content?: string;
    authorId: string;
    authorName: string;
    contestId: string;
    categoryId: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'pending' | 'approved' | 'rejected' | 'hidden';
    mediaUrl?: string;
    thumbnailUrl?: string;
    voteCount: number;
    createdAt: string;
    media?: any[];
}

export interface News {
    id: string;
    title: string;
    summary?: string;
    content: string;
    coverImageUrl?: string;
    coverImage?: string; // Add for compatibility
    authorId: string;
    publishedAt: string;
    status: 'DRAFT' | 'PUBLISHED';
}

export interface JourneyCheckin {
    id: string;
    stage: number;
    imageUrl: string;
    createdAt: string;
}

export interface ExhibitionJourney {
    id: string;
    code: string;
    userId?: string;
    userName?: string;
    userEmail?: string;
    messageNumber?: number;
    messageTitle?: string;
    messageClaimedAt?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    createdAt: string;
    updatedAt: string;
    checkins: JourneyCheckin[];
}

export interface PageResponse<T> {
    items: T[];
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface ExhibitionJourneyAdminStats {
    completedJourneys: number;
    inProgressJourneys: number;
    pendingJourneys: number;
    totalCheckins: number;
}

export interface ExhibitionJourneyAdminPageResponse extends PageResponse<ExhibitionJourney> {
    stats: ExhibitionJourneyAdminStats;
}

// ─── Token Cache ─────────────────────────────────────────────────────────────
let _cachedToken: string | null = null;
let _tokenExpiresAt = 0;
let _cachedProfile: User | null = null;
let _profilePromise: Promise<User> | null = null;

class ApiRequestError extends Error {}

async function getAuthToken(): Promise<string | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    const now = Date.now();
    if (_cachedToken && now < _tokenExpiresAt) return _cachedToken;
    _cachedToken = await currentUser.getIdToken();
    _tokenExpiresAt = now + 5 * 60 * 1000; // 5 mins
    return _cachedToken;
}

async function waitForAuthToken(timeoutMs = 10000, forceRefresh = false): Promise<string | null> {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
        if (auth.currentUser) {
            if (forceRefresh) {
                const refreshed = await auth.currentUser.getIdToken(true);
                _cachedToken = refreshed;
                _tokenExpiresAt = Date.now() + 5 * 60 * 1000;
                return refreshed;
            }

            return getAuthToken();
        }

        await new Promise((resolve) => setTimeout(resolve, 250));
    }

    return null;
}

export function invalidateTokenCache() {
    _cachedToken = null;
    _tokenExpiresAt = 0;
    _cachedProfile = null;
    _profilePromise = null;
}

// ─── Keep-Alive Ping ──────────────────────────────────────────────────────────
let _keepAliveInterval: ReturnType<typeof setInterval> | null = null;

export function startKeepAlive() {
    if (_keepAliveInterval || typeof window === 'undefined') return;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return;
    const ping = () => fetch(`${API_URL}/health`, { method: 'GET' }).catch(() => {});
    ping();
    _keepAliveInterval = setInterval(ping, 5 * 60 * 1000);
}

export function stopKeepAlive() {
    if (_keepAliveInterval) {
        clearInterval(_keepAliveInterval);
        _keepAliveInterval = null;
    }
}

// ─── Core Request ─────────────────────────────────────────────────────────────
async function request<T>(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const token = await getAuthToken();

    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) headers['Authorization'] = `Bearer ${token}`;

    const isReadOnly = !options.method || options.method === 'GET';
    const cacheConfig: RequestCache = isReadOnly ? 'default' : 'no-store';

    try {
        const response = await fetch(url, {
            ...options,
            headers,
            cache: cacheConfig,
        });

        if (!response.ok) {
            if (response.status >= 500 && retryCount < 1) {
                await new Promise(resolve => setTimeout(resolve, 800));
                return request<T>(endpoint, options, retryCount + 1);
            }

            const errorMessage = await readErrorMessage(response);
            throw new ApiRequestError(errorMessage || `API Error: ${response.status}`);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : {} as T;
    } catch (error: any) {
        if (retryCount < 1 && !(error instanceof ApiRequestError)) {
            await new Promise(resolve => setTimeout(resolve, 800));
            return request<T>(endpoint, options, retryCount + 1);
        }
        throw error;
    }
}

async function readErrorMessage(response: Response): Promise<string | null> {
    const text = await response.text().catch(() => '');
    if (!text) return null;

    try {
        const errorData = JSON.parse(text);
        if (typeof errorData?.message === 'string') return errorData.message;
        if (typeof errorData?.error === 'string') return errorData.error;
    } catch {
        return text;
    }

    return text;
}

async function uploadRequest<T>(endpoint: string, file: File, fieldName: string = 'file', method: 'POST' | 'PUT' = 'POST'): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    let token = await getAuthToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed: ${response.status}`);
    }
    return response.json();
}

async function getProfileCached(forceRefresh = false): Promise<User> {
    if (forceRefresh) {
        _cachedProfile = null;
        _profilePromise = null;
    }

    if (_cachedProfile && !forceRefresh) {
        return _cachedProfile;
    }

    if (_profilePromise && !forceRefresh) {
        return _profilePromise;
    }

    _profilePromise = request<User>('/api/v1/users/profile')
        .then((profile) => {
            _cachedProfile = profile;
            return profile;
        })
        .finally(() => {
            _profilePromise = null;
        });

    return _profilePromise;
}

export const api = {
    auth: {
        register: (data: { email: string; password: string; fullName: string; turnstileToken?: string }) => request<any>('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(data) }),
        login: (data: any) => request<any>('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(data) }),
        signup: (data: any) => request<User>('/api/v1/users', { method: 'POST', body: JSON.stringify(data) }),
        getProfile: (forceRefresh = false) => getProfileCached(forceRefresh),
        updateProfile: async (data: Partial<User>) => {
            const response = await request<User>('/api/v1/users/profile', { method: 'PUT', body: JSON.stringify(data) });
            _cachedProfile = response;
            _profilePromise = null;
            return response;
        },
        uploadAvatar: async (file: File) => {
            const response = await uploadRequest<any>('/api/v1/users/profile/avatar', file, 'file', 'PUT');
            _cachedProfile = null;
            _profilePromise = null;
            return response;
        },
        uploadCover: async (file: File) => {
            const response = await uploadRequest<any>('/api/v1/users/profile/cover', file, 'file', 'PUT');
            _cachedProfile = null;
            _profilePromise = null;
            return response;
        },
        forgotPassword: (email: string) => request<any>(`/api/v1/users/forgot-password`, { method: 'POST', body: JSON.stringify({ email }) }),
        resetPassword: (token: string, newPassword: string) => request<any>(`/api/v1/users/reset-password`, { method: 'POST', body: JSON.stringify({ token, newPassword }) }),
    },
    contests: {
        getAll: (params?: any) => request<any>(`/api/v1/contests?${new URLSearchParams(params)}`),
        getById: (id: string) => request<Contest>(`/api/v1/contests/${id}`),
        getCategories: (id: string) => request<any[]>(`/api/v1/contests/${id}/categories`),
        getSubmissions: (id: string, params?: any) => request<any>(`/api/v1/contests/${id}/submissions?${new URLSearchParams(params)}`),
        uploadSubmission: (data: any) => request<any>('/api/v1/submissions', { method: 'POST', body: JSON.stringify(data) }),
        updateSubmission: (id: string, data: any) => request<any>(`/api/v1/submissions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        signup: (id: string, data: any = {}) => request<any>(`/api/v1/contests/${id}/signup`, { method: 'POST', body: JSON.stringify(data) }),
        getSignupStatus: (id: string) => request<any>(`/api/v1/contests/${id}/signup/status`),
        getMySubmissions: (id: string) => request<Submission[]>(`/api/v1/contests/${id}/my-submissions`),
        getMyVotedSubmissions: (id: string) => request<Submission[]>(`/api/v1/contests/${id}/my-voted-submissions`),
        getSubmissionDetail: (id: string) => request<Submission>(`/api/v1/submissions/${id}`),
    },
    submissions: {
        vote: (id: string, turnstileToken?: string) => request<any>(`/api/v1/submissions/${id}/vote`, { method: 'POST', body: JSON.stringify({ value: 1, turnstileToken }) }),
        unvote: (id: string) => request<any>(`/api/v1/submissions/${id}/vote`, { method: 'DELETE' }),
        report: (id: string, reason: string) => request<any>(`/api/v1/submissions/${id}/report`, { method: 'POST', body: JSON.stringify({ reason }) }),
    },
    media: {
        upload: (file: File) => uploadRequest<any>('/api/v1/media/upload', file),
        getPresignedUrl: (fileName: string, contentType: string, context: string = 'general') =>
            request<any>(`/api/v1/media/presigned-url?${new URLSearchParams({ fileName, contentType, context })}`, { method: 'POST' }),
        saveMetadata: (data: { mediaUrl: string, mediaType: string, fileName: string, fileSize: number, context: string }) =>
            request<any>('/api/v1/media/metadata', { method: 'POST', body: JSON.stringify(data) }),
        delete: (id: string) => request<void>(`/api/v1/media/${id}`, { method: 'DELETE' }),
    },
    admin: {
        submissions: {
            getAll: (params: any) => request<any>(`/api/v1/admin/submissions?${new URLSearchParams(params)}`),
            updateStatus: (id: string, status: string, rejectReason?: string) =>
                request<any>(`/api/v1/admin/submissions/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, rejectReason }) }),
        },
        news: {
            getAll: (params?: any) => request<any>(`/api/v1/news/admin/news?${new URLSearchParams(params)}`),
            getById: (id: string) => request<News>(`/api/v1/news/admin/news/${id}`),
            create: (data: any) => request<News>('/api/v1/news/admin/news', { method: 'POST', body: JSON.stringify(data) }),
            update: (id: string, data: any) => request<News>(`/api/v1/news/admin/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
            delete: (id: string) => request<any>(`/api/v1/news/admin/news/${id}`, { method: 'DELETE' }),
            updateImage: (id: string, file: File) => uploadRequest<boolean>(`/api/v1/news/admin/news/${id}/image`, file),
        },
        reports: {
            getPending: (params: any = {}) => request<any>(`/api/v1/admin/reports/pending?${new URLSearchParams(params)}`),
            getPendingCount: () => request<number>('/api/v1/admin/reports/pending-count'),
            resolve: (id: string, status: string) => request<void>(`/api/v1/admin/reports/${id}/resolve?status=${status}`, { method: 'PUT' }),
        }
    },
    notifications: {
        getAll: (params?: any) => request<any>(`/api/v1/notifications?${new URLSearchParams(params)}`),
        getUnreadCount: () => request<number>('/api/v1/notifications/unread-count'),
        markAsRead: (id: string) => request<any>(`/api/v1/notifications/${id}/read`, { method: 'PUT' }),
    },
    judging: {
        getSubmissions: (contestId: string) =>
            request<any[]>(`/api/v1/judging/submissions?contestId=${contestId}`),
        submitScore: (submissionId: string, data: any) =>
            request<any>(`/api/v1/judging/submissions/${submissionId}/score`, { method: 'POST', body: JSON.stringify(data) }),
        getMyScore: (submissionId: string) =>
            request<any>(`/api/v1/judging/submissions/${submissionId}/my-score`),
        getAdminResults: (contestId: string) =>
            request<any>(`/api/v1/judging/admin/results?contestId=${contestId}`),
        getAdminProgress: (contestId: string) =>
            request<any>(`/api/v1/judging/admin/progress?contestId=${contestId}`),
        getPublicResults: (contestId: string, params?: { page?: number; size?: number }) =>
            request<any>(`/api/v1/judging/public/results?${new URLSearchParams({
                contestId,
                page: String(params?.page ?? 0),
                size: String(params?.size ?? 12),
            })}`),
    },
    exhibition: {
        getJourney: (email: string, name?: string) =>
            request<ExhibitionJourney>(`/api/v1/exhibition/journey/me?${new URLSearchParams({
                email,
                ...(name ? { name } : {}),
            })}`),
        claimMessage: (email: string, number: number, title: string) =>
            request<ExhibitionJourney>(`/api/v1/exhibition/journey/me/message?email=${encodeURIComponent(email)}`, {
                method: 'POST',
                body: JSON.stringify({ number, title }),
            }),
        checkin: async (email: string, stage: number, file: File, retryCount = 0): Promise<ExhibitionJourney> => {
            const formData = new FormData();
            formData.append('stage', String(stage));
            formData.append('file', file);
            const token = await getAuthToken();
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            try {
                const response = await fetch(`${API_URL}/api/v1/exhibition/journey/me/checkin?email=${encodeURIComponent(email)}`, {
                    method: 'POST',
                    headers,
                    body: formData,
                });

                if (!response.ok) {
                    if (response.status >= 500 && retryCount < 1) {
                        await new Promise((resolve) => setTimeout(resolve, 800));
                        return api.exhibition.checkin(email, stage, file, retryCount + 1);
                    }

                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Checkin failed: ${response.status}`);
                }

                const text = await response.text();
                return text ? JSON.parse(text) as ExhibitionJourney : {} as ExhibitionJourney;
            } catch (error: any) {
                if (retryCount < 1 && !error.message?.includes('Checkin failed')) {
                    await new Promise((resolve) => setTimeout(resolve, 800));
                    return api.exhibition.checkin(email, stage, file, retryCount + 1);
                }
                throw error;
            }
        },
        admin: {
            getAllJourneys: (params?: { page?: number; limit?: number; sort?: 'latest' | 'oldest' }) =>
                request<ExhibitionJourneyAdminPageResponse>(`/api/v1/exhibition/admin/journeys?${new URLSearchParams({
                    page: String(params?.page ?? 0),
                    limit: String(params?.limit ?? 10),
                    sort: params?.sort ?? 'latest',
                })}`),
        }
    },
    community: {
        // --- Public Feed & Single Post ---
        getPosts: (params?: { userId?: string; status?: string; page?: number; limit?: number }) =>
            request<PageResponse<CommunityPost>>(`/api/v1/community-posts?${new URLSearchParams(params as Record<string, string>)}`),
        getPostById: (id: string) =>
            request<CommunityPostDetail>(`/api/v1/community-posts/${id}`),
        
        // --- Create / Update / Delete ---
        createPost: (data: { title: string; content?: string; coverFile?: File; mediaFiles?: File[]; captions?: string[] }) => {
            const formData = new FormData();
            formData.append('title', data.title);
            if (data.content) formData.append('content', data.content);
            if (data.coverFile) formData.append('coverUrl', data.coverFile); // coverUrl is expected by backend MultipartFile
            if (data.mediaFiles) {
                data.mediaFiles.forEach(file => formData.append('mediaFiles', file));
            }
            if (data.captions) {
                data.captions.forEach(cap => formData.append('captions', cap));
            }
            
            return request<CommunityPost>('/api/v1/community-posts', {
                method: 'POST',
                body: formData as any // fetch will automatically set correct multipart boundaries
            });
        },
        updatePost: (id: string, data: CommunityPostUpdateInput) => {
            const formData = new FormData();
            if (data.title !== undefined) formData.append('title', data.title);
            if (data.content !== undefined) formData.append('content', data.content);
            if (data.removeCover) formData.append('removeCover', 'true');
            if (data.coverFile) formData.append('cover', data.coverFile);
            data.existingMedia?.forEach((media) => {
                formData.append('existingMediaIds', media.id);
                formData.append('existingMediaCaptions', media.caption ?? '');
                formData.append('existingMediaSortOrders', String(media.sortOrder));
            });
            data.deletedMediaIds?.forEach((deletedId) => {
                formData.append('deletedMediaIds', deletedId);
            });
            data.newMedia?.forEach((media) => {
                formData.append('newMediaFiles', media.file);
                formData.append('newMediaCaptions', media.caption ?? '');
                formData.append('newMediaSortOrders', String(media.sortOrder));
            });
            return request<CommunityPost>(`/api/v1/community-posts/${id}`, {
                method: 'PUT',
                body: formData as any
            });
        },
        deletePost: (id: string) => request<void>(`/api/v1/community-posts/${id}`, { method: 'DELETE' }),
        
        // --- Interaction ---
        toggleReaction: (id: string, kind: 'like' | 'save') =>
            request<{active: boolean, kind: string}>(`/api/v1/community-posts/${id}/reactions?kind=${kind}`, { method: 'POST' }),
        reportPost: (id: string, reason: string) =>
            request<void>(`/api/v1/community-posts/${id}/report`, { method: 'POST', body: JSON.stringify({ reason }) }),
            
        // --- Comments ---
        getComments: (postId: string) => request<CommunityComment[]>(`/api/v1/community-posts/${postId}/comments`),
        createComment: (postId: string, content: string, parentId?: string, imageFile?: File) => {
            const formData = new FormData();
            formData.append('postId', postId);
            formData.append('content', content);
            if (parentId) formData.append('parentId', parentId);
            if (imageFile) formData.append('image', imageFile);
            
            return request<CommunityComment>('/api/v1/comments', {
                method: 'POST',
                body: formData as any
            });
        },
        deleteComment: (commentId: string) => request<void>(`/api/v1/comments/${commentId}`, { method: 'DELETE' }),

        // --- Dashboard Utilities ---
        getMyPosts: (page = 1, limit = 20) => request<PageResponse<CommunityPost>>(`/api/v1/community-posts/my-posts?page=${page}&limit=${limit}`),
        getSavedPosts: (page = 1, limit = 20) => request<PageResponse<CommunityPost>>(`/api/v1/community-posts/saved?page=${page}&limit=${limit}`),
        getLikedPosts: (page = 1, limit = 20) => request<PageResponse<CommunityPost>>(`/api/v1/community-posts/liked?page=${page}&limit=${limit}`),
        getCommentedPosts: (page = 1, limit = 20) => request<PageResponse<CommunityPost>>(`/api/v1/community-posts/commented?page=${page}&limit=${limit}`),
    }
};

// ==========================================
// Community Interfaces
// ==========================================
export interface CommunityPost {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatarUrl?: string;
    authorRole?: string;
    title: string;
    content?: string;
    coverUrl?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    totalComments: number;
    totalLikes: number;
    imageUrls: string[];
    createdAt: string;
    updatedAt: string;
    hasLiked?: boolean;
    hasSaved?: boolean;
}

export interface CommunityPostDetail extends CommunityPost {
    media: {
        id: string;
        imageUrl: string;
        caption?: string;
        sortOrder: number;
    }[];
}

export interface CommunityPostExistingMediaUpdate {
    id: string;
    caption?: string;
    sortOrder: number;
}

export interface CommunityPostNewMediaUpload {
    file: File;
    caption?: string;
    sortOrder: number;
}

export interface CommunityPostUpdateInput {
    title?: string;
    content?: string;
    coverFile?: File;
    removeCover?: boolean;
    existingMedia?: CommunityPostExistingMediaUpdate[];
    deletedMediaIds?: string[];
    newMedia?: CommunityPostNewMediaUpload[];
}

export interface CommunityPostEditorMedia {
    clientId: string;
    id?: string;
    caption?: string;
    previewUrl: string;
    file?: File;
    isExisting: boolean;
}

export interface CommunityComment {
    id: string;
    postId: string;
    parentId?: string;
    authorId: string;
    authorName: string;
    authorAvatarUrl?: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    replies?: CommunityComment[];
}


