import { jsPDF } from 'jspdf';
import type { PustakaReferensi } from '../types/database';

export async function exportPustakaToPdf(references: PustakaReferensi[]): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner
  doc.setFillColor(16, 56, 46); // Financial deep green #10382e
  doc.rect(0, 0, pageWidth, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('BILANO CONTENT STUDIO', margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(157, 223, 195); // Accent mint #9ddfc3
  doc.text('Swipe File & Pustaka Referensi Naskah FYP Berkinerja Tinggi', margin, 27);

  doc.setFontSize(8);
  doc.setTextColor(210, 235, 225);
  const tanggalCetak = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Dicetak pada: ${tanggalCetak} | Total: ${references.length} Referensi`, margin, 33);

  let currentY = 48;

  references.forEach((ref, index) => {
    // Cek jika butuh halaman baru
    if (currentY > pageHeight - 55) {
      doc.addPage();
      currentY = 20;
    }

    // Card background
    doc.setFillColor(248, 250, 249);
    doc.setDrawColor(220, 230, 225);
    doc.roundedRect(margin, currentY, contentWidth, 44, 3, 3, 'FD');

    // Accent line di kiri card
    doc.setFillColor(16, 56, 46);
    doc.rect(margin, currentY, 3, 44, 'F');

    // Nomor & Skor Badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(16, 56, 46);
    doc.text(`#${index + 1} - ${ref.tag_masalah || 'Finansial Umum'}`, margin + 6, currentY + 7);

    // Skor badge
    doc.setFillColor(235, 245, 240);
    doc.roundedRect(pageWidth - margin - 28, currentY + 3, 25, 7, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setTextColor(21, 128, 61);
    doc.text(`Skor: ${ref.skor_performa}/100`, pageWidth - margin - 26, currentY + 7.5);

    // Naskah Script
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 110, 105);
    doc.text('NASKAH VIDEO / HOOK:', margin + 6, currentY + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 40, 35);
    const splitScript = doc.splitTextToSize(`"${ref.teks_script_video}"`, contentWidth - 12);
    doc.text(splitScript.slice(0, 2), margin + 6, currentY + 19);

    // Alasan Engaging
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 100, 60);
    doc.text('ALASAN ENGAGING (ANALISIS AI):', margin + 6, currentY + 31);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(70, 75, 72);
    const splitAlasan = doc.splitTextToSize(ref.alasan_engaging, contentWidth - 12);
    doc.text(splitAlasan.slice(0, 2), margin + 6, currentY + 36);

    currentY += 50;
  });

  // Footer di semua halaman
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 150, 145);
    doc.text(
      `Bilano Content Studio - Rahasia Internal Pertumbuhan Konten | Halaman ${i} dari ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Simpan file
  doc.save(`Bilano-Swipe-File-${Date.now()}.pdf`);
}
