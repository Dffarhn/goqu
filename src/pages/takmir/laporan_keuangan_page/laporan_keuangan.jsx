import TakmirLayout from "../../../layouts/takmir_layout";
import {
  FileText,
  Download,
  Eye,
  TrendingUp,
  Calendar,
  Building2,
} from "lucide-react";

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

const LaporanKeuanganPage = () => {
  return (
    <TakmirLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="p-6 lg:p-8 space-y-8">
          {/* Header Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-blue-500/5 rounded-2xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Laporan Keuangan
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <p className="font-medium">
                      {new Date().toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Semua
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {laporanList.map((laporan, index) => {
                const IconComponent = laporan.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2"
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
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-300">
                          {laporan.title}
                        </h3>
              
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {laporan.description}
                        </p>
                      </div>

                      {/* Meta info */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {laporan.lastUpdate}
                        </span>
                        <span className="font-medium">{laporan.size}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <button className="flex-1 py-2 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" />
                          Lihat
                        </button>
                        <button className="py-2 px-4 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </TakmirLayout>
  );
};

export default LaporanKeuanganPage;
