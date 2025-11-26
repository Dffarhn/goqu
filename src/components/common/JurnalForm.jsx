import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import formatCurrency from "../../utils/formatCurrency";
import SearchableSelect from "./SearchableSelect";

const JurnalForm = ({ coaList, jurnal, onSave, onCancel, mode = "create" }) => {
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    akunId: "",
    tipe: "DEBIT",
    jumlah: "",
    keterangan: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "edit" && jurnal) {
      setFormData({
        tanggal: jurnal.tanggal.split("T")[0],
        akunId: jurnal.akunId,
        tipe: jurnal.tipe,
        jumlah: jurnal.jumlah.toString(),
        keterangan: jurnal.keterangan || "",
      });
    }
  }, [mode, jurnal]);

  const validate = () => {
    const newErrors = {};

    if (!formData.tanggal) {
      newErrors.tanggal = "Tanggal harus diisi";
    }

    if (!formData.akunId) {
      newErrors.akunId = "Akun harus dipilih";
    } else {
      const selectedAkun = coaList.find((coa) => coa.id === formData.akunId);
      if (selectedAkun && !selectedAkun.isActive) {
        newErrors.akunId = "Akun yang dipilih tidak aktif";
      }
    }

    if (!formData.jumlah || parseFloat(formData.jumlah) <= 0) {
      newErrors.jumlah = "Jumlah harus lebih dari 0";
    }

    if (!formData.keterangan || formData.keterangan.trim() === "") {
      newErrors.keterangan = "Keterangan harus diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        jumlah: parseFloat(formData.jumlah),
      });
    }
  };

  const activeCOA = coaList.filter((coa) => coa.isActive);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === "edit" ? "Edit Jurnal" : "Tambah Jurnal"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tanggal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.tanggal}
              onChange={(e) =>
                setFormData({ ...formData, tanggal: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white ${
                errors.tanggal ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.tanggal && (
              <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>
            )}
          </div>

          {/* Akun */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Akun <span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              options={activeCOA}
              value={formData.akunId}
              onChange={(value) =>
                setFormData({ ...formData, akunId: value })
              }
              placeholder="Pilih Akun"
              searchPlaceholder="Cari akun (kode, nama, atau tipe)..."
              getOptionLabel={(coa) =>
                `${coa.kodeAkun} - ${coa.namaAkun} (${coa.tipeAkun})`
              }
              getOptionValue={(coa) => coa.id}
              error={!!errors.akunId}
            />
            {errors.akunId && (
              <p className="mt-1 text-sm text-red-600">{errors.akunId}</p>
            )}
          </div>

          {/* Tipe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipe <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="DEBIT"
                  checked={formData.tipe === "DEBIT"}
                  onChange={(e) =>
                    setFormData({ ...formData, tipe: e.target.value })
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Debit</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="KREDIT"
                  checked={formData.tipe === "KREDIT"}
                  onChange={(e) =>
                    setFormData({ ...formData, tipe: e.target.value })
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Kredit</span>
              </label>
            </div>
          </div>

          {/* Jumlah */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                Rp
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.jumlah}
                onChange={(e) =>
                  setFormData({ ...formData, jumlah: e.target.value })
                }
                placeholder="0"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white ${
                  errors.jumlah ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {formData.jumlah && !errors.jumlah && (
              <p className="mt-1 text-sm text-gray-500">
                {formatCurrency(parseFloat(formData.jumlah) || 0)}
              </p>
            )}
            {errors.jumlah && (
              <p className="mt-1 text-sm text-red-600">{errors.jumlah}</p>
            )}
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keterangan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.keterangan}
              onChange={(e) =>
                setFormData({ ...formData, keterangan: e.target.value })
              }
              rows={3}
              placeholder="Masukkan keterangan transaksi..."
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white ${
                errors.keterangan ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.keterangan && (
              <p className="mt-1 text-sm text-red-600">{errors.keterangan}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JurnalForm;

