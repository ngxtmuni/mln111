'use client';

import { useEffect, useState } from 'react';
import { ExhibitionJourney, ExhibitionJourneyAdminPageResponse, api } from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';

export default function AdminExhibitionPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [journeys, setJourneys] = useState<ExhibitionJourney[]>([]);
    const [pageInfo, setPageInfo] = useState<ExhibitionJourneyAdminPageResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
    const limit = 10;

    useEffect(() => {
        if (isAuthLoading) return;
        if (!user) {
            setJourneys([]);
            setPageInfo(null);
            setLoadError('Bạn cần đăng nhập bằng tài khoản admin để xem trang này.');
            setIsLoading(false);
            return;
        }
        loadJourneys();
    }, [isAuthLoading, user, page, sort]);

    const loadJourneys = async () => {
        setIsLoading(true);
        try {
            setLoadError(null);
            const data = await api.exhibition.admin.getAllJourneys({ page, limit, sort });
            setJourneys(data.items);
            setPageInfo(data);
        } catch (err: any) {
            const message = err?.message || '';
            setJourneys([]);
            setPageInfo(null);
            if (message.includes('403')) {
                setLoadError('Bạn cần đăng nhập bằng tài khoản admin để xem trang này.');
                return;
            }
            setLoadError('Không thể tải dữ liệu hành trình. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    const completedJourneys = pageInfo?.stats.completedJourneys ?? 0;
    const inProgressJourneys = pageInfo?.stats.inProgressJourneys ?? 0;
    const pendingJourneys = pageInfo?.stats.pendingJourneys ?? 0;
    const totalCheckins = pageInfo?.stats.totalCheckins ?? 0;
    const totalPages = Math.max(pageInfo?.totalPages ?? 0, 1);
    const pageButtons = (() => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, index) => index);
        }

        if (page <= 3) {
            return [0, 1, 2, 3, 4, -1, totalPages - 1];
        }

        if (page >= totalPages - 4) {
            return [0, -1, totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
        }

        return [0, -1, page - 1, page, page + 1, -1, totalPages - 1];
    })();

    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-[#09090f] text-white p-6 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-sm uppercase tracking-[0.24em] text-[#393ADD] mb-3">Admin Exhibition</p>
                    <p className="text-zinc-300">Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090f] text-white p-6 relative">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
                    <div>
                        <p className="text-[#393ADD] text-xs font-black uppercase tracking-[0.24em] mb-2">Admin Exhibition</p>
                        <h1 className="text-3xl font-bold">Quản lý Sự kiện Căn Số</h1>
                        <p className="text-sm text-zinc-400 mt-2">Theo dõi hành trình exhibition theo từng tài khoản đã đăng nhập, tiến độ check-in và ảnh tại từng chặng.</p>
                    </div>
                    <Link
                        href="/admin"
                        className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/10"
                    >
                        Quay về Dashboard
                    </Link>
                </div>
            </div>

            {loadError ? (
                <div className="mb-8 max-w-6xl mx-auto rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-amber-100">
                    <p className="font-semibold mb-1">Không thể truy cập dữ liệu exhibition</p>
                    <p className="text-sm">{loadError}</p>
                </div>
            ) : null}

            <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-4 mb-8">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Tổng hành trình</p>
                    <p className="text-3xl font-black text-white">{pageInfo?.totalItems ?? 0}</p>
                </div>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80 mb-2">Đã hoàn thành</p>
                    <p className="text-3xl font-black text-emerald-300">{completedJourneys}</p>
                </div>
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.2em] text-blue-300/80 mb-2">Đang diễn ra</p>
                    <p className="text-3xl font-black text-blue-300">{inProgressJourneys}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Tổng check-in</p>
                    <p className="text-3xl font-black text-white">{totalCheckins}</p>
                    <p className="text-xs text-zinc-500 mt-2">Chưa bắt đầu: {pendingJourneys}</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto bg-white/5 p-6 rounded-2xl shadow-xl border border-white/10 mb-8 backdrop-blur flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <p className="text-sm font-semibold text-white">Flow hiện tại</p>
                    <p className="text-sm text-zinc-400 mt-2 max-w-3xl">
                        Mỗi người dùng sau khi đăng nhập sẽ tự có một hành trình exhibition riêng. Admin chỉ theo dõi trạng thái và ảnh check-in, không còn cần tạo mã riêng hay phát QR.
                    </p>
                </div>
                <button
                    onClick={loadJourneys}
                    disabled={isLoading || !!loadError}
                    className="bg-[#393ADD] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#3031BA] disabled:opacity-50 transition-colors shadow-lg"
                >
                    {isLoading ? 'Đang tải...' : 'Tải lại dữ liệu'}
                </button>
            </div>

            <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="text-sm text-zinc-400">
                    {pageInfo
                        ? `Trang ${pageInfo.page + 1}/${totalPages} • Hiển thị ${journeys.length}/${pageInfo.totalItems} người tham gia`
                        : 'Đang chuẩn bị dữ liệu...'}
                </div>
                <div className="flex items-center gap-3">
                    <label className="text-sm text-zinc-400" htmlFor="journey-sort">Sắp xếp</label>
                    <select
                        id="journey-sort"
                        value={sort}
                        onChange={(event) => {
                            setPage(0);
                            setSort(event.target.value as 'latest' | 'oldest');
                        }}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                    >
                        <option value="latest" className="bg-[#09090f]">Mới nhất trước</option>
                        <option value="oldest" className="bg-[#09090f]">Lâu nhất trước</option>
                    </select>
                </div>
            </div>

            <div className="max-w-6xl mx-auto bg-white/5 rounded-2xl shadow-2xl border border-white/10 overflow-hidden backdrop-blur">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#12121a] border-b border-white/10 text-zinc-300">
                        <tr>
                            <th className="p-4 font-semibold uppercase text-xs tracking-wider">Người dùng</th>
                            <th className="p-4 font-semibold uppercase text-xs tracking-wider">Liên hệ</th>
                            <th className="p-4 font-semibold uppercase text-xs tracking-wider">Trạng Thái</th>
                            <th className="p-4 font-semibold uppercase text-xs tracking-wider">Tiến độ (Chặng)</th>
                            <th className="p-4 font-semibold uppercase text-xs tracking-wider">Ảnh Check-in</th>
                            <th className="p-4 font-semibold uppercase text-xs tracking-wider text-right">Cập nhật</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr><td colSpan={6} className="p-8 text-center text-zinc-400">Đang tải dữ liệu...</td></tr>
                        ) : journeys.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-zinc-400">Chưa có hành trình nào được tạo từ người dùng đăng nhập.</td></tr>
                        ) : (
                            journeys.map((journey: any) => (
                                <tr key={journey.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-white">{journey.userName || 'Chưa đồng bộ tên'}</span>
                                            <span className="text-xs text-zinc-500 font-mono mt-1">{journey.userId || journey.code}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-zinc-300">
                                        {journey.userEmail || <span className="text-zinc-500">Không có email</span>}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                                            journey.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                            journey.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                            'bg-white/10 text-zinc-300 border border-white/20'
                                        }`}>
                                            {journey.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="w-full bg-white/10 rounded-full h-1.5 max-w-[100px] mb-1.5">
                                            <div className="bg-[#393ADD] h-1.5 rounded-full" style={{ width: `${(journey.checkins.length / 4) * 100}%` }}></div>
                                        </div>
                                        <span className="text-xs text-zinc-400">{journey.checkins.length}/4 hoàn thành</span>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        {[1, 2, 3, 4].map(stage => {
                                            const checkin = journey.checkins.find((c: any) => c.stage === stage);
                                            return checkin ? (
                                                <a key={stage} href={checkin.imageUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-md bg-zinc-800 block overflow-hidden border border-white/10 hover:ring-2 hover:ring-[#393ADD] transition-all">
                                                    <img src={checkin.imageUrl} className="w-full h-full object-cover" alt={`S${stage}`} />
                                                </a>
                                            ) : (
                                                <div key={stage} className="w-8 h-8 rounded-md bg-black/40 border border-dashed border-white/20 flex items-center justify-center text-zinc-600 text-[10px] font-medium">{stage}</div>
                                            );
                                        })}
                                    </td>
                                    <td className="p-4 text-right text-zinc-400 text-xs">
                                        {new Date(journey.updatedAt || journey.createdAt).toLocaleString('vi-VN')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="max-w-6xl mx-auto mt-4 flex items-center justify-end gap-2 flex-wrap">
                <button
                    onClick={() => setPage((current) => Math.max(current - 1, 0))}
                    disabled={isLoading || page === 0}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/10 disabled:opacity-50"
                >
                    Trang trước
                </button>
                {pageButtons.map((pageIndex, index) => (
                    pageIndex === -1 ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-1 text-sm text-zinc-500"
                        >
                            ...
                        </span>
                    ) : (
                    <button
                        key={pageIndex}
                        onClick={() => setPage(pageIndex)}
                        disabled={isLoading}
                        className={`min-w-10 rounded-lg border px-3 py-2 text-sm transition-colors disabled:opacity-50 ${
                            page === pageIndex
                                ? 'border-[#393ADD] bg-[#393ADD] text-white'
                                : 'border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10'
                        }`}
                    >
                        {pageIndex + 1}
                    </button>
                    )
                ))}
                <button
                    onClick={() => setPage((current) => {
                        const totalPages = pageInfo?.totalPages ?? 0;
                        if (totalPages <= 0) return current;
                        return Math.min(current + 1, totalPages - 1);
                    })}
                    disabled={isLoading || !pageInfo || page >= pageInfo.totalPages - 1}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/10 disabled:opacity-50"
                >
                    Trang sau
                </button>
            </div>
        </div>
    );
}
