import {
  Calendar,
  Save,
  MapPin,
  Phone,
  Building,
  Users,
  Target,
  Heart,
  Globe,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  FileText,
  Camera,
  Images,
  Loader2,
  Pencil,
} from "lucide-react";
import { useEffect, useState } from "react";
import TakmirLayout from "../../../layouts/takmir_layout";
import axiosInstance from "../../../api/axiosInstance";
import toast from "react-hot-toast";

const DokumenMasjidPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [masjidData, setMasjidData] = useState({});
  const [dragOver, setDragOver] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewModal, setPreviewModal] = useState({
    open: false,
    src: null,
    title: null,
  });

  // Load data dari backend saat component mount
  useEffect(() => {
    loadMasjid();
  }, []);

  const loadMasjid = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/masjid/takmir");
      console.log("Response data:", response.data);

      if (response.data.statusCode != 200) {
        throw new Error(response.data.message || "Gagal memuat data masjid");
      }

      const data = response.data.data;
      setMasjidData(data);
      console.log("Masjid data loaded:", data);
    } catch (err) {
      console.error("Error loading facilities:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (category, index, file) => {
    if (file) {
      const fileData = {
        file,
        name: file.name,
        size: file.size,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
        uploadedAt: new Date().toISOString(),
      };

      setUploadedFiles((prev) => ({
        ...prev,
        [`${category}-${index}`]: fileData,
      }));
    }
  };

  const handleDragOver = (e, category, index) => {
    e.preventDefault();
    setDragOver(`${category}-${index}`);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (e, category, index) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(category, index, file);
    }
  };

  const removeFile = (key) => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[key];
      return newFiles;
    });
  };

  const openPreview = (src, title) => {
    setPreviewModal({ open: true, src, title });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // import {
  //   Camera,
  //   Upload,
  //   X,
  //   CheckCircle,
  //   FileText,
  //   Eye,
  //   Pencil,
  // } from "lucide-react";

  const PhotoUploadCard = ({
    label,
    category,
    index,
    required = false,
    previewUrl,
  }) => {
    const key = `${category}-${index}`;
    const uploadedFile = uploadedFiles[key];
    const isDragOver = dragOver === key;

    const fileToShow =
      uploadedFile ||
      (previewUrl
        ? {
            name: label,
            size: 0,
            preview: previewUrl,
            fromServer: true,
          }
        : null);

    const handleReplaceClick = () => {
      document.getElementById(`file-input-${key}`)?.click();
    };

    return (
      <div className="relative group">
        <div
          className={`
          relative border-2 border-dashed rounded-xl p-4 transition-all duration-200
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : fileToShow
              ? "border-green-400 bg-green-50"
              : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50"
          }
        `}
          onDragOver={(e) => handleDragOver(e, category, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, category, index)}
        >
          {fileToShow ? (
            <div className="space-y-3">
              {fileToShow.preview ? (
                <div className="relative group">
                  <img
                    src={fileToShow.preview}
                    alt={label}
                    className="w-full h-32 object-cover rounded-lg cursor-pointer"
                    onClick={() => openPreview(fileToShow.preview, label)}
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  {/* 👇 Replace/Edit Button */}
                  <button
                    type="button"
                    onClick={handleReplaceClick}
                    className="absolute top-2 right-2 bg-white shadow px-2 py-1 rounded text-xs text-blue-600 hover:bg-blue-50 flex items-center gap-1"
                  >
                    <Pencil className="w-3 h-3" />
                    Ganti
                  </button>
                  <input
                    id={`file-input-${key}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(category, index, e.target.files[0])
                    }
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileToShow.name}
                </p>
                <p className="text-xs text-gray-500">
                  {fileToShow.size
                    ? formatFileSize(fileToShow.size)
                    : "Dari Server"}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs">Siap diunggah</span>
                  </div>
                  {!fileToShow.fromServer && (
                    <button
                      onClick={() => removeFile(key)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  {required && (
                    <span className="text-red-500 text-xs">*Wajib</span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">
                  Seret & lepas foto di sini
                </p>
                <p className="text-xs text-gray-400">atau</p>
              </div>

              <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                Pilih File
                <input
                  id={`file-input-${key}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleFileUpload(category, index, e.target.files[0])
                  }
                />
              </label>

              <p className="text-xs text-gray-400">PNG, JPG hingga 10MB</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const DocumentUploadCard = ({ label, required = false, category, index }) => {
    const key = `${category}-${index}`;
    const uploadedFile = uploadedFiles[key];
    const isDragOver = dragOver === key;

    return (
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-6 transition-all duration-200
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : uploadedFile
              ? "border-green-400 bg-green-50"
              : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50"
          }
        `}
        onDragOver={(e) => handleDragOver(e, category, index)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, category, index)}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h4 className="font-medium text-gray-900">{label}</h4>
              {required && (
                <span className="text-red-500 text-sm ml-1">*Wajib</span>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Format: PDF, DOC, DOCX (Maksimal 10MB)
              </p>
            </div>

            {uploadedFile ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-green-700">
                        {formatFileSize(uploadedFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(key)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-center py-4">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Seret & lepas dokumen di sini
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Pilih Dokumen
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(category, index, e.target.files[0])
                    }
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Check required files
      const requiredFiles = [
        "dokumen-0", // Surat Izin Mendirikan Masjid
        "dokumen-2", // Surat Pengantar RT/RW/Kelurahan
      ];

      const missingFiles = requiredFiles.filter((key) => !uploadedFiles[key]);

      if (missingFiles.length > 0) {
        alert("Mohon lengkapi semua dokumen yang wajib diunggah");
        return;
      }

      // Prepare FormData
      const formData = new FormData();

      // Add photo files
      const fotoLuarFiles = [];
      const fotoDalamFiles = [];

      // Collect exterior photos (FotoLuarMasjid)
      for (let i = 0; i < 4; i++) {
        const key = `exterior-${i}`;
        if (uploadedFiles[key]) {
          fotoLuarFiles.push(uploadedFiles[key].file);
        }
      }

      // Collect interior photos (FotoDalamMasjid)
      for (let i = 0; i < 4; i++) {
        const key = `interior-${i}`;
        if (uploadedFiles[key]) {
          fotoDalamFiles.push(uploadedFiles[key].file);
        }
      }

      // Append photos to FormData
      fotoLuarFiles.forEach((file, index) => {
        formData.append("FotoLuarMasjid", file);
      });

      fotoDalamFiles.forEach((file, index) => {
        formData.append("FotoDalamMasjid", file);
      });

      // Add document files
      const documentMapping = {
        "dokumen-0": "SuratIzinMasjid",
        "dokumen-1": "PenghargaanMasjid",
        "dokumen-2": "SuratPengantar",
      };

      Object.entries(documentMapping).forEach(([key, fieldName]) => {
        if (uploadedFiles[key]) {
          formData.append(fieldName, uploadedFiles[key].file);
        }
      });

      // Get auth token (adjust based on your auth implementation)
      const token = localStorage.getItem("authToken") || "your-jwt-token";

      // Send request to backend
      const response = await axiosInstance.patch("masjid", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.statusCode != 200) {
        // const errorData = await response.json();
        throw new Error(response.data.message || "Gagal mengunggah dokumen");
      }

      // const result = await response.json();

      // Show success message
      toast.success("Dokumen berhasil disimpan!");

      // Optional: Reset form or redirect
      // setUploadedFiles({});

      // console.log("Upload result:", result);
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TakmirLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
        <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-blue-500/5 rounded-2xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl shadow-lg">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Dokumen Masjid
                    </h1>
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
              </div>
            </div>
          </div>

          {/* Photo Upload Sections */}
          <div className="space-y-8">
            {/* Foto Luar Masjid */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <Images className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl text-left font-bold text-gray-900">
                    Foto Luar Masjid
                  </h2>
                  <p className="text-gray-600">
                    Unggah foto eksterior masjid dari berbagai sudut
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  "Foto Depan",
                  "Foto Belakang",
                  "Foto Samping Kanan",
                  "Foto Samping Kiri",
                ].map((label, idx) => (
                  <PhotoUploadCard
                    key={idx}
                    label={label}
                    category="exterior"
                    index={idx}
                    required={idx === 0}
                    previewUrl={masjidData?.FotoLuarMasjid?.[idx] || null} // 👈 backend image preview URL
                  />
                ))}
              </div>
            </div>

            {/* Foto Dalam Masjid */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Images className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className=" text-left text-2xl font-bold text-gray-900">
                    Foto Dalam Masjid
                  </h2>
                  <p className="text-gray-600">
                    Unggah foto interior dan fasilitas dalam masjid
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  "Tambahkan Foto",
                  "Tambahkan Foto",
                  "Tambahkan Foto",
                  "Tambahkan Foto",
                ].map((label, idx) => (
                  <PhotoUploadCard
                    key={idx}
                    label={label}
                    category="interior"
                    index={idx}
                    previewUrl={masjidData?.FotoDalamMasjid?.[idx] || null} //
                  />
                ))}
              </div>
            </div>

            {/* Dokumen Pendukung */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl text-left font-bold text-gray-900">
                    Dokumen Pendukung
                  </h2>
                  <p className="text-gray-600">
                    Unggah dokumen resmi dan surat pendukung
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { label: "Surat Izin Mendirikan Masjid", required: true },
                  { label: "Prestasi/Penghargaan Masjid", required: false },
                  { label: "Surat Pengantar RT/RW/Kelurahan", required: true },
                ].map((doc, idx) => (
                  <DocumentUploadCard
                    key={idx}
                    label={doc.label}
                    required={doc.required}
                    category="dokumen"
                    index={idx}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Simpan Semua Dokumen
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {previewModal.open && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full bg-white rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">{previewModal.title}</h3>
                <button
                  onClick={() =>
                    setPreviewModal({ open: false, src: null, title: null })
                  }
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <img
                  src={previewModal.src}
                  alt={previewModal.title}
                  className="max-w-full max-h-[70vh] object-contain mx-auto"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </TakmirLayout>
  );
};

export default DokumenMasjidPage;
