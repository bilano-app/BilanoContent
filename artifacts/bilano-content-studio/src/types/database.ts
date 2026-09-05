export interface PustakaReferensi {
  id: string | number;
  image_url: string;
  teks_script_video: string;
  alasan_engaging: string;
  skor_performa: number; // integer (0 - 100)
  tag_masalah: string;
  created_at?: string;
}

export interface SlideData {
  slide: number;
  dialogue: string;
  image_prompt: string;
  image_url?: string;
}

export type KontenStatus = 'Draft' | 'Uploaded';

export interface KontenTerbuat {
  id: string | number;
  created_at: string;
  judul_konten: string;
  slides_data_json: SlideData[];
  status: KontenStatus;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export type PipelineStage = 
  | 'idle' 
  | 'mengambil_referensi' 
  | 'gemini_menganalisis' 
  | 'segmind_menggambar' 
  | 'selesai' 
  | 'error';

export type NavigationMenu = 'generator' | 'pustaka' | 'analitik';
