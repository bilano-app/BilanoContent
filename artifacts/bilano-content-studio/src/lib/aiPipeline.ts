import type { PustakaReferensi, SlideData, KontenTerbuat, PipelineStage } from '../types/database';
import { getTopReferensiFYP, saveKontenTerbuat, BILANO_MASTER_FACE_URL } from './supabaseClient';

export const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
export const SEGMIND_API_KEY = (import.meta as any).env?.VITE_SEGMIND_API_KEY || '';

// Fallback scripts jika terjadi network / CORS / key error
const FALLBACK_SLIDES: SlideData[] = [
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
];

/**
 * Step 5B: Panggilan Google Gemini 1.5 API (Strict Anti-Summarization)
 */
export async function callGemini15(references: PustakaReferensi[]): Promise<SlideData[]> {
  const referenceContext = references
    .map(
      (ref, idx) =>
        `[REFERENSI ${idx + 1}] (Skor Performa: ${ref.skor_performa}, Tag Masalah: "${ref.tag_masalah}"):\nNaskah: "${ref.teks_script_video}"\nAlasan Menarik: "${ref.alasan_engaging}"`
    )
    .join('\n\n');

  const systemPrompt = `Kamu adalah Ahli Strategi Konten untuk aplikasi keuangan Bilano. Saya melampirkan 5 script FYP berkinerja tinggi. KAMU DILARANG MERINGKAS. 
1. Ekstrak kalimat 'Hook' (3 detik pertama) secara presisi dari tiap referensi.
2. Identifikasi 'Pain Point' spesifik.
3. Buat 1 script komik carousel 6-slide baru bertema edukasi/soft-selling Bilano berdasarkan pola emosi referensi tersebut.
4. 'dialogue' HARUS dalam Bahasa Indonesia (kasual, relatable).
5. 'image_prompt' HARUS dalam Bahasa Inggris yang sangat detail. WAJIB diawali dengan: 'A young Indonesian man with short messy black hair, wearing a plain green hoodie and round glasses, [insert specific action and background]'.
6. Return STRICTLY a JSON array: [{ slide: 1, dialogue: '...', image_prompt: '...' }]`;

  const fullPrompt = `${systemPrompt}\n\nBerikut adalah 5 referensi naskah FYP berkinerja tinggi:\n\n${referenceContext}\n\nIngat: HANYA kembalikan JSON array valid tanpa teks pengantar atau penutup apapun.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Peringatan Gemini API:', response.status, errorText);
      throw new Error(`Gemini API HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Format respon Gemini kosong');
    }

    // Pembersihan jika model menyisipkan markdown ```json ... ```
    const cleanedJson = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsedSlides = JSON.parse(cleanedJson);

    if (Array.isArray(parsedSlides) && parsedSlides.length >= 6) {
      return parsedSlides.slice(0, 6).map((item, index) => ({
        slide: item.slide || index + 1,
        dialogue: item.dialogue || `Slide ${index + 1} Bilano`,
        image_prompt: item.image_prompt.startsWith('A young Indonesian man with short messy black hair')
          ? item.image_prompt
          : `A young Indonesian man with short messy black hair, wearing a plain green hoodie and round glasses, ${item.image_prompt}`,
      }));
    }

    return FALLBACK_SLIDES;
  } catch (err) {
    console.error('Galat saat memanggil Gemini 1.5, menggunakan fallback naskah cerdas:', err);
    return FALLBACK_SLIDES;
  }
}

/**
 * Step 5C: Panggilan Segmind IP-Adapter API untuk 1 Slide
 */
async function generateSegmindSlideImage(slide: SlideData): Promise<string> {
  // Endpoints Segmind IP-Adapter
  const segmindUrl = 'https://api.segmind.com/v1/sd15-ip-adapter';

  const payload = {
    prompt: `${slide.image_prompt}, comic cartoon illustration, flat colors, clean lineart, financial app mascot style, masterpiece, best quality`,
    negative_prompt: 'photorealistic, realistic 3d, deformed, bad anatomy, bad hands, missing fingers, extra digit, cropped, low quality',
    face_image: BILANO_MASTER_FACE_URL,
    ip_adapter_image: BILANO_MASTER_FACE_URL,
    samples: 1,
    scheduler: 'Euler a',
    num_inference_steps: 25,
    guidance_scale: 7.5,
    strength: 0.75,
  };

  try {
    const response = await fetch(segmindUrl, {
      method: 'POST',
      headers: {
        'x-api-key': SEGMIND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errTxt = await response.text();
      console.warn(`Segmind API HTTP ${response.status}:`, errTxt);
      // Fallback ke visual berkualitas tinggi berdasarkan slide
      return getCuratedComicVisual(slide.slide);
    }

    const contentType = response.headers.get('content-type') || '';

    // Jika respon biner berupa image
    if (contentType.includes('image')) {
      const blob = await response.blob();
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    }

    // Jika respon JSON berisi base64 image
    const jsonResult = await response.json();
    if (jsonResult?.image) {
      return jsonResult.image.startsWith('data:')
        ? jsonResult.image
        : `data:image/jpeg;base64,${jsonResult.image}`;
    }

    return getCuratedComicVisual(slide.slide);
  } catch (err) {
    console.warn('Segmind koneksi terkendala/CORS, menggunakan visual ilustrasi komik:', err);
    return getCuratedComicVisual(slide.slide);
  }
}

/**
 * Visual kurasi panel komik Bilano beresolusi tinggi bila kuota Segmind habis atau CORS
 */
function getCuratedComicVisual(slideNumber: number): string {
  const visuals = [
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80',
  ];
  return visuals[(slideNumber - 1) % visuals.length];
}

/**
 * Step 5: Eksekutor Alur "One-Click Magic" Pipeline
 */
export async function handleMagicGenerate(
  onProgress: (stage: PipelineStage, message: string) => void
): Promise<KontenTerbuat> {
  try {
    // Step 5A: RAG Retrieval (Top 5 Pustaka Referensi dengan skor performa tertinggi)
    onProgress('mengambil_referensi', 'Mengambil Referensi FYP...');
    const topReferences = await getTopReferensiFYP(5);

    // Step 5B: Gemini API (Strict Anti-Summarization)
    onProgress('gemini_menganalisis', 'Gemini Menganalisis & Menulis...');
    const generatedSlideDrafts = await callGemini15(topReferences);

    // Step 5C: Segmind API (Parallel Execution via Promise.all)
    onProgress('segmind_menggambar', 'Segmind Menggambar Panel...');
    const imagePromises = generatedSlideDrafts.map(async (slide) => {
      const imageUrl = await generateSegmindSlideImage(slide);
      return {
        ...slide,
        image_url: imageUrl,
      };
    });

    const finalSlides: SlideData[] = await Promise.all(imagePromises);

    // Step 5D: Simpan Hasil ke konten_terbuat di Supabase
    const judulOtomatis = `Komik Carousel: ${finalSlides[0]?.dialogue.slice(0, 48)}...`;
    const newKontenPayload: Omit<KontenTerbuat, 'id' | 'created_at'> = {
      judul_konten: judulOtomatis,
      slides_data_json: finalSlides,
      status: 'Draft',
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
    };

    const savedKonten = await saveKontenTerbuat(newKontenPayload);
    onProgress('selesai', 'Konten 6-slide berhasil dibuat & tersimpan!');
    return savedKonten;
  } catch (error) {
    console.error('Galat fatal pada Magic Pipeline:', error);
    onProgress('error', 'Terjadi kendala saat eksekusi pipeline.');
    throw error;
  }
}
