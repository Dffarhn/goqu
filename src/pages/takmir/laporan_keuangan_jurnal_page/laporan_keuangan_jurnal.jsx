import React, { useState, useEffect, useRef } from "react";
import TakmirLayout from "../../../layouts/takmir_layout";
import LaporanNeraca from "../../../components/common/LaporanNeraca";
import LaporanLabaRugi from "../../../components/common/LaporanLabaRugi";
import LaporanPerubahanEkuitas from "../../../components/common/LaporanPerubahanEkuitas";
import {
  generateNeraca as generateNeracaAPI,
  generateLabaRugi as generateLabaRugiAPI,
  generatePerubahanEkuitas as generatePerubahanEkuitasAPI,
} from "../../../services/laporanService";
import { Calendar, Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const LaporanKeuanganJurnalPage = () => {
  const [activeTab, setActiveTab] = useState("neraca");
  const [laporanData, setLaporanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [tahunPerubahan, setTahunPerubahan] = useState(
    new Date().getFullYear().toString()
  );
  const [tanggalAwal, setTanggalAwal] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0]
  );
  const [tanggalAkhir, setTanggalAkhir] = useState(
    new Date().toISOString().split("T")[0]
  );

  const tanggalInputRef = useRef(null);
  const tanggalAwalInputRef = useRef(null);
  const tanggalAkhirInputRef = useRef(null);

  // Generate laporan saat tab atau tanggal berubah
  useEffect(() => {
    generateLaporan();
  }, [activeTab, tanggal, tanggalAwal, tanggalAkhir, tahunPerubahan]);

  const generateLaporan = async () => {
    try {
      setLoading(true);
      setLaporanData(null);

      let data = null;

      switch (activeTab) {
        case "neraca":
          data = await generateNeracaAPI(tanggal);
          // Transform data untuk komponen LaporanNeraca
          data = transformNeracaData(data);
          break;
        case "laba-rugi":
          data = await generateLabaRugiAPI(tanggalAwal, tanggalAkhir);
          // Transform data untuk komponen LaporanLabaRugi
          data = transformLabaRugiData(data);
          break;
        case "perubahan-ekuitas":
          data = await generatePerubahanEkuitasAPI(tahunPerubahan);
          // Transform untuk memastikan semua angka adalah number
          data = transformPerubahanEkuitasData(data);
          break;
        default:
          data = null;
      }

      setLaporanData(data);
    } catch (error) {
      console.error("Error generating laporan:", error);
      toast.error(
        error.response?.data?.message || "Gagal generate laporan"
      );
      setLaporanData(null);
    } finally {
      setLoading(false);
    }
  };

  // Transform Neraca data dari backend ke format frontend
  const transformNeracaData = (data) => {
    if (!data) {
      // Return default structure jika data null
      return {
        aset: {},
        kewajiban: {},
        ekuitas: {},
        totalAset: 0,
        totalKewajiban: 0,
        totalEkuitas: 0,
      };
    }

    // Backend sudah mengembalikan format yang sesuai dengan restriction
    const transformAccountArray = (accounts) => {
      if (!Array.isArray(accounts)) return [];
      return accounts.map((acc) => ({
        ...acc,
        tanpaPembatasan: typeof acc.tanpaPembatasan === "string" ? parseFloat(acc.tanpaPembatasan) : (acc.tanpaPembatasan || 0),
        denganPembatasan: typeof acc.denganPembatasan === "string" ? parseFloat(acc.denganPembatasan) : (acc.denganPembatasan || 0),
        saldo: typeof acc.saldo === "string" ? parseFloat(acc.saldo) : (acc.saldo || 0),
      }));
    };

    const transformGrouped = (grouped) => {
      if (!grouped || typeof grouped !== 'object') return {};
      const result = {};
      Object.keys(grouped).forEach((key) => {
        result[key] = transformAccountArray(grouped[key]);
      });
      return result;
    };

    const toNumber = (val) => (typeof val === "string" ? parseFloat(val) : (val || 0));

    // Transform subtotal - backend sudah dalam format yang benar, hanya perlu ensure number
    const transformSubtotal = (subtotal) => {
      if (!subtotal || typeof subtotal !== 'object') return {};
      const result = {};
      Object.keys(subtotal).forEach((key) => {
        result[key] = {
          tanpaPembatasan: toNumber(subtotal[key]?.tanpaPembatasan),
          denganPembatasan: toNumber(subtotal[key]?.denganPembatasan),
          saldo: toNumber(subtotal[key]?.saldo),
        };
      });
      return result;
    };

    return {
      aset: transformGrouped(data.aset || {}),
      kewajiban: transformGrouped(data.kewajiban || {}),
      ekuitas: transformGrouped(data.ekuitas || {}),
      subtotalAset: transformSubtotal(data.subtotalAset),
      subtotalKewajiban: transformSubtotal(data.subtotalKewajiban),
      subtotalEkuitas: transformSubtotal(data.subtotalEkuitas),
      totalAsetTanpa: toNumber(data.totalAsetTanpa),
      totalAsetDengan: toNumber(data.totalAsetDengan),
      totalAset: toNumber(data.totalAset),
      totalKewajibanTanpa: toNumber(data.totalKewajibanTanpa),
      totalKewajibanDengan: toNumber(data.totalKewajibanDengan),
      totalKewajiban: toNumber(data.totalKewajiban),
      totalEkuitasTanpa: toNumber(data.totalEkuitasTanpa),
      totalEkuitasDengan: toNumber(data.totalEkuitasDengan),
      totalEkuitas: toNumber(data.totalEkuitas),
    };
  };

  // Transform Laba Rugi data dari backend ke format frontend
  const transformLabaRugiData = (data) => {
    if (!data) {
      // Return default structure jika data null
      return {
        pendapatan: {},
        beban: {},
        totalPendapatan: 0,
        totalBeban: 0,
        labaRugi: 0,
      };
    }

    // Backend sudah mengembalikan format yang sesuai dengan restriction
    const transformAccountArray = (accounts) => {
      if (!Array.isArray(accounts)) return [];
      return accounts.map((acc) => ({
        ...acc,
        tanpaPembatasan: typeof acc.tanpaPembatasan === "string" ? parseFloat(acc.tanpaPembatasan) : (acc.tanpaPembatasan || 0),
        denganPembatasan: typeof acc.denganPembatasan === "string" ? parseFloat(acc.denganPembatasan) : (acc.denganPembatasan || 0),
        saldo: typeof acc.saldo === "string" ? parseFloat(acc.saldo) : (acc.saldo || 0),
      }));
    };

    const transformGrouped = (grouped) => {
      if (!grouped || typeof grouped !== 'object') return {};
      const result = {};
      Object.keys(grouped).forEach((key) => {
        result[key] = transformAccountArray(grouped[key]);
      });
      return result;
    };

    const toNumber = (val) => (typeof val === "string" ? parseFloat(val) : (val || 0));

    // Transform subtotal - backend sudah dalam format yang benar, hanya perlu ensure number
    const transformSubtotal = (subtotal) => {
      if (!subtotal || typeof subtotal !== 'object') return {};
      const result = {};
      Object.keys(subtotal).forEach((key) => {
        result[key] = {
          tanpaPembatasan: toNumber(subtotal[key]?.tanpaPembatasan),
          denganPembatasan: toNumber(subtotal[key]?.denganPembatasan),
          saldo: toNumber(subtotal[key]?.saldo),
        };
      });
      return result;
    };

    return {
      pendapatan: transformGrouped(data.pendapatan || {}),
      beban: transformGrouped(data.beban || {}),
      subtotalPendapatan: transformSubtotal(data.subtotalPendapatan),
      subtotalBeban: transformSubtotal(data.subtotalBeban),
      totalPendapatanTanpa: toNumber(data.totalPendapatanTanpa),
      totalPendapatanDengan: toNumber(data.totalPendapatanDengan),
      totalPendapatan: toNumber(data.totalPendapatan),
      totalBebanTanpa: toNumber(data.totalBebanTanpa),
      totalBebanDengan: toNumber(data.totalBebanDengan),
      totalBeban: toNumber(data.totalBeban),
      labaRugiTanpa: toNumber(data.labaRugiTanpa),
      labaRugiDengan: toNumber(data.labaRugiDengan),
      labaRugi: toNumber(data.labaRugi),
    };
  };

  // Transform Perubahan Ekuitas data
  const transformPerubahanEkuitasData = (data) => {
    if (!data) {
      return {
        saldoAwalEkuitasTanpa: 0,
        saldoAwalEkuitasDengan: 0,
        saldoAwalEkuitas: 0,
        labaRugiTanpa: 0,
        labaRugiDengan: 0,
        labaRugi: 0,
        perubahanModalTanpa: 0,
        perubahanModalDengan: 0,
        perubahanModal: 0,
        saldoAkhirEkuitasTanpa: 0,
        saldoAkhirEkuitasDengan: 0,
        saldoAkhirEkuitas: 0,
      };
    }

    const toNumber = (val) => (typeof val === "string" ? parseFloat(val) : (val || 0));

    return {
      saldoAwalEkuitasTanpa: toNumber(data.saldoAwalEkuitasTanpa),
      saldoAwalEkuitasDengan: toNumber(data.saldoAwalEkuitasDengan),
      saldoAwalEkuitas: toNumber(data.saldoAwalEkuitas),
      labaRugiTanpa: toNumber(data.labaRugiTanpa),
      labaRugiDengan: toNumber(data.labaRugiDengan),
      labaRugi: toNumber(data.labaRugi),
      perubahanModalTanpa: toNumber(data.perubahanModalTanpa),
      perubahanModalDengan: toNumber(data.perubahanModalDengan),
      perubahanModal: toNumber(data.perubahanModal),
      saldoAkhirEkuitasTanpa: toNumber(data.saldoAkhirEkuitasTanpa),
      saldoAkhirEkuitasDengan: toNumber(data.saldoAkhirEkuitasDengan),
      saldoAkhirEkuitas: toNumber(data.saldoAkhirEkuitas),
    };
  };

  const tabs = [
    { id: "neraca", label: "Laporan Posisi Keuangan", icon: "📊" },
    { id: "laba-rugi", label: "Laporan Penghasilan Komprehensif", icon: "📈" },
    { id: "perubahan-ekuitas", label: "Laporan Perubahan Aset Neto", icon: "📋" },
  ];

  return (
    <TakmirLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Laporan Keuangan dari Jurnal
          </h1>
          <p className="text-gray-600 mt-1">
            Generate laporan keuangan otomatis dari data jurnal
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!loading) {
                    setActiveTab(tab.id);
                  }
                }}
                disabled={loading}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors relative z-10 ${
                  activeTab === tab.id
                    ? "border-green-600 text-green-600 bg-green-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filter Section */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              {activeTab === "neraca" && (
                <div className="flex-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-gray-700" />
                    <span>Tanggal Laporan</span>
                  </label>
                  <div className="relative">
                    <input
                      ref={tanggalInputRef}
                      type="date"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white [&::-webkit-calendar-picker-indicator]:hidden"
                      style={{
                        colorScheme: 'light'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tanggalInputRef.current) {
                          tanggalInputRef.current.showPicker?.();
                        }
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 pointer-events-auto z-10"
                      tabIndex={-1}
                    >
                      <Calendar className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "laba-rugi" && (
                <>
                  <div className="flex-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 text-gray-700" />
                      <span>Tanggal Awal</span>
                    </label>
                    <div className="relative">
                      <input
                        ref={tanggalAwalInputRef}
                        type="date"
                        value={tanggalAwal}
                        onChange={(e) => setTanggalAwal(e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white [&::-webkit-calendar-picker-indicator]:hidden"
                        style={{
                          colorScheme: 'light'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tanggalAwalInputRef.current) {
                            tanggalAwalInputRef.current.showPicker?.();
                          }
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 pointer-events-auto z-10"
                        tabIndex={-1}
                      >
                        <Calendar className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 text-gray-700" />
                      <span>Tanggal Akhir</span>
                    </label>
                    <div className="relative">
                      <input
                        ref={tanggalAkhirInputRef}
                        type="date"
                        value={tanggalAkhir}
                        onChange={(e) => setTanggalAkhir(e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white [&::-webkit-calendar-picker-indicator]:hidden"
                        style={{
                          colorScheme: 'light'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tanggalAkhirInputRef.current) {
                            tanggalAkhirInputRef.current.showPicker?.();
                          }
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 pointer-events-auto z-10"
                        tabIndex={-1}
                      >
                        <Calendar className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "perubahan-ekuitas" && (
                <div className="flex-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-gray-700" />
                    <span>Tahun Laporan</span>
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={tahunPerubahan}
                    onChange={(e) => setTahunPerubahan(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
              )}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    // Export functionality bisa ditambahkan di sini
                    alert("Fitur export akan ditambahkan");
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                <span className="ml-2 text-gray-600">Memuat laporan...</span>
              </div>
            ) : laporanData ? (
              <>
                {activeTab === "neraca" && <LaporanNeraca data={laporanData} />}
                {activeTab === "laba-rugi" && (
                  <LaporanLabaRugi data={laporanData} />
                )}
                {activeTab === "perubahan-ekuitas" && (
                  <LaporanPerubahanEkuitas data={laporanData} />
                )}
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Tidak ada data untuk ditampilkan
              </div>
            )}
          </div>
        </div>
      </div>
    </TakmirLayout>
  );
};

export default LaporanKeuanganJurnalPage;

