import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  RefreshCw, 
  Check, 
  Copy, 
  Image as ImageIcon, 
  Layers, 
  Cpu, 
  FileText, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Flame,
  AlertCircle
} from 'lucide-react';
import { useBilanoStore } from '../../store/useBilanoStore';
import { exportSlidesToZip } from '../../lib/exportZip';

export const GeneratorView: React.FC = () => {
  const { 
    currentJudul, 
    currentSlides, 
    isGenerating, 
    pipelineStage, 
    pipelineMessage, 
    triggerMagicPipeline, 
    updateSlideField,
    setToast 
  } = useBilanoStore();

  const [isExportingZip, setIsExportingZip] = useState(false);
  const [activeSlideTab, setActiveSlideTab] = useState<number | null>(null);

  const handleDownloadZip = async () => {
    if (currentSlides.length === 0) {
      setToast('Belum ada slide yang dibuat.');
      return;
    }
    try {
      setIsExportingZip(true);
      await exportSlidesToZip(currentSlides, currentJudul);
      setToast('Semua slide berhasil dikemas dan diunduh dalam file .ZIP!');
    } catch (err) {
      console.error(err);
      setToast('Gagal mengunduh file ZIP.');
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleCopyAllScript = () => {
    const text = currentSlides
      .map((s) => `[Slide ${s.slide}]\n"${s.dialogue}"\n(Visual: ${s.image_prompt})`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setToast('Naskah komik berhasil disalin ke clipboard!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <Sparkles size={14} />
            <span>Alur Pembuatan AI (RAG Pipeline)</span>
          </div>
          <h1 className="mt-1 font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Generator Konten Bilano
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sistem otomatis ekstraksi pola naskah FYP berkinerja tinggi → Gemini 1.5 → Segmind IP-Adapter (6 Panel Komik).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyAllScript}
            disabled={isGenerating || currentSlides.length === 0}
            className="focus-ring inline-flex items-center gap-2 rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-muted disabled:opacity-50"
            data-testid="button-copy-script"
          >
            <Copy size={14} />
            <span>Salin Naskah</span>
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isGenerating || isExportingZip || currentSlides.length === 0}
            className="focus-ring inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-800 disabled:opacity-50"
            data-testid="button-download-all-zip"
          >
            {isExportingZip ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Mengemas ZIP...</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Unduh Semua (.zip)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Massive Trigger Button & Sequential Status */}
      <div className="rounded-3xl border border-emerald-900/20 bg-gradient-to-br from-[#0c241e] via-[#10382e] to-[#0d2a23] p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 font-mono text-[11px] font-bold text-emerald-300">
              <Flame size={13} className="text-emerald-400" /> One-Click Magic Pipeline
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Buat Carousel Komik 6-Slide Seketika
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-emerald-200/80">
              Sistem akan mengambil 5 referensi FYP dengan skor tertinggi dari Supabase, menyusun alur hook & dialog edukasi via Gemini 1.5, dan menggambar 6 panel karakter berhoodie hijau secara paralel via Segmind IP-Adapter.
            </p>
          </div>

          <button
            onClick={triggerMagicPipeline}
            disabled={isGenerating}
            className="focus-ring group relative flex w-full shrink-0 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 px-8 py-5 text-base font-black text-emerald-950 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/40 active:scale-[0.98] disabled:cursor-wait disabled:opacity-75 md:w-auto"
            data-testid="button-magic-generate"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={22} className="animate-spin text-emerald-950" />
                <span className="tracking-wide uppercase">Memproses Pipeline...</span>
              </>
            ) : (
              <>
                <span className="text-2xl animate-bounce">⚡</span>
                <span className="text-lg tracking-wide uppercase">Generate Otomatis (Sistem AI)</span>
              </>
            )}
          </button>
        </div>

        {/* Sequential Loading Indicator Bar */}
        {isGenerating && (
          <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-black/30 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/20 text-emerald-300">
                  <RefreshCw size={16} className="animate-spin" />
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                    Status Eksekusi Real-Time
                  </p>
                  <p className="text-sm font-bold text-white">{pipelineMessage}</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 font-mono text-xs font-bold text-emerald-300">
                {pipelineStage === 'mengambil_referensi'
                  ? 'Fase 1/3'
                  : pipelineStage === 'gemini_menganalisis'
                  ? 'Fase 2/3'
                  : 'Fase 3/3'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div
                className={`flex items-center gap-2 rounded-xl p-2.5 text-xs transition-all ${
                  pipelineStage === 'mengambil_referensi'
                    ? 'bg-emerald-500/30 font-bold text-white ring-1 ring-emerald-400'
                    : 'bg-emerald-950/40 text-emerald-300/70'
                }`}
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/30 text-[10px]">
                  1
                </div>
                <span>Mengambil Referensi FYP...</span>
              </div>

              <div
                className={`flex items-center gap-2 rounded-xl p-2.5 text-xs transition-all ${
                  pipelineStage === 'gemini_menganalisis'
                    ? 'bg-emerald-500/30 font-bold text-white ring-1 ring-emerald-400'
                    : 'bg-emerald-950/40 text-emerald-300/70'
                }`}
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/30 text-[10px]">
                  2
                </div>
                <span>Gemini Menganalisis & Menulis...</span>
              </div>

              <div
                className={`flex items-center gap-2 rounded-xl p-2.5 text-xs transition-all ${
                  pipelineStage === 'segmind_menggambar'
                    ? 'bg-emerald-500/30 font-bold text-white ring-1 ring-emerald-400'
                    : 'bg-emerald-950/40 text-emerald-300/70'
                }`}
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/30 text-[10px]">
                  3
                </div>
                <span>Segmind Menggambar Panel...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Output Showcase: Judul Konten & CSS Grid 6 Slide Panels */}
      <div>
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-600 font-bold">
              Hasil Produksi Terakhir
            </span>
            <h3 className="font-serif text-xl font-bold tracking-tight text-foreground">
              {currentJudul}
            </h3>
          </div>
          <span className="w-fit rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground">
            Format: Komik Carousel 6-Slide (4:5 Ratio)
          </span>
        </div>

        {/* CSS Grid 6 Panel Komik */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {currentSlides.map((slide, index) => (
            <div
              key={slide.slide || index}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg"
              data-testid={`card-slide-${slide.slide}`}
            >
              {/* Image Frame with Overlay Badge */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900">
                <img
                  src={slide.image_url || 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80'}
                  alt={`Slide ${slide.slide} Bilano`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Gradient vignette for comic feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="flex items-center gap-1 rounded-lg bg-emerald-500/90 px-2.5 py-1 font-mono text-[10px] font-bold text-emerald-950 shadow">
                    SLIDE {String(slide.slide).padStart(2, '0')}
                  </span>
                  <span className="rounded-lg bg-black/60 px-2 py-1 font-mono text-[9px] font-medium text-emerald-200 backdrop-blur-sm">
                    IP-Adapter Locked
                  </span>
                </div>

                {/* Comic Dialogue Overlay on Top/Bottom of image */}
                <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/95 p-3.5 shadow-lg backdrop-blur-sm border border-emerald-900/10">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Dialog Karakter
                  </div>
                  <p className="mt-1 text-xs font-semibold leading-snug text-neutral-900">
                    "{slide.dialogue}"
                  </p>
                </div>
              </div>

              {/* Editable Dialogue & Prompt Control Box */}
              <div className="flex flex-1 flex-col justify-between p-4 bg-card border-t border-border/60">
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center justify-between text-[11px] font-bold uppercase text-muted-foreground font-mono">
                      <span>Edit Teks Dialog (Bahasa Indonesia)</span>
                    </label>
                    <textarea
                      value={slide.dialogue}
                      onChange={(e) => updateSlideField(index, 'dialogue', e.target.value)}
                      rows={2}
                      className="focus-ring mt-1 w-full resize-none rounded-lg border border-input bg-background p-2.5 text-xs text-foreground outline-none transition-colors focus:border-emerald-500"
                      aria-label={`Edit dialog slide ${slide.slide}`}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-muted-foreground/80 font-mono">
                      Image Prompt (Segmind / English)
                    </label>
                    <p className="mt-0.5 line-clamp-2 text-[10px] text-muted-foreground leading-relaxed">
                      {slide.image_prompt}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3 text-[10px] text-muted-foreground">
                  <span>Karakter: Hoodie Hijau Bilano</span>
                  <span className="font-mono text-emerald-600 font-bold">Slide Siap Tayang</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
