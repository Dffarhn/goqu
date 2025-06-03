import { useEffect, useState } from "react";
import TakmirLayout from "../../../layouts/takmir_layout";
import {
  ArrowLeft,
  Upload,
  DollarSign,
  FileText,
  Tag,
  Target,
  Wallet,
  Calendar,
} from "lucide-react";
import formatCurrency from "../../../utils/formatCurrency";
import axiosInstance from "../../../api/axiosInstance";
import toast from "react-hot-toast";

const AddDonationTakmirPage = () => {
  const [formData, setFormData] = useState({
    namaDonasi: "",
    deskripsiDonasi: "",
    kategoriDonasi: "",
    targetUangDonasi: "",
    uangTerkumpul: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file); // Store the actual file
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    // Navigate back to donation list page
    window.history.back();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCurrencyInput = (name, value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^\d]/g, "");
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {

      console.log("Submitting form data:", formData.uangTerkumpul);
      // Basic Validation
      if (!formData.namaDonasi.trim())
        return toast.error("Nama donasi harus diisi");
      if (!formData.deskripsiDonasi.trim())
        return toast.error("Deskripsi donasi harus diisi");
      if (!formData.kategoriDonasi)
        return toast.error("Kategori donasi harus dipilih");
      if (!formData.targetUangDonasi)
        return toast.error("Target uang donasi harus diisi");

      if (!formData.uangTerkumpul) {
        formData.uangTerkumpul = "0"; // Set default to 0 if not provided
      }
      if (!imagePreview) return toast.error("Thumbnail donasi harus dipilih");

      // Prepare FormData
      const data = new FormData();
      data.append("Nama", formData.namaDonasi);
      data.append("Deskripsi", formData.deskripsiDonasi);
      data.append(
        "TargetUangDonasi",
        parseFloat(formData.targetUangDonasi).toFixed(2)
      );
      data.append(
        "UangDonasiTerkumpul",
        parseFloat(formData.uangTerkumpul).toFixed(2)
      );

      data.append("id_kategori_donasi", formData.kategoriDonasi);
      data.append("FotoThumbnailDonasi", imageFile); // this must be a File object

      for (const [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }

      // Send to backend
      const response = await axiosInstance.post(`/donasi-masjid`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.statusCode != 201)
        throw new Error("Gagal mengirim data");

      toast.success("Donasi berhasil ditambahkan!");
      handleBack();
    } catch (error) {
      console.error("Error creating donation:", error);
      toast.error("Gagal menambahkan donasi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get(`/kategori-donasi`);
        console.log("Fetched categories:", res.data);
        // Asumsikan response-nya bentuk array string
        setCategories(res.data.data);
      } catch (err) {
        console.error("Gagal fetch kategori:", err);
        setCategories([]); // fallback
      }
    };

    fetchCategories();
  }, []);

  return (
    <TakmirLayout>
      <div className="p-6 space-y-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Kembali</span>
        </button>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tambah Donasi Baru
            </h1>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white text-black rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Foto Donasi
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
                  isDragging
                    ? "border-blue-400 bg-blue-50"
                    : imagePreview
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg shadow-md lg:w-48 lg:h-48 lg:object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Drag & drop gambar atau klik untuk memilih
                    </p>
                    <p className="text-sm text-gray-400">
                      PNG, JPG hingga 10MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Nama Donasi */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                Nama Donasi
              </label>
              <input
                type="text"
                name="namaDonasi"
                value={formData.namaDonasi}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Masukkan nama donasi..."
                required
              />
            </div>

            {/* Deskripsi Donasi */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                Deskripsi Donasi
              </label>
              <textarea
                name="deskripsiDonasi"
                value={formData.deskripsiDonasi}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                placeholder="Jelaskan tujuan dan detail donasi..."
                required
              />
            </div>

            {/* Kategori Donasi */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Tag className="w-4 h-4" />
                Kategori Donasi
              </label>
              <select
                name="kategoriDonasi"
                value={formData.kategoriDonasi}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                required
              >
                <option value="">Pilih kategori donasi</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.Nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Uang Donasi */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Target className="w-4 h-4" />
                Target Uang Donasi
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="targetUangDonasi"
                  value={
                    formData.targetUangDonasi
                      ? formatCurrency(parseInt(formData.targetUangDonasi))
                      : ""
                  }
                  onChange={(e) =>
                    handleCurrencyInput("targetUangDonasi", e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="Rp 0"
                  required
                />
              </div>
            </div>

            {/* Uang Yang Telah Terkumpul */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Wallet className="w-4 h-4" />
                Uang Yang Telah Terkumpul
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="uangTerkumpul"
                  value={
                    formData.uangTerkumpul
                      ? formatCurrency(parseInt(formData.uangTerkumpul))
                      : ""
                  }
                  onChange={(e) =>
                    handleCurrencyInput("uangTerkumpul", e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="Rp 0"
                />
              </div>
              <p className="text-sm text-gray-500">
                Kosongkan jika belum ada donasi masuk
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 shadow-lg ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-200"
                } text-white`}
              >
                {isSubmitting ? "Menyimpan..." : "Buat Donasi"}
              </button>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3 ">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">
                Tips untuk donasi yang efektif:
              </p>
              <ul className="space-y-1 text-blue-700">
                <li>• Gunakan foto yang jelas dan menarik</li>
                <li>• Tulis deskripsi yang detail dan transparan</li>
                <li>• Set target yang realistis dan terukur</li>
                <li>• Update progress secara berkala</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </TakmirLayout>
  );
};

export default AddDonationTakmirPage;
