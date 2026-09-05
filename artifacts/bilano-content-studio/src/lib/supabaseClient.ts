import { createClient } from '@supabase/supabase-js';
import type { PustakaReferensi, KontenTerbuat } from '../types/database';

export const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://vullupnidyahhoyiwyjo.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_vjD_LinTxJs9A6-WzYORbg_fcze35vq';
export const BILANO_MASTER_FACE_URL = `${SUPABASE_URL}/storage/v1/object/public/assets/bilano-master.jpg`;

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Data cadangan lokal (Initial Seed Data) bertema finansial Indonesia
export const INITIAL_PUSTAKA_SEED: PustakaReferensi[] = [
  {
    id: 'ref-1',
    image_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80',
    teks_script_video: 'Gaji lu 8 juta tapi tanggal 10 udah saldo 50 ribu? Nih kesalahan fatal kenapa gaji numpang lewat doang tiap bulan. Lu bayar gaya hidup sebelum bayar tabungan darurat.',
    alasan_engaging: 'Hook 3 detik sangat menyindir realita anak muda kantoran Jakarta (relatable guilt). Menggunakan angka nominal spesifik.',
    skor_performa: 98,
    tag_masalah: 'Gaji Numpang Lewat',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ref-2',
    image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    teks_script_video: 'Jangan pernah klik checkout paylater sebelum denger ini! Bunga 2.95% per bulan itu setara 35% setahun. Ini simulasi jebakan cicilan kopi kekinian 30 ribu jadi 150 ribu.',
    alasan_engaging: 'Visual urgency warning, membongkar ilusi cicilan kecil paylater dengan hitungan matematika riil.',
    skor_performa: 95,
    tag_masalah: 'Jebakan Paylater',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'ref-3',
    image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    teks_script_video: 'Metode 50-30-20 itu udah basi buat gen Z gaji UMR! Kalau lu maksain sewa kost 2 juta, pos 50% lu udah jebol. Pakai rumus survival 60-15-25 ini biar ga pusing akhir bulan.',
    alasan_engaging: 'Contrarian point of view yang mematahkan mitos umum finansial klasik dan memberi solusi alternatif realistis.',
    skor_performa: 92,
    tag_masalah: 'Budgeting UMR',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'ref-4',
    image_url: 'https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?w=800&auto=format&fit=crop&q=80',
    teks_script_video: 'Lu ngerasa ga pernah foya-foya tapi kok tabungan ga nambah? Coba cek mutasi lu. Silent expense kayak biaya admin transfer, subscribe aplikasi lupa unsubscribe, dan delivery fee!',
    alasan_engaging: 'Membongkar blind spot keuangan ("kebocoran alus") yang tidak disadari audiens tapi sangat relate.',
    skor_performa: 89,
    tag_masalah: 'Silent Expenses',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: 'ref-5',
    image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    teks_script_video: 'Nyesel banget baru tau trik auto-debit pisah rekening waktu umur 25. Rekening 1 buat hura-hura, rekening 2 buat hidup, rekening 3 dikunci tanpa kartu ATM.',
    alasan_engaging: 'Format "Nyesel baru tau sekarang" memicu FOMO sekaligus memberikan framework praktis 3 amplop digital.',
    skor_performa: 87,
    tag_masalah: 'Pisah Rekening',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'ref-6',
    image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80',
    teks_script_video: 'Koleksi tagihan pinjol temen gue numpuk cuma gara-gara gengsi beli tiket konser. Ini cara ngomong "Gue ga ada budget" tanpa harus ngerasa rendah diri.',
    alasan_engaging: 'Sentuhan empati sosial terhadap tekanan pertemanan anak muda (social pressure management).',
    skor_performa: 84,
    tag_masalah: 'Tekanan Sosial',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
];

export const INITIAL_KONTEN_SEED: KontenTerbuat[] = [
  {
    id: 'kt-1',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    judul_konten: 'Kenapa Saldo Kamu Numpang Lewat (Dan Solusi 3 Menit Bilano)',
    status: 'Uploaded',
    views: 48200,
    likes: 3840,
    comments: 428,
    shares: 912,
    slides_data_json: [
      {
        slide: 1,
        dialogue: 'Baru tanggal 7, kok saldo m-banking udah sisa seratus ribu?! Padahal ga beli apa-apa...',
        image_prompt: 'A young Indonesian man with short messy black hair, wearing a plain green hoodie and round glasses, looking shocked and staring closely at his smartphone screen in a cozy Jakarta bedroom, comic cartoon style, vibrant colors.',
        image_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80',
      },
      {
        slide: 2,
        dialogue: 'Ternyata setelah dicek mutasi... kopi kekinian tiap siang, promo delivery tengah malam, admin transfer...',
        image_prompt: 'A young Indonesian man with short messy black hair, wearing a plain green hoodie and round glasses, sweating nervously while holding a long receipt roll coming out of a coffee cup, comic cartoon style.',
        image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
      },
      {
        slide: 3,
        dialogue: 'Bukan gajinya yang kekecilan, tapi "kebocoran alus" yang ga pernah kecatat di kepala lu!',
        image_prompt: 'A young Indonesian man with short messy black hair, wearing a plain green hoodie and round glasses, pointing his finger up with an energetic lightbulb idea above his head, comic art style.',
        image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      },
      {
        slide: 4,
        dialogue: 'Mau catat manual di notes atau spreadsheet ribet banget kan? Baru 2 hari pasti udah mager.',
        image_prompt: 'A young Indonesian man with short messy black hair, wearing a plain green hoodie and round glasses, facepalming over a messy laptop desk with complicated spreadsheets, comic style.',
        image_url: 'https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?w=800&auto=format&fit=crop&q=80',
      },
      {
        slide: 5,
        dialogue: 'Makanya gue pakai Bilano. Tiap ada transaksi keluar, langsung auto-kategori tanpa repot ngetik satu-satu.',
        image_prompt: 'A young Indonesian man with short messy black hair, wearing a plain green hoodie and round glasses, smiling happily while showing a sleek green financial mobile dashboard on his phone screen, comic style.',
        image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
      },
      {
        slide: 6,
        dialogue: 'Sekarang tiap akhir bulan masih bisa nabung 30%. Download Bilano gratis di link bio sekarang!',
        image_prompt: 'A young Indonesian man with short messy black hair, wearing a plain green hoodie and round glasses, giving a cheerful thumbs up with a piggy bank and growing green financial charts in the background, comic style.',
        image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'kt-2',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    judul_konten: 'Bahaya Paylater: Kopi 30 Ribu Jadi Jebakan Batman',
    status: 'Uploaded',
    views: 32150,
    likes: 2190,
    comments: 310,
    shares: 640,
    slides_data_json: [
      {
        slide: 1,
        dialogue: '"Ah cuma 30 ribu dicicil 3 bulan, murah lah!". Stop! Ini cara paylater pelan-pelan nguras rekening lu.',
        image_prompt: 'A young Indonesian man with short messy black hair, wearing a plain green hoodie and round glasses, holding a coffee cup while looking warily at an ominous glowing smartphone credit notification.',
        image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'kt-3',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    judul_konten: 'Aturan 3 Rekening: Cara Anak Magang Bisa Punya Dana Darurat',
    status: 'Draft',
    views: 14200,
    likes: 980,
    comments: 115,
    shares: 180,
    slides_data_json: [],
  },
];

// Helper API functions
export async function getTopReferensiFYP(limit = 5): Promise<PustakaReferensi[]> {
  try {
    const { data, error } = await supabase
      .from('pustaka_referensi')
      .select('*')
      .order('skor_performa', { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      // Fallback ke seed data lokal jika tabel di supabase belum di-seed
      console.warn('Menggunakan fallback data lokal untuk pustaka_referensi:', error?.message);
      return INITIAL_PUSTAKA_SEED.slice(0, limit);
    }
    return data as PustakaReferensi[];
  } catch (err) {
    console.error('Galat koneksi Supabase:', err);
    return INITIAL_PUSTAKA_SEED.slice(0, limit);
  }
}

export async function getAllPustakaReferensi(): Promise<PustakaReferensi[]> {
  try {
    const { data, error } = await supabase
      .from('pustaka_referensi')
      .select('*')
      .order('skor_performa', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_PUSTAKA_SEED;
    }
    return data as PustakaReferensi[];
  } catch (err) {
    console.error('Galat saat mengambil pustaka referensi:', err);
    return INITIAL_PUSTAKA_SEED;
  }
}

export async function insertPustakaReferensi(item: Omit<PustakaReferensi, 'id' | 'created_at'>): Promise<PustakaReferensi> {
  const newItem: PustakaReferensi = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ref-${Date.now()}`,
    created_at: new Date().toISOString(),
    ...item,
  };

  try {
    const { data, error } = await supabase
      .from('pustaka_referensi')
      .insert([newItem])
      .select()
      .single();

    if (error || !data) {
      console.warn('Gagal simpan ke remote Supabase, menyimpan di memory lokal:', error?.message);
      return newItem;
    }
    return data as PustakaReferensi;
  } catch (err) {
    console.warn('Penyimpanan lokal diaktifkan:', err);
    return newItem;
  }
}

export async function updatePustakaReferensi(
  id: string | number,
  updates: Partial<Pick<PustakaReferensi, 'alasan_engaging' | 'skor_performa' | 'tag_masalah'>>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pustaka_referensi')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.warn('Gagal update remote Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Galat saat update referensi:', err);
    return false;
  }
}

export async function getAllKontenTerbuat(): Promise<KontenTerbuat[]> {
  try {
    const { data, error } = await supabase
      .from('konten_terbuat')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_KONTEN_SEED;
    }
    return data as KontenTerbuat[];
  } catch (err) {
    console.error('Galat saat mengambil konten terbuat:', err);
    return INITIAL_KONTEN_SEED;
  }
}

export async function saveKontenTerbuat(item: Omit<KontenTerbuat, 'id' | 'created_at'>): Promise<KontenTerbuat> {
  const newItem: KontenTerbuat = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `kt-${Date.now()}`,
    created_at: new Date().toISOString(),
    ...item,
  };

  try {
    const { data, error } = await supabase
      .from('konten_terbuat')
      .insert([newItem])
      .select()
      .single();

    if (error || !data) {
      console.warn('Gagal menyimpan konten ke remote Supabase, fallback lokal:', error?.message);
      return newItem;
    }
    return data as KontenTerbuat;
  } catch (err) {
    console.warn('Menyimpan di cache lokal:', err);
    return newItem;
  }
}

export async function updateAnalitikKonten(
  id: string | number,
  updates: Partial<Pick<KontenTerbuat, 'views' | 'likes' | 'comments' | 'shares' | 'status'>>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('konten_terbuat')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.warn('Gagal update analitik ke Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Galat saat update analitik:', err);
    return false;
  }
}
