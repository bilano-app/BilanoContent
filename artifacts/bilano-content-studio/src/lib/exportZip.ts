import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { SlideData } from '../types/database';

export async function exportSlidesToZip(
  slides: SlideData[],
  judulKonten: string = 'Bilano-Carousel-Komik'
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('bilano_slides') || zip;

  // Siapkan file naskah teks
  let textManifest = `========================================================\n`;
  textManifest += `BILANO CONTENT STUDIO - NASKAH KOMIK CAROUSEL 6-SLIDE\n`;
  textManifest += `Judul: ${judulKonten}\n`;
  textManifest += `Tanggal Ekspor: ${new Date().toLocaleString('id-ID')}\n`;
  textManifest += `========================================================\n\n`;

  // Loop dan tambahkan setiap gambar slide
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const slideNumber = slide.slide || i + 1;
    const fileName = `slide_${String(slideNumber).padStart(2, '0')}.jpg`;

    textManifest += `--------------------------------------------------------\n`;
    textManifest += `SLIDE ${slideNumber}:\n`;
    textManifest += `Dialogue (Bahasa Indonesia): \n"${slide.dialogue}"\n\n`;
    textManifest += `Image Prompt (Segmind/Stable Diffusion): \n"${slide.image_prompt}"\n`;
    textManifest += `--------------------------------------------------------\n\n`;

    if (slide.image_url) {
      try {
        if (slide.image_url.startsWith('data:image')) {
          // Base64 Data URL
          const base64Data = slide.image_url.split(',')[1];
          folder.file(fileName, base64Data, { base64: true });
        } else {
          // Fetch dari URL
          const res = await fetch(slide.image_url);
          if (res.ok) {
            const blob = await res.blob();
            folder.file(fileName, blob);
          }
        }
      } catch (err) {
        console.warn(`Gagal mengunduh gambar slide ${slideNumber} untuk ZIP:`, err);
      }
    }
  }

  textManifest += `\nTips Posting Bilano:\n`;
  textManifest += `1. Jadwalkan posting di jam istirahat kantor (12.00 - 13.00) atau malam hari (19.30 - 21.00).\n`;
  textManifest += `2. Pasang kalimat hook slide 1 sebagai cover utama carousel.\n`;
  textManifest += `3. Tambahkan call to action (CTA) di slide 6 mengarah ke link bio aplikasi Bilano.\n`;

  // Tambahkan manifest naskah
  folder.file('naskah_lengkap.txt', textManifest);

  // Generate dan simpan zip
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const sanitizedTitle = judulKonten
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 30);
  saveAs(zipBlob, `bilano_${sanitizedTitle || 'carousel'}_${Date.now()}.zip`);
}
