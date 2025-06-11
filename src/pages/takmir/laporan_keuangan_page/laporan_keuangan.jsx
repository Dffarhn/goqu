import TakmirLayout from "../../../layouts/takmir_layout";
import {
  FileText,
  Download,
  Upload,
  FileSpreadsheet,
  Calendar,
  Building2,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const laporanList = [
  {
    title: "Laporan Atas Posisi Keuangan",
    subtitle: "Donasi Siap Pakai",
    description:
      "Ringkasan komprehensif posisi keuangan organisasi per periode",
    icon: Building2,
    color: "from-blue-500 to-blue-600",
    templateSize: "156 KB",
    hasUpload: true,
    uploadDate: "25 Mei 2025",
    uploadStatus: "completed",
  },
  {
    title: "Laporan Penghasilan Komprehensif",
    subtitle: "Donasi Siap Pakai",
    description:
      "Analisis detail pendapatan dan beban operasional periode berjalan",
    icon: TrendingUp,
    color: "from-emerald-500 to-emerald-600",
    templateSize: "142 KB",
    hasUpload: true,
    uploadDate: "25 Mei 2025",
    uploadStatus: "completed",
  },
  {
    title: "Laporan Perubahan Aset Neto",
    subtitle: "Donasi Siap Pakai",
    description: "Tracking perubahan aset bersih dan equity organisasi",
    icon: FileText,
    color: "from-purple-500 to-purple-600",
    templateSize: "128 KB",
    hasUpload: false,
    uploadDate: null,
    uploadStatus: "pending",
  },
  {
    title: "Laporan Arus Kas",
    subtitle: "Donasi Siap Pakai",
    description:
      "Monitoring aliran kas masuk dan keluar dalam periode pelaporan",
    icon: TrendingUp,
    color: "from-orange-500 to-orange-600",
    templateSize: "134 KB",
    hasUpload: false,
    uploadDate: null,
    uploadStatus: "pending",
  },
  {
    title: "Catatan atas Laporan Keuangan",
    subtitle: "Donasi Siap Pakai",
    description: "Penjelasan detail dan metodologi laporan keuangan",
    icon: FileText,
    color: "from-indigo-500 to-indigo-600",
    templateSize: "178 KB",
    hasUpload: true,
    uploadDate: "23 Mei 2025",
    uploadStatus: "completed",
  },
];

const LaporanKeuanganPage = () => {
  const handleDownloadTemplate = (laporanTitle) => {
    // Logic untuk download template
    console.log(`Downloading template for: ${laporanTitle}`);
  };

  const handleUploadFile = (laporanTitle) => {
    // Logic untuk upload file
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log(`Uploading file for: ${laporanTitle}`, file);
        // Handle file upload logic here
      }
    };
    input.click();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Terupload';
      case 'pending':
        return 'Menunggu Upload';
      default:
        return 'Belum Upload';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

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
                  <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Semua Template
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
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-500"
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
                          {getStatusIcon(laporan.uploadStatus)}
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

                      {/* Status Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(laporan.uploadStatus)}`}>
                          {getStatusText(laporan.uploadStatus)}
                        </span>
                        {laporan.hasUpload && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {laporan.uploadDate}
                          </span>
                        )}
                      </div>

                      {/* Template Info */}
                      <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                          <span className="font-medium">Template Excel</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Ukuran: {laporan.templateSize}</span>
                          <button
                            onClick={() => handleDownloadTemplate(laporan.title)}
                            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleUploadFile(laporan.title)}
                          className={`flex-1 py-2 px-4 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                            laporan.hasUpload
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                              : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700'
                          }`}
                        >
                          <Upload className="w-4 h-4" />
                          {laporan.hasUpload ? 'Update File' : 'Upload File'}
                        </button>
                        
                        {laporan.hasUpload && (
                          <button className="py-2 px-4 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructions Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              Cara Menggunakan Template
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <p className="font-semibold text-gray-900">Download Template</p>
                  <p>Unduh template Excel yang sesuai dengan jenis laporan</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <p className="font-semibold text-gray-900">Isi Data</p>
                  <p>Lengkapi template dengan data keuangan yang akurat</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <p className="font-semibold text-gray-900">Upload File</p>
                  <p>Upload file yang sudah diisi untuk generate laporan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TakmirLayout>
  );
};

export default LaporanKeuanganPage;