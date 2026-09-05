import React, { useEffect, useState } from 'react';
import { 
  Menu, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Database, 
  Cpu, 
  ShieldCheck, 
  AlertCircle,
  Zap,
  BookMarked,
  BarChart3,
  Layers
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import { Sidebar } from './components/Sidebar';
import { GeneratorView } from './components/views/GeneratorView';
import { PustakaReferensiView } from './components/views/PustakaReferensiView';
import { AnalitikView } from './components/views/AnalitikView';
import { useBilanoStore } from './store/useBilanoStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <StudioApp />
        </ErrorBoundary>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function StudioApp() {
  const { 
    activeMenu, 
    loadInitialData, 
    toastMessage, 
    setToast, 
    isGenerating, 
    pipelineStage 
  } = useBilanoStore();

  const [mobileOpen, setMobileOpen] = useState(false);

  // Inisialisasi data dari Supabase saat awal mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Judul breadcrumb surface saat ini
  const getSurfaceTitle = () => {
    switch (activeMenu) {
      case 'generator':
        return {
          title: 'Generator Konten AI',
          subtitle: 'Pembuatan 6 panel komik carousel maskot Bilano berbasis naskah FYP',
          badge: 'Magic RAG',
          icon: Sparkles,
        };
      case 'pustaka':
        return {
          title: 'Pustaka Referensi',
          subtitle: 'Swipe file naskah video TikTok/Reels berkinerja tinggi & ekspor PDF',
          badge: 'Swipe File',
          icon: BookMarked,
        };
      case 'analitik':
        return {
          title: 'Analitik & Pembelajaran',
          subtitle: 'Tabel metrik engagement konten terupload untuk feedback loop AI RAG',
          badge: 'Feedback Loop',
          icon: BarChart3,
        };
      default:
        return {
          title: 'Bilano Content Studio',
          subtitle: 'Automated AI Content Factory Dashboard',
          badge: 'Production',
          icon: Layers,
        };
    }
  };

  const surface = getSurfaceTitle();
  const SurfaceIcon = surface.icon;

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Sidebar Navigasi */}
      <Sidebar 
        mobileOpen={mobileOpen} 
        onCloseMobile={() => setMobileOpen(false)} 
      />

      {/* Backdrop Gelap untuk Mobile Drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-col lg:pl-[280px]">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/80 bg-background/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Hamburger Button untuk Layar Mobile */}
            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-card text-foreground shadow-sm hover:bg-muted active:scale-95 lg:hidden"
              aria-label="Buka Menu"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb Surface Aktif */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
                <SurfaceIcon size={16} />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{surface.title}</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                    {surface.badge}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick System Status Pill */}
          <div className="flex items-center gap-2.5">
            {isGenerating && (
              <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 animate-pulse">
                <Zap size={12} className="text-emerald-500" />
                <span>AI Pipeline Berjalan...</span>
              </div>
            )}

            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden xs:inline">Supabase DB</span>
              <span className="font-semibold text-foreground">Online</span>
            </div>

            <div className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-xs">
              <Cpu size={12} className="text-emerald-600" />
              <span>Gemini 1.5 + Segmind</span>
            </div>
          </div>
        </header>

        {/* Content Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {activeMenu === 'generator' && <GeneratorView />}
            {activeMenu === 'pustaka' && <PustakaReferensiView />}
            {activeMenu === 'analitik' && <AnalitikView />}
          </div>
        </main>

        {/* Footer info */}
        <footer className="border-t border-border/60 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 sm:flex-row">
            <p>© {new Date().getFullYear()} Bilano Content Studio • Automated RAG AI Comic Carousel</p>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-emerald-600 font-medium">Model: Gemini 1.5 Flash</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">IP-Adapter: Segmind</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">PostgreSQL: Supabase</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating System Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex max-w-md items-center gap-3 rounded-2xl border border-emerald-500/40 bg-[#0e2a22] p-4 text-emerald-50 shadow-xl shadow-emerald-950/40 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 size={18} />
          </div>
          <div className="flex-1 text-xs font-medium leading-snug">
            {toastMessage}
          </div>
          <button
            onClick={() => setToast(null)}
            className="rounded-lg p-1 text-emerald-300/70 transition-colors hover:bg-emerald-900/60 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}