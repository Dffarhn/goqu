import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/common/LandingPage/Navbar";
import MetaData from "../../../components/common/MetaData";
import Footer from "../../../components/common/LandingPage/Footer";
import MosqueCardSection from "../../../components/common/Home/MosqueCardSection";
import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import formatCurrency from "../../../utils/formatCurrency";
import {
  Building2,
  Calendar,
  Download,
  Eye,
  FileText,
  TrendingUp,
  User,
} from "lucide-react";

// SVG component for the decorative curve
const TopCurve = () => (
  <svg
    className="absolute top-0 left-0 w-full"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 120"
  >
    <path
      d="M1440,89c-28.53-20.56-122.28-79.31-253.33-79.31C959.33,9.69,870,110.31,586.67,110.31,303.33,110.31,214,9.69,82.67,9.69,49.33,9.69,0,22.31,0,22.31V0H1440Z"
      fill="rgba(255,255,255,0.08)"
    ></path>
  </svg>
);

const laporanList = [
  {
    title: "Laporan Atas Posisi Keuangan",
    subtitle: "Donasi Siap Pakai",
    description:
      "Ringkasan komprehensif posisi keuangan organisasi per periode",
    icon: Building2,
    color: "from-blue-500 to-blue-600",
    status: "Updated",
    lastUpdate: "25 Mei 2025",
    size: "2.4 MB",
  },
  {
    title: "Laporan Penghasilan Komprehensif",
    subtitle: "Donasi Siap Pakai",
    description:
      "Analisis detail pendapatan dan beban operasional periode berjalan",
    icon: TrendingUp,
    color: "from-emerald-500 to-emerald-600",
    status: "Updated",
    lastUpdate: "25 Mei 2025",
    size: "1.8 MB",
  },
  {
    title: "Laporan Perubahan Aset Neto",
    subtitle: "Donasi Siap Pakai",
    description: "Tracking perubahan aset bersih dan equity organisasi",
    icon: FileText,
    color: "from-purple-500 to-purple-600",
    status: "Updated",
    lastUpdate: "24 Mei 2025",
    size: "1.2 MB",
  },
  {
    title: "Laporan Arus Kas",
    subtitle: "Donasi Siap Pakai",
    description:
      "Monitoring aliran kas masuk dan keluar dalam periode pelaporan",
    icon: TrendingUp,
    color: "from-orange-500 to-orange-600",
    status: "Updated",
    lastUpdate: "24 Mei 2025",
    size: "1.6 MB",
  },
  {
    title: "Catatan atas Laporan Keuangan",
    subtitle: "Donasi Siap Pakai",
    description: "Penjelasan detail dan metodologi laporan keuangan",
    icon: FileText,
    color: "from-indigo-500 to-indigo-600",
    status: "Updated",
    lastUpdate: "23 Mei 2025",
    size: "3.1 MB",
  },
];

// Icon components
const LocationIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
);

const AreaIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
    />
  </svg>
);

