import { create } from 'zustand';
import type { 
  PustakaReferensi, 
  KontenTerbuat, 
  SlideData, 
  PipelineStage, 
  NavigationMenu 
} from '../types/database';
import { 
  getAllPustakaReferensi, 
  getAllKontenTerbuat, 
  insertPustakaReferensi, 
  updatePustakaReferensi, 
  updateAnalitikKonten 
} from '../lib/supabaseClient';
import { handleMagicGenerate } from '../lib/aiPipeline';

interface BilanoState {
  activeMenu: NavigationMenu;
  pipelineStage: PipelineStage;
  pipelineMessage: string;
  isGenerating: boolean;
  
  // Konten aktif generator
  currentJudul: string;
  currentSlides: SlideData[];
  
  // Data Pustaka & Analitik
  pustakaList: PustakaReferensi[];
  kontenList: KontenTerbuat[];
  
  // UI State
  toastMessage: string | null;
  insightAI: string;
  
  // Actions
  setActiveMenu: (menu: NavigationMenu) => void;
  setToast: (msg: string | null) => void;
  loadInitialData: () => Promise<void>;
  triggerMagicPipeline: () => Promise<void>;
  updateSlideField: (slideIndex: number, field: 'dialogue' | 'image_prompt', val: string) => void;
  addReferensi: (item: Omit<PustakaReferensi, 'id' | 'created_at'>) => Promise<void>;
  updateReferensi: (id: string | number, updates: Partial<PustakaReferensi>) => Promise<void>;
  updateKontenMetric: (id: string | number, field: keyof KontenTerbuat, val: any) => void;
  saveAnalitik: (id: string | number) => Promise<void>;
}

