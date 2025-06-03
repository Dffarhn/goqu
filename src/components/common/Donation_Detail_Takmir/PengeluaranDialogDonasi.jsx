import React, { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";
import toast from "react-hot-toast";
import formatCurrency from "../../../utils/formatCurrency";

// Komponen Dialog Pengeluaran (ExpenseDialog.jsx)
const ExpenseDialog = ({
  isOpen,
  onClose,
  onSave,
  id_donasi_masjid,
  kategori_donasi_id,
  masjid_id,
}) => {
  const [formData, setFormData] = useState({
    gambar: null,
    tujuan: "",
    kategori: "",
    deskripsi: "",
    jumlah: "",
  });

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          "/kategori-pengeluaran-donasi"
        );
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCurrencyInput = (name, value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^\d]/g, "");
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        gambar: file,
      }));

      // Create image preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const { tujuan, kategori, deskripsi, jumlah, gambar } = formData;

    if (tujuan && kategori && deskripsi && jumlah) {
      const data = new FormData();
      data.append("TujuanPengeluaran", tujuan);
      data.append("DeskripsiPengeluaran", deskripsi);
      data.append("UangPengeluaran", parseFloat(jumlah).toFixed(2));
      data.append("id_kategori_pengeluaran", kategori);
      data.append("FotoBuktiPengeluaran", gambar);

      // Required extra fields
      data.append("id_donasi_masjid", id_donasi_masjid);
      data.append("kategori_DonasiId", kategori_donasi_id);
      data.append("masjidId", masjid_id);

      console.log("Submitting data:", {
        id_donasi_masjid,
        kategori_donasi_id,
        masjid_id,
        ...formData,
      });

      try {
        const response = await axiosInstance.post("/pengeluaran-donasi", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Response:", response.data);
        const { statusCode, message } = response.data;

        if (statusCode != 201) {
          console.error("Failed to submit data:", statusCode, message);
          toast.error(
            `Gagal menyimpan data: ${message || "Terjadi kesalahan."}`
          );
          return;
        }

        toast.success("Pengeluaran berhasil disimpan!");

        onSave?.();
        onClose?.();

        setFormData({
          gambar: null,
          tujuan: "",
          kategori: "",
          deskripsi: "",
          jumlah: "",
        });
        setImagePreview(null);
      } catch (error) {
        const errMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Terjadi kesalahan saat mengirim data.";
        console.error("Submit error:", error);
        toast.error(`Gagal mengirim data: ${errMsg}`);
      }
    } else {
      toast.error("Mohon lengkapi semua field.");
    }
  };

  const handleClose = () => {
    setFormData({
      gambar: null,
      tujuan: "",
      kategori: "",
      deskripsi: "",
      jumlah: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Tambah Pengeluaran
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Upload Gambar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Gambar
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {imagePreview ? (
                  <div className="space-y-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg mx-auto"
                    />
                    <p className="text-sm text-gray-600">
                      {formData.gambar?.name}
                    </p>
                    <p className="text-xs text-blue-500">
                      Klik untuk mengganti gambar
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Klik untuk upload gambar
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Tujuan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tujuan
            </label>
            <input
              type="text"
              name="tujuan"
              value={formData.tujuan}
              onChange={handleInputChange}
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Masukkan tujuan pengeluaran"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleInputChange}
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Pilih kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.Nama || category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              rows={3}
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Masukkan deskripsi pengeluaran"
            />
          </div>

          {/* Uang yang akan dikeluarkan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Uang yang akan dikeluarkan
            </label>
            <input
              type="text"
              name="jumlah"
              value={
                formData.jumlah ? formatCurrency(parseInt(formData.jumlah)) : ""
              }
              onChange={(e) =>
                handleCurrencyInput("jumlah", e.target.value)
              }
              className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Masukkan jumlah uang"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};
export default ExpenseDialog;