// Facility status colors
const getFacilityStatusColor = (kondisi) => {
  switch (kondisi) {
    case "BAIK_SEKALI":
      return "bg-green-100 text-green-800 border-green-200";
    case "SANGAT_BAIK":
      return "bg-green-100 text-green-800 border-green-200";
    case "BAIK":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "CUKUP_BAIK":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "KURANG_BAIK":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Format facility status text
const formatFacilityStatus = (kondisi) => {
  return kondisi
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Image carousel component
const ImageCarousel = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative">
      <h4 className="font-semibold text-lg mb-4 text-gray-800">{title}</h4>
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <img
          src={images[currentIndex]}
          alt={`${title} ${currentIndex + 1}`}
          className="w-full h-96 object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Donation expenses component
const DonationExpenses = ({ expenses }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedExpenses = showAll ? expenses : expenses.slice(0, 3);

  if (!expenses || expenses.length === 0) return null;

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + parseInt(expense.UangPengeluaran),
    0
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Laporan Pengeluaran Donasi
        </h3>
        <div className="text-sm text-gray-600">
          Total:{" "}
          <span className="font-semibold text-green-600">
            {formatCurrency(totalExpenses)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {displayedExpenses.map((expense) => (
          <div
            key={expense.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900">
                {expense.TujuanPengeluaran}
              </h4>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(parseInt(expense.UangPengeluaran))}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {expense.DeskripsiPengeluaran}
            </p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>
                {new Date(expense.CreatedAt).toLocaleDateString("id-ID")}
              </span>
              {expense.FotoPengeluaran && (
                <a
                  href={expense.FotoPengeluaran}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Lihat Bukti
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {expenses.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 text-center text-green-600 hover:text-green-800 font-medium transition-colors duration-200"
        >
          {showAll
            ? "Tampilkan Lebih Sedikit"
            : `Tampilkan ${expenses.length - 3} Lainnya`}
        </button>
      )}
    </div>
  );
};

const LaporanKeuangan = ({ dataLaporanMasjid = [] }) => {
  const JENIS_LAPORAN_ENUM = {
    POSISI_KEUANGAN: "POSISI_KEUANGAN",
    PENGHASILAN_KOMPREHENSIF: "PENGHASILAN_KOMP",
    PERUBAHAN_ASET_NETO: "PERUBAHAN_ASET_NETO",
    ARUS_KAS: "ARUS_KAS",
    CATATAN_LAPORAN_KEUANGAN: "CATATAN",
  };

  // Static template data with jenis mapping
  const laporanTemplates = [
    {
      jenis: "POSISI_KEUANGAN",
      jenisEnum: JENIS_LAPORAN_ENUM.POSISI_KEUANGAN,
      title: "Laporan Atas Posisi Keuangan",
      subtitle: "Donasi Siap Pakai",
      description:
        "Ringkasan komprehensif posisi keuangan organisasi per periode",
      icon: Building2,
      color: "from-blue-500 to-blue-600",
      templateSize: "156 KB",
    },
    {
      jenis: "PENGHASILAN_KOMP",
      jenisEnum: JENIS_LAPORAN_ENUM.PENGHASILAN_KOMPREHENSIF,
      title: "Laporan Penghasilan Komprehensif",
      subtitle: "Donasi Siap Pakai",
      description:
        "Analisis detail pendapatan dan beban operasional",
      icon: TrendingUp,
      color: "from-emerald-500 to-emerald-600",
      templateSize: "142 KB",
    },
    {
      jenis: "PERUBAHAN_ASET_NETO",
      jenisEnum: JENIS_LAPORAN_ENUM.PERUBAHAN_ASET_NETO,
      title: "Laporan Perubahan Aset Neto",
      subtitle: "Donasi Siap Pakai",
      description: "Tracking perubahan aset bersih dan equity organisasi",
      icon: FileText,
      color: "from-purple-500 to-purple-600",
      templateSize: "128 KB",
    },
    {
      jenis: "ARUS_KAS",
      jenisEnum: JENIS_LAPORAN_ENUM.ARUS_KAS,
      title: "Laporan Arus Kas",
      subtitle: "Donasi Siap Pakai",
      description:
        "Monitoring aliran kas masuk dan keluar dalam periode pelaporan",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      templateSize: "134 KB",
    },
    {
      jenis: "CATATAN",
      jenisEnum: JENIS_LAPORAN_ENUM.CATATAN_LAPORAN_KEUANGAN,
      title: "Catatan atas Laporan Keuangan",
      subtitle: "Donasi Siap Pakai",
      description: "Penjelasan detail dan metodologi laporan keuangan",
      icon: FileText,
      color: "from-indigo-500 to-indigo-600",
      templateSize: "178 KB",
    },
  ];

  // Process data - merge template with API data (hanya yang ada di API)
  const laporanList = dataLaporanMasjid
    .map((laporanAPI) => {
      const template = laporanTemplates.find(
        (t) => t.jenis === laporanAPI.jenis
      );

      if (!template) {
        console.warn(`Template not found for jenis: ${laporanAPI.jenis}`);
        return null;
      }

      return {
        ...template,
        // API data
        id: laporanAPI.id,
        fileUrl: laporanAPI.fileUrl,
        uploadedAt: laporanAPI.uploadedAt,
        fileSizeKB: laporanAPI.fileSizeKB,

        // Computed fields untuk display
        status: "Tersedia",
        period: new Date(laporanAPI.uploadedAt).toLocaleDateString("id-ID", {
          month: "short",
          year: "numeric",
        }),
        lastUpdate: new Date(laporanAPI.uploadedAt).toLocaleDateString(
          "id-ID",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        ),
        size: `${laporanAPI.fileSizeKB} KB`,
        uploadedBy: "Takmir Masjid", // atau bisa dari API jika ada
      };
    })
    .filter(Boolean); // Remove null entries

  // Handler untuk melihat laporan
  const handleViewReport = (laporan) => {
    if (laporan.fileUrl) {
      // Buka file di tab baru untuk preview
      window.open(laporan.fileUrl, "_blank");
      console.log(`Membuka laporan: ${laporan.title}`);
    } else {
      console.error("File URL tidak tersedia");
    }
  };

  // Handler untuk download laporan
  const handleDownloadReport = (laporan) => {
    if (laporan.fileUrl) {
      // Method 1: Direct download dengan fetch
      fetch(laporan.fileUrl)
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${laporan.title}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Download error:", error);
          // Fallback: buka di tab baru
          window.open(laporan.fileUrl, "_blank");
        });

      console.log(`Mengunduh laporan: ${laporan.title}`);
    } else {
      console.error("File URL tidak tersedia");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Laporan Keuangan Masjid
        </h2>
        <p className="text-gray-600">
          Laporan keuangan resmi yang telah dipublikasikan
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Laporan</p>
              <p className="text-xl font-bold text-gray-900">
                {laporanList.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {laporanList.map((laporan) => {
          const IconComponent = laporan.icon;
          return (
            <div
              key={laporan.id}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Header with gradient */}
              <div
                className={`h-24 bg-gradient-to-r ${laporan.color} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/10 rounded-full"></div>
                <div className="relative p-6 flex items-center justify-between h-full">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      {laporan.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-300">
                      {laporan.title}
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {laporan.period}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {laporan.description}
                  </p>
                </div>

                {/* Meta info */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {laporan.lastUpdate}
                    </span>
                    <span className="font-medium">{laporan.size}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <User className="w-3 h-3 mr-1" />
                    <span>Dipublikasikan oleh {laporan.uploadedBy}</span>
                  </div>
                </div>

                {/* Actions - User dapat melihat dan download */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleViewReport(laporan)}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Lihat Laporan
                  </button>
                  <button
                    onClick={() => handleDownloadReport(laporan)}
                    className="py-2 px-4 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center group"
                    title="Download Laporan"
                  >
                    <Download className="w-4 h-4 group-hover:animate-bounce" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State - jika tidak ada laporan */}
      {laporanList.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Belum Ada Laporan Tersedia
          </h3>
          <p className="text-gray-600">
            Laporan keuangan akan ditampilkan setelah dipublikasikan oleh admin
          </p>
        </div>
      )}
    </div>
  );
};
function DetailMasjid() {
  const { id } = useParams();
  const [masjidData, setMasjidData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMasjidData = async () => {
      try {
        const res = await axiosInstance.get("/masjid/" + id);
        setMasjidData(res.data.data);
        console.log("Fetched masjid data:", res.data.data);
      } catch (error) {
        console.error("Error fetching masjid data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMasjidData();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Memuat data masjid...</p>
        </div>
      </div>
    );

  if (!masjidData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-lg text-gray-600">
          Masjid tidak ditemukan
        </p>
      </div>
    );

  return (
    <>
      <MetaData title={`${masjidData.Nama} - Detail Masjid`} />
      <Navbar
        position="static"
        user={{
          name: JSON.parse(localStorage.getItem("user"))?.NamaLengkap || "User",
          role: "Donatur",
          avatar:
            "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
        }}
      />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#0C6839] via-[#0b5b33] to-[#094b2b] text-white relative overflow-hidden">
          <TopCurve />
          <div className="container mx-auto px-6 pt-8 pb-20 relative z-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white font-semibold mb-6 group hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-200"
              aria-label="Kembali ke halaman sebelumnya"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Kembali
            </button>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {masjidData.Nama}
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                {masjidData.Deskripsi}
              </p>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <LocationIcon />
                <h3 className="font-semibold text-sm text-gray-200 mt-2">
                  Alamat
                </h3>
                <p className="text-lg font-bold">{masjidData.Alamat}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <PhoneIcon />
                <h3 className="font-semibold text-sm text-gray-200 mt-2">
                  Telepon
                </h3>
                <p className="text-lg font-bold">{masjidData.NomorTelepon}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <UsersIcon />
                <h3 className="font-semibold text-sm text-gray-200 mt-2">
                  Kapasitas
                </h3>
                <p className="text-lg font-bold">
                  {masjidData.Kapasitas_Jamaah} Jamaah
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <AreaIcon />
                <h3 className="font-semibold text-sm text-gray-200 mt-2">
                  Luas Tanah
                </h3>
                <p className="text-lg font-bold">
                  {masjidData.LuasTanah.toLocaleString()} m²
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-lg mb-8">
              <div className="flex flex-wrap border-b border-gray-200">
                {[
                  "overview",
                  "facilities",
                  "gallery",
                  "expenses",
                  "laporankeuangan",
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab === "overview" && "Informasi Umum"}
                    {tab === "facilities" && "Fasilitas"}
                    {tab === "gallery" && "Galeri"}
                    {tab === "expenses" && "Laporan Donasi"}
                    {tab === "laporankeuangan" && "Laporan Keuangan"}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                          <h3 className="text-xl font-bold text-green-800 mb-4">
                            Visi Masjid
                          </h3>
                          <p className="text-green-700 leading-relaxed">
                            {masjidData.Visi}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                          <h3 className="text-xl font-bold text-blue-800 mb-4">
                            Misi Masjid
                          </h3>
                          <p className="text-blue-700 leading-relaxed">
                            {masjidData.Misi}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Detail Masjid
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <CalendarIcon />
                              <div>
                                <p className="text-sm text-gray-600">
                                  Tanggal Berdiri
                                </p>
                                <p className="font-semibold text-black">
                                  {new Date(
                                    masjidData.TanggalBerdiri
                                  ).toLocaleDateString("id-ID")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                              </svg>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Status Kepemilikan
                                </p>
                                <p className="font-semibold text-black">
                                  {masjidData.StatusKepemilikan.replace(
                                    "_",
                                    " "
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "laporankeuangan" && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Laporan Keuangan
                    </h3>
                    <div className="space-y-4">
                      <LaporanKeuangan
                        dataLaporanMasjid={masjidData.laporanMasjid}
                      />
                    </div>
                  </div>
                )}

                {/* Facilities Tab */}
                {activeTab === "facilities" && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Fasilitas Masjid
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {masjidData.fasilitasMasjid.map((facility) => (
                        <div
                          key={facility.id}
                          className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
                        >
                          <h4 className="font-bold text-lg text-gray-900 mb-3">
                            {facility.Nama}
                          </h4>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getFacilityStatusColor(
                              facility.Kondisi
                            )}`}
                          >
                            {formatFacilityStatus(facility.Kondisi)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gallery Tab */}
                {activeTab === "gallery" && (
                  <div className="space-y-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Galeri Masjid
                    </h3>
                    <div className="grid lg:grid-cols-2 gap-8">
                      <ImageCarousel
                        images={masjidData.FotoLuarMasjid}
                        title="Foto Luar Masjid"
                      />
                      <ImageCarousel
                        images={masjidData.FotoDalamMasjid}
                        title="Foto Dalam Masjid"
                      />
                    </div>
                  </div>
                )}

                {/* Expenses Tab */}
                {activeTab === "expenses" && (
                  <div>
                    <DonationExpenses
                      expenses={masjidData.pengeluaran_donasi_masjid}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Other Mosques Section */}
        <section className="bg-gradient-to-br from-[#0C6839] via-[#0b5b33] to-[#094b2b] py-16">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white drop-shadow-md">
                Masjid Lain Yang Membutuhkan
              </h2>
            </div>
            <MosqueCardSection title="" position="" />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default DetailMasjid;
