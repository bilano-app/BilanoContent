import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  Save, 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  Layers, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Flame,
  ArrowUpRight,
  Clock,
  Send
} from 'lucide-react';
import { useBilanoStore } from '../../store/useBilanoStore';
import type { KontenTerbuat, KontenStatus, SlideData } from '../../types/database';

export const AnalitikView: React.FC = () => {
  const { 
    kontenList, 
    insightAI, 
    updateKontenMetric, 
    saveAnalitik, 
    setActiveMenu, 
    setToast 
  } = useBilanoStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [savingId, setSavingId] = useState<string | number | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | number | null>(null);

  // Perhitungan Ringkasan Agregat
  const aggregateStats = useMemo(() => {
    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;

    kontenList.forEach((k) => {
      totalViews += Number(k.views) || 0;
      totalLikes += Number(k.likes) || 0;
      totalComments += Number(k.comments) || 0;
      totalShares += Number(k.shares) || 0;
    });

    const totalEngagement = totalLikes + totalComments + totalShares;
    const avgEngagementRate = totalViews > 0 
      ? ((totalEngagement / totalViews) * 100).toFixed(1) 
      : '0.0';

    return {
      totalKonten: kontenList.length,
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      avgEngagementRate,
    };
  }, [kontenList]);

  // Filter & Search
  const filteredKonten = useMemo(() => {
    return kontenList.filter((k) => {
      const matchSearch = k.judul_konten.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === 'all' || k.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [kontenList, searchQuery, filterStatus]);

  const handleSaveRow = async (id: string | number) => {
    setSavingId(id);
    try {
      await saveAnalitik(id);
    } finally {
      setTimeout(() => setSavingId(null), 600);
    }
  };

  const toggleExpand = (id: string | number) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <BarChart3 size={14} />
            <span>Feedback Loop Performa</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl font-serif">
            Analitik & Pembelajaran AI
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Perbarui angka performa riil (Views, Likes, Komentar) untuk melatih ketajaman naskah RAG pada batch berikutnya.
          </p>
        </div>

        <button
          onClick={() => setActiveMenu('generator')}
          className="inline-flex items-center gap-2 rounded-xl bg-[#10382e] px-4 py-2.5 text-sm font-semibold text-emerald-100 shadow-md transition-all hover:bg-[#194a3d] hover:shadow-emerald-950/20 active:scale-95"
        >
          <Sparkles size={16} className="text-emerald-400" />
          <span>Buat Konten Baru</span>
        </button>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-emerald-900/20 bg-gradient-to-br from-[#10382e]/50 to-[#0e2c24]/80 p-4 text-emerald-50 shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-300/80">
            <span className="font-semibold uppercase tracking-wider">Total Konten</span>
            <Layers size={14} className="text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-emerald-100">
            {aggregateStats.totalKonten}
          </div>
          <div className="mt-1 text-[11px] text-emerald-300/60">
            Komik carousel tersimpan
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider">Total Tayangan</span>
            <Eye size={14} className="text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-foreground">
            {aggregateStats.totalViews.toLocaleString('id-ID')}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Akumulasi views TikTok & Reels
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider">Total Interaksi</span>
            <Heart size={14} className="text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-foreground">
            {(aggregateStats.totalLikes + aggregateStats.totalComments + aggregateStats.totalShares).toLocaleString('id-ID')}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Likes, komentar, & shares
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300">
            <span className="font-semibold uppercase tracking-wider">Rata-Rata ER</span>
            <TrendingUp size={14} className="text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-emerald-800 dark:text-emerald-200">
            {aggregateStats.avgEngagementRate}%
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            Engagement rate rata-rata
          </div>
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-900/10 via-emerald-800/5 to-teal-900/10 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600/15 text-emerald-600 shadow-sm">
            <Lightbulb size={22} className="text-emerald-600 animate-pulse" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                <Sparkles size={11} />
                INSIGHT AI BILANO
              </span>
              <span className="text-xs text-muted-foreground">Berdasarkan data performa konten terupload</span>
            </div>
            <p className="text-sm font-medium leading-relaxed text-foreground">
              {insightAI}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 size={13} />
                Formula Teratas: Hook Angka Riil + Tension Slide 3
              </span>
              <span>•</span>
              <span>Rekomendasi Waktu Upload: 12:00 - 13:30 WIB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Konten Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">Daftar Konten Terbuat</h2>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              {filteredKonten.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari judul konten..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-input bg-card py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-input bg-card px-3 py-2 text-xs font-medium text-foreground focus:border-emerald-600 focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="Draft">Draft</option>
              <option value="Uploaded">Uploaded</option>
            </select>
          </div>
        </div>

        {filteredKonten.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <Layers size={28} />
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground">Belum Ada Konten yang Sesuai</h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              {kontenList.length === 0 
                ? 'Belum ada konten komik yang digenerate. Jalankan Magic AI Pipeline sekarang untuk membuat carousel pertamamu!'
                : 'Tidak ada konten yang cocok dengan kata kunci pencarian.'}
            </p>
            {kontenList.length === 0 && (
              <button
                onClick={() => setActiveMenu('generator')}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-800"
              >
                <Sparkles size={14} />
                <span>Mulai Generate Konten</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/70 bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3.5">Konten / Judul</th>
                    <th className="px-3 py-3.5">Status</th>
                    <th className="px-3 py-3.5">Tayangan (Views)</th>
                    <th className="px-3 py-3.5">Suka (Likes)</th>
                    <th className="px-3 py-3.5">Komentar</th>
                    <th className="px-3 py-3.5">Shares</th>
                    <th className="px-3 py-3.5">ER %</th>
                    <th className="px-4 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredKonten.map((item) => {
                    const views = Number(item.views) || 0;
                    const likes = Number(item.likes) || 0;
                    const comments = Number(item.comments) || 0;
                    const shares = Number(item.shares) || 0;
                    const er = views > 0 ? (((likes + comments + shares) / views) * 100).toFixed(1) : '0.0';
                    const isExpanded = expandedRowId === item.id;
                    const firstSlide = item.slides_data_json?.[0];

                    return (
                      <React.Fragment key={item.id}>
                        <tr className="transition-colors hover:bg-muted/20">
                          {/* Konten Title & Thumbnail */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div 
                                onClick={() => toggleExpand(item.id)}
                                className="group relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border/70 bg-muted"
                              >
                                {firstSlide?.image_url ? (
                                  <img 
                                    src={firstSlide.image_url} 
                                    alt="Thumbnail" 
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105" 
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                    <Layers size={18} />
                                  </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                  <Eye size={14} className="text-white" />
                                </div>
                              </div>

                              <div className="min-w-[180px] max-w-[280px]">
                                <div 
                                  onClick={() => toggleExpand(item.id)}
                                  className="cursor-pointer font-bold text-foreground hover:text-emerald-600 line-clamp-1"
                                >
                                  {item.judul_konten}
                                </div>
                                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock size={11} />
                                    {item.created_at || 'Hari ini'}
                                  </span>
                                  <span>•</span>
                                  <span className="font-semibold text-emerald-600">
                                    {item.slides_data_json?.length || 6} Slide
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Status Dropdown */}
                          <td className="px-3 py-3.5">
                            <select
                              value={item.status}
                              onChange={(e) => updateKontenMetric(item.id, 'status', e.target.value as KontenStatus)}
                              className={`rounded-lg px-2 py-1 text-[11px] font-bold border transition-colors ${
                                item.status === 'Uploaded'
                                  ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400'
                                  : 'bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-400'
                              }`}
                            >
                              <option value="Draft">Draft</option>
                              <option value="Uploaded">Uploaded</option>
                            </select>
                          </td>

                          {/* Views Input */}
                          <td className="px-3 py-3.5">
                            <input
                              type="number"
                              min="0"
                              value={item.views}
                              onChange={(e) => updateKontenMetric(item.id, 'views', Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-24 rounded-lg border border-input bg-card px-2.5 py-1 text-xs font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                            />
                          </td>

                          {/* Likes Input */}
                          <td className="px-3 py-3.5">
                            <input
                              type="number"
                              min="0"
                              value={item.likes}
                              onChange={(e) => updateKontenMetric(item.id, 'likes', Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-20 rounded-lg border border-input bg-card px-2.5 py-1 text-xs font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                            />
                          </td>

                          {/* Comments Input */}
                          <td className="px-3 py-3.5">
                            <input
                              type="number"
                              min="0"
                              value={item.comments}
                              onChange={(e) => updateKontenMetric(item.id, 'comments', Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-20 rounded-lg border border-input bg-card px-2.5 py-1 text-xs font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                            />
                          </td>

                          {/* Shares Input */}
                          <td className="px-3 py-3.5">
                            <input
                              type="number"
                              min="0"
                              value={item.shares}
                              onChange={(e) => updateKontenMetric(item.id, 'shares', Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-20 rounded-lg border border-input bg-card px-2.5 py-1 text-xs font-semibold text-foreground focus:border-emerald-600 focus:outline-none"
                            />
                          </td>

                          {/* Engagement Rate */}
                          <td className="px-3 py-3.5">
                            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${
                              parseFloat(er) >= 5.0
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {er}%
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSaveRow(item.id)}
                                disabled={savingId === item.id}
                                title="Simpan data analitik ke Supabase"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow transition-all hover:bg-emerald-800 disabled:opacity-50"
                              >
                                {savingId === item.id ? (
                                  <>
                                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    <span>Menyimpan...</span>
                                  </>
                                ) : (
                                  <>
                                    <Save size={13} />
                                    <span>Simpan</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => toggleExpand(item.id)}
                                className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                title="Lihat detail panel slide"
                              >
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Accordion Detail Slides */}
                        {isExpanded && (
                          <tr className="bg-muted/30">
                            <td colSpan={8} className="p-4">
                              <div className="rounded-xl border border-border/80 bg-card p-4">
                                <div className="mb-3 flex items-center justify-between">
                                  <div className="text-xs font-bold text-foreground">
                                    Rincian 6 Panel Komik ({item.judul_konten})
                                  </div>
                                  <span className="text-[11px] text-muted-foreground">
                                    ID Database: #{item.id}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                                  {item.slides_data_json?.map((slide: SlideData) => (
                                    <div 
                                      key={slide.slide}
                                      className="flex flex-col overflow-hidden rounded-lg border border-border/70 bg-background text-[11px]"
                                    >
                                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                                        {slide.image_url ? (
                                          <img 
                                            src={slide.image_url} 
                                            alt={`Panel ${slide.slide}`} 
                                            className="h-full w-full object-cover" 
                                          />
                                        ) : (
                                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                            <span>Panel {slide.slide}</span>
                                          </div>
                                        )}
                                        <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                          Slide {slide.slide}
                                        </span>
                                      </div>
                                      <div className="p-2">
                                        <p className="line-clamp-3 text-muted-foreground italic">
                                          "{slide.dialogue}"
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