export const useBilanoStore = create<BilanoState>((set, get) => ({
  activeMenu: 'generator',
  pipelineStage: 'idle',
  pipelineMessage: '',
  isGenerating: false,

  currentJudul: 'Kenapa Saldo Kamu Numpang Lewat (Solusi 3 Menit Bilano)',
  currentSlides: [
    {
      slide: 1,
      dialogue: 'Baru tanggal 8 kok saldo m-banking udah sisa 82 ribu?! Padahal ga ngerasa foya-foya...',
      image_prompt: 'A young Indonesian man with short messy black hair, wearing a plain green hoodie and round glasses, staring wide-eyed in complete disbelief at his illuminated smartphone screen, sitting in a messy modern studio apartment, comic art style with crisp outlines.',
      image_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80',
    },
    {
      slide: 2,
      dialogue: 'Pas dicek mutasi: Kopi susu kekinian tiap siang, promo ongkir tipu-tipu, paylater cicilan kecil...',
      image_prompt: 'A young Indonesian man with short messy black hair, wearing a plain green hoodie and round glasses, holding an absurdly long paper bank receipt scrolling down to the floor, sweating with comedic regret, vibrant comic panel.',
      image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    },
    {
      slide: 3,
      dialogue: 'Bukan gajimu yang kekecilan, tapi "kebocoran alus" yang ga pernah kecatat di kepalamu!',
      image_prompt: 'A young Indonesian man with short messy black hair, wearing a plain green hoodie and round glasses, pointing an index finger up with an energetic glowing lightbulb idea above his head, confident and insightful comic illustration.',
      image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    },
    {
      slide: 4,
      dialogue: 'Mau catat manual di notes atau Excel? Ribet banget, baru 2 hari pasti udah mager.',
      image_prompt: 'A young Indonesian man with short messy black hair, wearing a plain green hoodie and round glasses, slouching exhausted over a desk littered with crumpled receipts and complicated spreadsheet screens, relatable humor.',
      image_url: 'https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?w=800&auto=format&fit=crop&q=80',
    },
    {
      slide: 5,
      dialogue: 'Untung sekarang ada Bilano. Tiap transaksi keluar langsung terdeteksi dan dikelompokkan otomatis.',
      image_prompt: 'A young Indonesian man with short messy black hair, wearing a plain green hoodie and round glasses, smiling enthusiastically while holding up his phone displaying the clean green Bilano financial app dashboard, modern comic art.',
      image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    },
    {
      slide: 6,
      dialogue: 'Sekarang akhir bulan tetap tenang, tabungan tetap aman. Coba Bilano gratis lewat link di bio!',
      image_prompt: 'A young Indonesian man with short messy black hair, wearing a plain green hoodie and round glasses, giving a friendly thumbs up with rising financial growth charts and a happy green piggy bank in the background, satisfying finale.',
      image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80',
    },
  ],

  pustakaList: [],
  kontenList: [],
  toastMessage: null,
  insightAI: 'Konten dengan Hook "kebocoran alus" & nominal riil di slide 1 menghasilkan rata-rata Engagement Rate 2.4× lebih tinggi dibanding tips menabung normatif. Pola emosi rasa bersalah yang diakhiri solusi instan Bilano paling banyak di-share.',

  setActiveMenu: (menu) => set({ activeMenu: menu }),

  setToast: (msg) => {
    set({ toastMessage: msg });
    if (msg) {
      setTimeout(() => {
        if (get().toastMessage === msg) {
          set({ toastMessage: null });
        }
      }, 3500);
    }
  },

  loadInitialData: async () => {
    try {
      const [pustaka, konten] = await Promise.all([
        getAllPustakaReferensi(),
        getAllKontenTerbuat(),
      ]);
      set({ pustakaList: pustaka, kontenList: konten });
    } catch (err) {
      console.error('Galat memuat data awal:', err);
    }
  },

  triggerMagicPipeline: async () => {
    set({ isGenerating: true, pipelineStage: 'mengambil_referensi' });
    try {
      const result = await handleMagicGenerate((stage, message) => {
        set({ pipelineStage: stage, pipelineMessage: message });
      });

      set((state) => ({
        currentJudul: result.judul_konten,
        currentSlides: result.slides_data_json,
        kontenList: [result, ...state.kontenList],
        isGenerating: false,
        pipelineStage: 'selesai',
        pipelineMessage: 'Berhasil membuat 6 panel komik!',
      }));

      get().setToast('⚡ Pipeline Berhasil! 6 Panel Komik Bilano telah selesai & disimpan ke Supabase.');
    } catch (error: any) {
      set({
        isGenerating: false,
        pipelineStage: 'error',
        pipelineMessage: error?.message || 'Gagal memproses AI pipeline',
      });
      get().setToast('⚠️ Kendala saat memproses pipeline AI.');
    }
  },

  updateSlideField: (slideIndex, field, val) => {
    set((state) => {
      const updated = [...state.currentSlides];
      if (updated[slideIndex]) {
        updated[slideIndex] = { ...updated[slideIndex], [field]: val };
      }
      return { currentSlides: updated };
    });
  },

  addReferensi: async (item) => {
    const newItem = await insertPustakaReferensi(item);
    set((state) => ({
      pustakaList: [newItem, ...state.pustakaList],
    }));
    get().setToast('Referensi baru berhasil ditambahkan ke pustaka!');
  },

  updateReferensi: async (id, updates) => {
    set((state) => ({
      pustakaList: state.pustakaList.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
    await updatePustakaReferensi(id, updates);
    get().setToast('Alasan engaging & skor performa berhasil diperbarui!');
  },

  updateKontenMetric: (id, field, val) => {
    set((state) => ({
      kontenList: state.kontenList.map((item) =>
        item.id === id ? { ...item, [field]: val } : item
      ),
    }));
  },

  saveAnalitik: async (id) => {
    const target = get().kontenList.find((item) => item.id === id);
    if (!target) return;

    const ok = await updateAnalitikKonten(id, {
      views: Number(target.views) || 0,
      likes: Number(target.likes) || 0,
      comments: Number(target.comments) || 0,
      shares: Number(target.shares) || 0,
      status: target.status,
    });

    if (ok) {
      get().setToast('Analitik berhasil disimpan ke Supabase!');
    } else {
      get().setToast('Analitik disimpan di cache lokal sistem.');
    }
  },
}));
