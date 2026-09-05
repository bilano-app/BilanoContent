import React, { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { 
  BookOpen, 
  UploadCloud, 
  Download, 
  Plus, 
  Sparkles, 
  Search, 
  Check, 
  AlertCircle, 
  FileText, 
  Flame, 
  Star, 
  Image as ImageIcon,
  Tag,
  Clock,
  Filter
} from 'lucide-react';
import { useBilanoStore } from '../../store/useBilanoStore';
import { exportPustakaToPdf } from '../../lib/exportPdf';
import type { PustakaReferensi } from '../../types/database';

export const PustakaReferensiView: React.FC = () => {
  const { 
    pustakaList, 
    addReferensi, 
    updateReferensi, 
    setToast 
  } = useBilanoStore();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Form input state untuk tambah referensi baru
  const [newTeksScript, setNewTeksScript] = useState('');
  const [newAlasan, setNewAlasan] = useState('');
  const [newSkor, setNewSkor] = useState<number>(90);
  const [newTag, setNewTag] = useState('Kebocoran Finansial');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter daftar pustaka
  const availableTags = Array.from(
    new Set(pustakaList.map((item) => item.tag_masalah).filter(Boolean))
  );

  const filteredPustaka = pustakaList.filter((item) => {
    const matchesSearch = 
      item.teks_script_video.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alasan_engaging.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tag_masalah.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === 'all' || item.tag_masalah === selectedTag;
    return matchesSearch && matchesTag;
  });

  // Handle Drag & Drop Upload
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setToast('Harap unggah file gambar (JPG, PNG, atau WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setNewImageUrl(reader.result as string);
      setToast(`Gambar thumbnail "${file.name}" siap ditambahkan.`);
    };
    reader.readAsDataURL(file);
  };

  // Submit form tambah referensi
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeksScript.trim()) {
      setToast('Harap isi kutipan naskah script video TikTok/Reels!');
      return;
    }

    try {
      setIsSubmitting(true);
      await addReferensi({
        image_url: newImageUrl || 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80',
        teks_script_video: newTeksScript.trim(),
        alasan_engaging: newAlasan.trim() || 'Hook tajam, relatable, dan emosi audiens terpicu di 3 detik awal.',
        skor_performa: Number(newSkor) || 85,
        tag_masalah: newTag.trim() || 'Finansial Umum',
      });

      // Reset form
      setNewTeksScript('');
      setNewAlasan('');
      setNewSkor(90);
      setNewImageUrl('');
      setToast('✨ Referensi FYP baru berhasil disimpan ke database Supabase!');
    } catch (err) {
      console.error(err);
      setToast('Gagal menambahkan referensi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ekspor PDF via jsPDF
  const handleExportPdf = async () => {
    if (pustakaList.length === 0) {
      setToast('Pustaka referensi masih kosong.');
      return;
    }

    try {
      setIsExportingPdf(true);
      await exportPustakaToPdf(pustakaList);
      setToast('📄 Swipe File PDF berhasil di-generate dan diunduh!');
    } catch (err) {
      console.error(err);
      setToast('Gagal membuat dokumen PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header View */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <BookOpen size={14} />
            <span>Database Swipe File & Pola Hook</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Pustaka Referensi Konten FYP
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Koleksi naskah viral TikTok & Instagram Reels berkinerja tinggi yang menjadi bahan bakar utama pipeline RAG Gemini 1.5.
          </p>
        </div>

        {/* Action button export PDF */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf || pustakaList.length === 0}
            className="flex items-center gap-2 rounded-xl border border-emerald-900/40 bg-emerald-950 px-4 py-2.5 text-xs font-bold text-emerald-100 shadow-sm transition hover:bg-emerald-900 hover:text-white disabled:opacity-50"
            title="Download PDF Swipe File"
          >
            <Download size={14} className={isExportingPdf ? 'animate-bounce' : ''} />
            <span>{isExportingPdf ? 'Menyiapkan PDF...' : 'Unduh PDF (Swipe File)'}</span>
          </button>
        </div>
      </div>

      {/* Area Atas: Drag-and-Drop & Form Unggah Referensi */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              <Plus size={15} />
            </div>
            <h2 className="text-base font-bold text-foreground">
              Tambah Referensi Video Viral Baru
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            Otomatis terindeks untuk pipeline AI RAG
          </span>
        </div>

        <form onSubmit={handleAddSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Zona Drag & Drop Gambar */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`lg:col-span-4 relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                : 'border-border/80 bg-muted/30 hover:border-emerald-500/60 hover:bg-muted/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {newImageUrl ? (
              <div className="relative w-full overflow-hidden rounded-lg">
                <img
                  src={newImageUrl}
                  alt="Preview Thumbnail"
                  className="h-44 w-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition hover:opacity-100">
                  <p className="text-xs font-semibold text-white">Klik untuk ganti gambar</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">
                    Tarik & Lepas screenshot video FYP di sini
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    atau klik untuk pilih berkas gambar (JPG, PNG)
                  </p>
                </div>
                <div className="inline-block rounded-full bg-muted px-2.5 py-1 text-[10px] font-mono text-muted-foreground">
                  Ukuran ideal: 9:16 atau 4:5
                </div>
              </div>
            )}
          </div>

          {/* Form Fields: Naskah, Alasan, Skor, Tag */}
          <div className="space-y-4 lg:col-span-8">
            <div>
              <label className="block text-xs font-bold text-foreground">
                Teks Script / Transkrip Video Viral (Wajib)
              </label>
              <textarea
                value={newTeksScript}
                onChange={(e) => setNewTeksScript(e.target.value)}
                placeholder="Contoh: 'Gaji lu 8 juta tapi tanggal 10 udah saldo 50 ribu? Nih kesalahan fatal kenapa gaji numpang lewat doang...'"
                rows={3}
                required
                className="focus-ring mt-1 w-full rounded-xl border border-input bg-background p-3 text-xs leading-relaxed text-foreground outline-none transition focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-foreground">
                  Alasan Konten Engaging / Pola Hook
                </label>
                <input
                  type="text"
                  value={newAlasan}
                  onChange={(e) => setNewAlasan(e.target.value)}
                  placeholder="Misal: Menyindir gaya hidup konsumtif, angka nominal konkret"
                  className="focus-ring mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none transition focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground">
                  Tag Masalah Finansial
                </label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Misal: Gaji Numpang Lewat / Paylater / Tabungan"
                  className="focus-ring mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground outline-none transition focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border/60 pt-4">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-foreground">
                  Skor Performa FYP:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={newSkor}
                    onChange={(e) => setNewSkor(Number(e.target.value))}
                    className="h-2 w-32 cursor-pointer accent-emerald-600"
                  />
                  <span className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono">
                    <Flame size={12} className="text-amber-500" />
                    {newSkor}/100
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !newTeksScript.trim()}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <Plus size={14} />
                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan ke Pustaka Referensi'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedTag('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              selectedTag === 'all'
                ? 'bg-emerald-800 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Semua ({pustakaList.length})
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                selectedTag === tag
                  ? 'bg-emerald-800 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari naskah / hook..."
            className="focus-ring w-full rounded-xl border border-input bg-background py-2 pl-9 pr-3 text-xs text-foreground outline-none transition focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Masonry / Grid Kartu Pustaka Referensi */}
      {filteredPustaka.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 py-16 text-center">
          <BookOpen size={40} className="text-muted-foreground/50" />
          <h3 className="mt-3 text-sm font-bold text-foreground">Tidak Ada Referensi Ditemukan</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Coba ubah kata kunci pencarian atau tambahkan referensi video baru di atas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPustaka.map((item, idx) => (
            <div
              key={item.id || idx}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition hover:border-emerald-500/50 hover:shadow-md"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="relative h-44 w-full overflow-hidden bg-muted">
                  <img
                    src={item.image_url}
                    alt="Thumbnail Referensi"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-emerald-300 backdrop-blur-md">
                      <Tag size={10} />
                      {item.tag_masalah || 'Finansial'}
                    </span>

                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-black text-white shadow-sm backdrop-blur-md font-mono">
                      <Flame size={11} className="text-amber-300 fill-amber-300" />
                      Skor {item.skor_performa}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-3 right-3">
                    <p className="text-[10px] font-mono text-emerald-200/90">
                      ID: {String(item.id).slice(0, 8)} • RAG Ranked
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3">
                  {/* Script Video Quote */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
                      Transkrip Naskah Video FYP:
                    </span>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-foreground italic bg-muted/40 p-2.5 rounded-lg border border-border/40">
                      "{item.teks_script_video}"
                    </p>
                  </div>

                  {/* Input Alasan Engaging (Editable Langsung) */}
                  <div>
                    <label className="flex items-center justify-between text-[10px] font-bold uppercase text-muted-foreground font-mono">
                      <span>Alasan Engaging? (Pola Hook)</span>
                      <span className="text-emerald-600 text-[9px] font-semibold">Tersimpan Otomatis</span>
                    </label>
                    <textarea
                      defaultValue={item.alasan_engaging}
                      onBlur={(e) => {
                        if (e.target.value !== item.alasan_engaging) {
                          updateReferensi(item.id, { alasan_engaging: e.target.value });
                        }
                      }}
                      rows={2}
                      className="focus-ring mt-1 w-full rounded-lg border border-input bg-background p-2 text-xs text-foreground outline-none transition focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer: Skor Performa Input & Sync Status */}
              <div className="border-t border-border/60 bg-muted/20 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase">
                      Edit Skor:
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      defaultValue={item.skor_performa}
                      onBlur={(e) => {
                        const val = Number(e.target.value);
                        if (!isNaN(val) && val !== item.skor_performa) {
                          updateReferensi(item.id, { skor_performa: val });
                        }
                      }}
                      className="w-16 rounded-md border border-input bg-background px-2 py-1 text-xs font-bold text-foreground font-mono outline-none focus:border-emerald-500"
                    />
                  </div>

                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                    <Check size={12} />
                    RAG Ready
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
