import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import formatCurrency from "./formatCurrency";

/**
 * Export laporan ke PDF
 * @param {Object} laporanData - Data laporan
 * @param {string} laporanType - Tipe laporan: 'neraca', 'laba-rugi', 'perubahan-ekuitas'
 * @param {string} masjidName - Nama masjid
 * @param {Object} periode - Object dengan tanggal atau tanggalAwal/tanggalAkhir
 */
export const exportToPDF = (laporanData, laporanType, masjidName = "Masjid", periode = {}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(getLaporanTitle(laporanType), pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(masjidName, pageWidth / 2, 30, { align: "center" });

  // Periode
  if (periode.tanggal) {
    const tanggalStr = new Date(periode.tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    doc.text(`Per ${tanggalStr}`, pageWidth / 2, 36, { align: "center" });
  } else if (periode.tanggalAwal && periode.tanggalAkhir) {
    const awalStr = new Date(periode.tanggalAwal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const akhirStr = new Date(periode.tanggalAkhir).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    doc.text(`Periode: ${awalStr} - ${akhirStr}`, pageWidth / 2, 36, { align: "center" });
  } else if (periode.tahun) {
    doc.text(`Tahun: ${periode.tahun}`, pageWidth / 2, 36, { align: "center" });
  }

  let startY = 45;

  // Generate table berdasarkan tipe laporan
  switch (laporanType) {
    case "neraca":
      startY = generateNeracaPDF(doc, laporanData, startY, pageWidth, margin);
      break;
    case "laba-rugi":
      startY = generateLabaRugiPDF(doc, laporanData, startY, pageWidth, margin);
      break;
    case "perubahan-ekuitas":
      startY = generatePerubahanEkuitasPDF(doc, laporanData, startY, pageWidth, margin);
      break;
    default:
      doc.text("Laporan tidak tersedia", margin, startY);
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Save PDF
  const fileName = `${getLaporanTitle(laporanType)}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
};

/**
 * Export laporan ke Excel
 * @param {Object} laporanData - Data laporan
 * @param {string} laporanType - Tipe laporan: 'neraca', 'laba-rugi', 'perubahan-ekuitas'
 * @param {string} masjidName - Nama masjid
 * @param {Object} periode - Object dengan tanggal atau tanggalAwal/tanggalAkhir
 */
export const exportToExcel = (laporanData, laporanType, masjidName = "Masjid", periode = {}) => {
  const wb = XLSX.utils.book_new();

  // Generate worksheet berdasarkan tipe laporan
  let ws;
  switch (laporanType) {
    case "neraca":
      ws = generateNeracaExcel(laporanData, masjidName, periode);
      break;
    case "laba-rugi":
      ws = generateLabaRugiExcel(laporanData, masjidName, periode);
      break;
    case "perubahan-ekuitas":
      ws = generatePerubahanEkuitasExcel(laporanData, masjidName, periode);
      break;
    default:
      ws = XLSX.utils.aoa_to_sheet([["Laporan tidak tersedia"]]);
  }

  XLSX.utils.book_append_sheet(wb, ws, "Laporan");

  // Save Excel
  const fileName = `${getLaporanTitle(laporanType)}_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

// Helper functions
const getLaporanTitle = (laporanType) => {
  const titles = {
    neraca: "Laporan Posisi Keuangan",
    "laba-rugi": "Laporan Penghasilan Komprehensif",
    "perubahan-ekuitas": "Laporan Perubahan Aset Neto",
  };
  return titles[laporanType] || "Laporan Keuangan";
};

// PDF Generators
const generateNeracaPDF = (doc, data, startY, pageWidth, margin) => {
  const tableData = [];

  // Aset
  tableData.push(["ASET", "", "", ""]);
  if (data.aset) {
    Object.keys(data.aset).forEach((kategori) => {
      tableData.push([kategori, "", "", ""]);
      data.aset[kategori].forEach((acc) => {
        tableData.push([
          acc.namaAkun || acc.nama,
          formatCurrency(acc.tanpaPembatasan || 0),
          formatCurrency(acc.denganPembatasan || 0),
          formatCurrency(acc.saldo || 0),
        ]);
      });
      if (data.subtotalAset && data.subtotalAset[kategori]) {
        const subtotal = data.subtotalAset[kategori];
        tableData.push([
          `Subtotal ${kategori}`,
          formatCurrency(subtotal.tanpaPembatasan || 0),
          formatCurrency(subtotal.denganPembatasan || 0),
          formatCurrency(subtotal.saldo || 0),
        ]);
      }
    });
  }
  tableData.push([
    "Total Aset",
    formatCurrency(data.totalAsetTanpa || 0),
    formatCurrency(data.totalAsetDengan || 0),
    formatCurrency(data.totalAset || 0),
  ]);

  // Kewajiban
  tableData.push(["KEWAJIBAN", "", "", ""]);
  if (data.kewajiban) {
    Object.keys(data.kewajiban).forEach((kategori) => {
      tableData.push([kategori, "", "", ""]);
      data.kewajiban[kategori].forEach((acc) => {
        tableData.push([
          acc.namaAkun || acc.nama,
          formatCurrency(acc.tanpaPembatasan || 0),
          formatCurrency(acc.denganPembatasan || 0),
          formatCurrency(acc.saldo || 0),
        ]);
      });
      if (data.subtotalKewajiban && data.subtotalKewajiban[kategori]) {
        const subtotal = data.subtotalKewajiban[kategori];
        tableData.push([
          `Subtotal ${kategori}`,
          formatCurrency(subtotal.tanpaPembatasan || 0),
          formatCurrency(subtotal.denganPembatasan || 0),
          formatCurrency(subtotal.saldo || 0),
        ]);
      }
    });
  }
  tableData.push([
    "Total Kewajiban",
    formatCurrency(data.totalKewajibanTanpa || 0),
    formatCurrency(data.totalKewajibanDengan || 0),
    formatCurrency(data.totalKewajiban || 0),
  ]);

  // Ekuitas
  tableData.push(["EKUITAS", "", "", ""]);
  if (data.ekuitas) {
    Object.keys(data.ekuitas).forEach((kategori) => {
      tableData.push([kategori, "", "", ""]);
      data.ekuitas[kategori].forEach((acc) => {
        tableData.push([
          acc.namaAkun || acc.nama,
          formatCurrency(acc.tanpaPembatasan || 0),
          formatCurrency(acc.denganPembatasan || 0),
          formatCurrency(acc.saldo || 0),
        ]);
      });
      if (data.subtotalEkuitas && data.subtotalEkuitas[kategori]) {
        const subtotal = data.subtotalEkuitas[kategori];
        tableData.push([
          `Subtotal ${kategori}`,
          formatCurrency(subtotal.tanpaPembatasan || 0),
          formatCurrency(subtotal.denganPembatasan || 0),
          formatCurrency(subtotal.saldo || 0),
        ]);
      }
    });
  }
  tableData.push([
    "Total Ekuitas",
    formatCurrency(data.totalEkuitasTanpa || 0),
    formatCurrency(data.totalEkuitasDengan || 0),
    formatCurrency(data.totalEkuitas || 0),
  ]);

  doc.autoTable({
    startY: startY,
    head: [["Akun", "Tanpa Pembatasan", "Dengan Pembatasan", "Saldo"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
    didParseCell: (data) => {
      // Bold untuk header kategori dan total
      if (data.row.index === 0 || data.cell.text[0] === "ASET" || data.cell.text[0] === "KEWAJIBAN" || data.cell.text[0] === "EKUITAS" || data.cell.text[0].includes("Total")) {
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  return doc.lastAutoTable.finalY + 10;
};

const generateLabaRugiPDF = (doc, data, startY, pageWidth, margin) => {
  const tableData = [];

  // Pendapatan
  tableData.push(["PENDAPATAN", "", "", ""]);
  if (data.pendapatan) {
    Object.keys(data.pendapatan).forEach((kategori) => {
      tableData.push([kategori, "", "", ""]);
      data.pendapatan[kategori].forEach((acc) => {
        tableData.push([
          acc.namaAkun || acc.nama,
          formatCurrency(acc.tanpaPembatasan || 0),
          formatCurrency(acc.denganPembatasan || 0),
          formatCurrency(acc.saldo || 0),
        ]);
      });
      if (data.subtotalPendapatan && data.subtotalPendapatan[kategori]) {
        const subtotal = data.subtotalPendapatan[kategori];
        tableData.push([
          `Subtotal ${kategori}`,
          formatCurrency(subtotal.tanpaPembatasan || 0),
          formatCurrency(subtotal.denganPembatasan || 0),
          formatCurrency(subtotal.saldo || 0),
        ]);
      }
    });
  }
  tableData.push([
    "Total Pendapatan",
    formatCurrency(data.totalPendapatanTanpa || 0),
    formatCurrency(data.totalPendapatanDengan || 0),
    formatCurrency(data.totalPendapatan || 0),
  ]);

  // Beban
  tableData.push(["BEBAN", "", "", ""]);
  if (data.beban) {
    Object.keys(data.beban).forEach((kategori) => {
      tableData.push([kategori, "", "", ""]);
      data.beban[kategori].forEach((acc) => {
        tableData.push([
          acc.namaAkun || acc.nama,
          formatCurrency(acc.tanpaPembatasan || 0),
          formatCurrency(acc.denganPembatasan || 0),
          formatCurrency(acc.saldo || 0),
        ]);
      });
      if (data.subtotalBeban && data.subtotalBeban[kategori]) {
        const subtotal = data.subtotalBeban[kategori];
        tableData.push([
          `Subtotal ${kategori}`,
          formatCurrency(subtotal.tanpaPembatasan || 0),
          formatCurrency(subtotal.denganPembatasan || 0),
          formatCurrency(subtotal.saldo || 0),
        ]);
      }
    });
  }
  tableData.push([
    "Total Beban",
    formatCurrency(data.totalBebanTanpa || 0),
    formatCurrency(data.totalBebanDengan || 0),
    formatCurrency(data.totalBeban || 0),
  ]);

  // Laba Rugi
  tableData.push([
    "Laba (Rugi) Bersih",
    formatCurrency((data.totalPendapatanTanpa || 0) - (data.totalBebanTanpa || 0)),
    formatCurrency((data.totalPendapatanDengan || 0) - (data.totalBebanDengan || 0)),
    formatCurrency((data.totalPendapatan || 0) - (data.totalBeban || 0)),
  ]);

  doc.autoTable({
    startY: startY,
    head: [["Akun", "Tanpa Pembatasan", "Dengan Pembatasan", "Saldo"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
    didParseCell: (data) => {
      // Bold untuk header kategori dan total
      if (data.row.index === 0 || data.cell.text[0] === "PENDAPATAN" || data.cell.text[0] === "BEBAN" || data.cell.text[0].includes("Total") || data.cell.text[0].includes("Laba")) {
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  return doc.lastAutoTable.finalY + 10;
};

const generatePerubahanEkuitasPDF = (doc, data, startY, pageWidth, margin) => {
  const tableData = [
    ["", "Tanpa Pembatasan", "Dengan Pembatasan", "Total"],
    ["Saldo Awal", formatCurrency(data.saldoAwalEkuitasTanpa || 0), formatCurrency(data.saldoAwalEkuitasDengan || 0), formatCurrency((data.saldoAwalEkuitasTanpa || 0) + (data.saldoAwalEkuitasDengan || 0))],
    ["Penghasilan Komprehensif", formatCurrency(data.labaRugiTanpa || 0), formatCurrency(data.labaRugiDengan || 0), formatCurrency((data.labaRugiTanpa || 0) + (data.labaRugiDengan || 0))],
    ["Perubahan Modal", formatCurrency(data.perubahanModalTanpa || 0), formatCurrency(data.perubahanModalDengan || 0), formatCurrency((data.perubahanModalTanpa || 0) + (data.perubahanModalDengan || 0))],
    ["Saldo Akhir", formatCurrency(data.saldoAkhirEkuitasTanpa || 0), formatCurrency(data.saldoAkhirEkuitasDengan || 0), formatCurrency((data.saldoAkhirEkuitasTanpa || 0) + (data.saldoAkhirEkuitasDengan || 0))],
  ];

  doc.autoTable({
    startY: startY,
    head: [tableData[0]],
    body: tableData.slice(1),
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 10 },
    margin: { left: margin, right: margin },
  });

  return doc.lastAutoTable.finalY + 10;
};

// Excel Generators
const generateNeracaExcel = (data, masjidName, periode) => {
  const rows = [];

  // Header
  rows.push(["Laporan Posisi Keuangan"]);
  rows.push([masjidName]);
  if (periode.tanggal) {
    const tanggalStr = new Date(periode.tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    rows.push([`Per ${tanggalStr}`]);
  } else if (periode.tanggalAwal && periode.tanggalAkhir) {
    const awalStr = new Date(periode.tanggalAwal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const akhirStr = new Date(periode.tanggalAkhir).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    rows.push([`Periode: ${awalStr} - ${akhirStr}`]);
  }
  rows.push([]);

  // Table header
  rows.push(["Akun", "Tanpa Pembatasan", "Dengan Pembatasan", "Saldo"]);

  // Aset
  rows.push(["ASET", "", "", ""]);
  if (data.aset) {
    Object.keys(data.aset).forEach((kategori) => {
      rows.push([kategori, "", "", ""]);
      data.aset[kategori].forEach((acc) => {
        rows.push([
          acc.namaAkun || acc.nama,
          acc.tanpaPembatasan || 0,
          acc.denganPembatasan || 0,
          acc.saldo || 0,
        ]);
      });
      if (data.subtotalAset && data.subtotalAset[kategori]) {
        const subtotal = data.subtotalAset[kategori];
        rows.push([
          `Subtotal ${kategori}`,
          subtotal.tanpaPembatasan || 0,
          subtotal.denganPembatasan || 0,
          subtotal.saldo || 0,
        ]);
      }
    });
  }
  rows.push([
    "Total Aset",
    data.totalAsetTanpa || 0,
    data.totalAsetDengan || 0,
    data.totalAset || 0,
  ]);
  rows.push([]);

  // Kewajiban
  rows.push(["KEWAJIBAN", "", "", ""]);
  if (data.kewajiban) {
    Object.keys(data.kewajiban).forEach((kategori) => {
      rows.push([kategori, "", "", ""]);
      data.kewajiban[kategori].forEach((acc) => {
        rows.push([
          acc.namaAkun || acc.nama,
          acc.tanpaPembatasan || 0,
          acc.denganPembatasan || 0,
          acc.saldo || 0,
        ]);
      });
      if (data.subtotalKewajiban && data.subtotalKewajiban[kategori]) {
        const subtotal = data.subtotalKewajiban[kategori];
        rows.push([
          `Subtotal ${kategori}`,
          subtotal.tanpaPembatasan || 0,
          subtotal.denganPembatasan || 0,
          subtotal.saldo || 0,
        ]);
      }
    });
  }
  rows.push([
    "Total Kewajiban",
    data.totalKewajibanTanpa || 0,
    data.totalKewajibanDengan || 0,
    data.totalKewajiban || 0,
  ]);
  rows.push([]);

  // Ekuitas
  rows.push(["EKUITAS", "", "", ""]);
  if (data.ekuitas) {
    Object.keys(data.ekuitas).forEach((kategori) => {
      rows.push([kategori, "", "", ""]);
      data.ekuitas[kategori].forEach((acc) => {
        rows.push([
          acc.namaAkun || acc.nama,
          acc.tanpaPembatasan || 0,
          acc.denganPembatasan || 0,
          acc.saldo || 0,
        ]);
      });
      if (data.subtotalEkuitas && data.subtotalEkuitas[kategori]) {
        const subtotal = data.subtotalEkuitas[kategori];
        rows.push([
          `Subtotal ${kategori}`,
          subtotal.tanpaPembatasan || 0,
          subtotal.denganPembatasan || 0,
          subtotal.saldo || 0,
        ]);
      }
    });
  }
  rows.push([
    "Total Ekuitas",
    data.totalEkuitasTanpa || 0,
    data.totalEkuitasDengan || 0,
    data.totalEkuitas || 0,
  ]);

  return XLSX.utils.aoa_to_sheet(rows);
};

const generateLabaRugiExcel = (data, masjidName, periode) => {
  const rows = [];

  // Header
  rows.push(["Laporan Penghasilan Komprehensif"]);
  rows.push([masjidName]);
  if (periode.tanggalAwal && periode.tanggalAkhir) {
    const awalStr = new Date(periode.tanggalAwal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const akhirStr = new Date(periode.tanggalAkhir).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    rows.push([`Periode: ${awalStr} - ${akhirStr}`]);
  }
  rows.push([]);

  // Table header
  rows.push(["Akun", "Tanpa Pembatasan", "Dengan Pembatasan", "Saldo"]);

  // Pendapatan
  rows.push(["PENDAPATAN", "", "", ""]);
  if (data.pendapatan) {
    Object.keys(data.pendapatan).forEach((kategori) => {
      rows.push([kategori, "", "", ""]);
      data.pendapatan[kategori].forEach((acc) => {
        rows.push([
          acc.namaAkun || acc.nama,
          acc.tanpaPembatasan || 0,
          acc.denganPembatasan || 0,
          acc.saldo || 0,
        ]);
      });
      if (data.subtotalPendapatan && data.subtotalPendapatan[kategori]) {
        const subtotal = data.subtotalPendapatan[kategori];
        rows.push([
          `Subtotal ${kategori}`,
          subtotal.tanpaPembatasan || 0,
          subtotal.denganPembatasan || 0,
          subtotal.saldo || 0,
        ]);
      }
    });
  }
  rows.push([
    "Total Pendapatan",
    data.totalPendapatanTanpa || 0,
    data.totalPendapatanDengan || 0,
    data.totalPendapatan || 0,
  ]);
  rows.push([]);

  // Beban
  rows.push(["BEBAN", "", "", ""]);
  if (data.beban) {
    Object.keys(data.beban).forEach((kategori) => {
      rows.push([kategori, "", "", ""]);
      data.beban[kategori].forEach((acc) => {
        rows.push([
          acc.namaAkun || acc.nama,
          acc.tanpaPembatasan || 0,
          acc.denganPembatasan || 0,
          acc.saldo || 0,
        ]);
      });
      if (data.subtotalBeban && data.subtotalBeban[kategori]) {
        const subtotal = data.subtotalBeban[kategori];
        rows.push([
          `Subtotal ${kategori}`,
          subtotal.tanpaPembatasan || 0,
          subtotal.denganPembatasan || 0,
          subtotal.saldo || 0,
        ]);
      }
    });
  }
  rows.push([
    "Total Beban",
    data.totalBebanTanpa || 0,
    data.totalBebanDengan || 0,
    data.totalBeban || 0,
  ]);
  rows.push([]);

  // Laba Rugi
  rows.push([
    "Laba (Rugi) Bersih",
    (data.totalPendapatanTanpa || 0) - (data.totalBebanTanpa || 0),
    (data.totalPendapatanDengan || 0) - (data.totalBebanDengan || 0),
    (data.totalPendapatan || 0) - (data.totalBeban || 0),
  ]);

  return XLSX.utils.aoa_to_sheet(rows);
};

const generatePerubahanEkuitasExcel = (data, masjidName, periode) => {
  const rows = [];

  // Header
  rows.push(["Laporan Perubahan Aset Neto"]);
  rows.push([masjidName]);
  if (periode.tanggalAwal && periode.tanggalAkhir) {
    const awalStr = new Date(periode.tanggalAwal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const akhirStr = new Date(periode.tanggalAkhir).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    rows.push([`Periode: ${awalStr} - ${akhirStr}`]);
  } else if (periode.tahun) {
    rows.push([`Tahun: ${periode.tahun}`]);
  }
  rows.push([]);

  // Table
  rows.push(["", "Tanpa Pembatasan", "Dengan Pembatasan", "Total"]);
  rows.push([
    "Saldo Awal",
    data.saldoAwalEkuitasTanpa || 0,
    data.saldoAwalEkuitasDengan || 0,
    (data.saldoAwalEkuitasTanpa || 0) + (data.saldoAwalEkuitasDengan || 0),
  ]);
  rows.push([
    "Penghasilan Komprehensif",
    data.labaRugiTanpa || 0,
    data.labaRugiDengan || 0,
    (data.labaRugiTanpa || 0) + (data.labaRugiDengan || 0),
  ]);
  rows.push([
    "Perubahan Modal",
    data.perubahanModalTanpa || 0,
    data.perubahanModalDengan || 0,
    (data.perubahanModalTanpa || 0) + (data.perubahanModalDengan || 0),
  ]);
  rows.push([
    "Saldo Akhir",
    data.saldoAkhirEkuitasTanpa || 0,
    data.saldoAkhirEkuitasDengan || 0,
    (data.saldoAkhirEkuitasTanpa || 0) + (data.saldoAkhirEkuitasDengan || 0),
  ]);

  return XLSX.utils.aoa_to_sheet(rows);
};

