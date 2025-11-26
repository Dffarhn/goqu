import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TakmirLayout from "../../../layouts/takmir_layout";
import { getAllAccounts } from "../../../services/coaService";
import {
  getJurnalById,
  createJurnal,
  updateJurnal,
} from "../../../services/jurnalService";
import { transformAccounts, transformJurnal, transformJurnalForBackend } from "../../../utils/dataTransform";
import { getNormalBalance, isNormalBalance, getNormalBalanceLabel } from "../../../utils/accountUtils";
import formatCurrency from "../../../utils/formatCurrency";
import toast from "react-hot-toast";
import SearchableSelect from "../../../components/common/SearchableSelect";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const JurnalFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const draftKey = `jurnal_draft_${isEditMode ? "edit" : "create"}_${id || "new"}`;
  
  const [coaList, setCoaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [entries, setEntries] = useState([
    {
      id: Date.now(),
      akunId: "",
      tipe: "DEBIT",
      jumlah: "",
      hasRestriction: false,
      keterangan: "",
    },
  ]);
  const [errors, setErrors] = useState({});
  const autoSaveTimeoutRef = useRef(null);

  // Load data
  useEffect(() => {
    loadData();
  }, [id]);

  // Auto-save draft
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      saveDraft();
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [entries, tanggal]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load COA
      const accounts = await getAllAccounts({ includeInactive: false });
      const transformedAccounts = transformAccounts(accounts);
      const detailAccounts = transformedAccounts.filter(
        (acc) => !acc.isGroup && acc.isActive
      );
      setCoaList(detailAccounts);

      // Load draft or existing jurnal transaction
      if (isEditMode) {
        const transaction = await getJurnalById(id);
        const transformedTransaction = transformJurnal(transaction);
        setTanggal(transformedTransaction.tanggal.split("T")[0]);
        setEntries(
          transformedTransaction.entries.map((entry) => ({
            id: entry.id || Date.now() + Math.random(),
            akunId: entry.akunId,
            tipe: entry.tipe,
            jumlah: entry.jumlah.toString(),
            hasRestriction: entry.hasRestriction || false,
            keterangan: entry.keterangan || "",
          }))
        );
        // Clear draft for edit mode
        localStorage.removeItem(draftKey);
      } else {
        // Load draft if exists
        const draft = localStorage.getItem(draftKey);
        if (draft) {
          try {
            const draftData = JSON.parse(draft);
            if (draftData.tanggal) setTanggal(draftData.tanggal);
            if (draftData.entries && draftData.entries.length > 0) {
              setEntries(draftData.entries);
              toast.success("Draft tersimpan dimuat", { icon: "💾" });
            }
          } catch (e) {
            console.error("Error loading draft:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error(error.response?.data?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = () => {
    try {
      const draftData = {
        tanggal,
        entries: entries,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(draftKey, JSON.stringify(draftData));
    } catch (e) {
      console.error("Error saving draft:", e);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(draftKey);
    toast.success("Draft dihapus");
  };

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        id: Date.now() + Math.random(),
        akunId: "",
        tipe: "DEBIT",
        jumlah: "",
        hasRestriction: false,
        keterangan: "",
      },
    ]);
  };

  const removeEntry = (entryId) => {
    if (entries.length <= 1) {
      toast.error("Minimal harus ada 1 entry");
      return;
    }
    setEntries(entries.filter((entry) => entry.id !== entryId));
  };

  const updateEntry = (entryId, field, value) => {
    setEntries(
      entries.map((entry) => {
        if (entry.id === entryId) {
          const updatedEntry = { ...entry, [field]: value };
          
          // Auto-set tipe berdasarkan normal balance saat akun dipilih
          if (field === "akunId" && value) {
            const selectedAkun = coaList.find((coa) => coa.id === value);
            if (selectedAkun) {
              // Gunakan normalBalance langsung dari account jika ada, baru fallback ke getNormalBalance
              const normalBalance = getNormalBalance(selectedAkun);
              updatedEntry.tipe = normalBalance;
            }
          }
          
          return updatedEntry;
        }
        return entry;
      })
    );
    // Clear error for this field
    if (errors[entryId]) {
      setErrors({
        ...errors,
        [entryId]: {
          ...errors[entryId],
          [field]: undefined,
        },
      });
    }
  };

  const validateEntries = () => {
    const newErrors = {};
    let isValid = true;

    // Validate transaction level fields
    if (!tanggal) {
      newErrors.tanggal = "Tanggal harus diisi";
      isValid = false;
    }

    // Validate entries - minimal 1 entry, tidak perlu harus DEBIT dan KREDIT
    if (entries.length < 1) {
      newErrors.entries = "Minimal harus ada 1 entry";
      isValid = false;
    }

    entries.forEach((entry) => {
      const entryErrors = {};

      if (!entry.akunId) {
        entryErrors.akunId = "Akun harus dipilih";
        isValid = false;
      } else {
        const selectedAkun = coaList.find((coa) => coa.id === entry.akunId);
        if (selectedAkun && !selectedAkun.isActive) {
          entryErrors.akunId = "Akun yang dipilih tidak aktif";
          isValid = false;
        }
      }

      if (!entry.jumlah || parseFloat(entry.jumlah) <= 0) {
        entryErrors.jumlah = "Jumlah harus lebih dari 0";
        isValid = false;
      }

      if (Object.keys(entryErrors).length > 0) {
        newErrors[entry.id] = entryErrors;
      }
    });

    // Tidak perlu validasi balance - tidak balance itu tidak apa-apa
    // Tidak perlu validasi harus ada DEBIT dan KREDIT - bisa nyicil bertahap

    setErrors(newErrors);
    return isValid;
  };

  const handlePreview = () => {
    if (validateEntries()) {
      setShowPreview(true);
    } else {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
    }
  };

  const handleSave = async () => {
    // Validasi hanya field wajib
    if (!validateEntries()) {
      setShowPreview(false);
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    try {
      setSaving(true);

      const transactionData = {
        tanggal,
        keterangan: "", // Keterangan sekarang di level entry
        entries: entries.map((entry) => ({
          akunId: entry.akunId,
          tipe: entry.tipe,
          jumlah: parseFloat(entry.jumlah),
          hasRestriction: entry.hasRestriction || false,
          keterangan: entry.keterangan || "",
        })),
      };

      const backendData = transformJurnalForBackend(transactionData);

      if (isEditMode) {
        await updateJurnal(id, backendData);
        toast.success("Transaksi jurnal berhasil diupdate");
      } else {
        await createJurnal(backendData);
        toast.success("Transaksi jurnal berhasil ditambahkan");
      }

      // Clear draft
      localStorage.removeItem(draftKey);

      // Navigate back
      navigate("/admin/jurnal");
    } catch (error) {
      console.error("Error saving jurnal transaction:", error);
      toast.error(error.response?.data?.message || "Gagal menyimpan transaksi jurnal");
    } finally {
      setSaving(false);
      setShowPreview(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/jurnal");
  };

  // Calculate totals
  const totals = entries.reduce(
    (acc, entry) => {
      const jumlah = parseFloat(entry.jumlah) || 0;
      if (entry.tipe === "DEBIT") {
        acc.debit += jumlah;
      } else {
        acc.kredit += jumlah;
      }
      return acc;
    },
    { debit: 0, kredit: 0 }
  );

  const isBalanced = Math.abs(totals.debit - totals.kredit) < 0.01;

  const activeCOA = coaList.filter((coa) => coa.isActive);

  if (loading) {
    return (
      <TakmirLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Memuat data...</span>
        </div>
      </TakmirLayout>
    );
  }

  return (
    <TakmirLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {isEditMode ? "Edit Jurnal" : "Tambah Jurnal"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditMode
                  ? "Edit transaksi jurnal akuntansi"
                  : "Catat transaksi keuangan dalam jurnal akuntansi"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditMode && (
              <button
                onClick={clearDraft}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Hapus Draft
              </button>
            )}
            <button
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>

        {/* Transaction Level Fields */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Transaksi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tanggal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white ${
                  errors.tanggal ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.tanggal && (
                <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>
              )}
            </div>
          </div>
        </div>

        {/* Form Entries */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Entries Jurnal</h3>
          </div>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Entry #{index + 1}
                </h3>
                {entries.length > 1 && (
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                    title="Hapus Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Akun */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Akun <span className="text-red-500">*</span>
                  </label>
                  <SearchableSelect
                    options={activeCOA}
                    value={entry.akunId}
                    onChange={(value) => updateEntry(entry.id, "akunId", value)}
                    placeholder="Pilih Akun"
                    searchPlaceholder="Cari akun (kode, nama, atau tipe)..."
                    getOptionLabel={(coa) =>
                      `${coa.kodeAkun} - ${coa.namaAkun} (${coa.tipeAkun})`
                    }
                    getOptionValue={(coa) => coa.id}
                    error={!!errors[entry.id]?.akunId}
                  />
                  {errors[entry.id]?.akunId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[entry.id].akunId}
                    </p>
                  )}
                </div>

                {/* Tipe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe <span className="text-red-500">*</span>
                    {entry.akunId && (() => {
                      const selectedAkun = coaList.find((coa) => coa.id === entry.akunId);
                      if (selectedAkun) {
                        const normalBalance = getNormalBalance(selectedAkun);
                        const isNormal = isNormalBalance(selectedAkun, entry.tipe);
                        return (
                          <span className={`ml-2 text-xs font-normal ${isNormal ? "text-green-600" : "text-orange-600"}`}>
                            ({getNormalBalanceLabel(selectedAkun)})
                            {!isNormal && " ⚠️"}
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </label>
                  <div className="flex gap-3">
                    <label
                      className={`flex-1 cursor-pointer relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                        entry.tipe === "DEBIT"
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        value="DEBIT"
                        checked={entry.tipe === "DEBIT"}
                        onChange={(e) =>
                          updateEntry(entry.id, "tipe", e.target.value)
                        }
                        className="sr-only"
                      />
                      <div className="p-4 flex items-center justify-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            entry.tipe === "DEBIT"
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-400 bg-white"
                          }`}
                        >
                          {entry.tipe === "DEBIT" && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span
                          className={`font-semibold transition-colors ${
                            entry.tipe === "DEBIT"
                              ? "text-blue-700"
                              : "text-gray-600"
                          }`}
                        >
                          Debit
                        </span>
                      </div>
                      {entry.tipe === "DEBIT" && (
                        <>
                          <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-blue-500"></div>
                          <div className="absolute top-1 right-1 text-white text-xs">
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                        </>
                      )}
                    </label>
                    <label
                      className={`flex-1 cursor-pointer relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                        entry.tipe === "KREDIT"
                          ? "border-green-500 bg-green-50 shadow-md"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        value="KREDIT"
                        checked={entry.tipe === "KREDIT"}
                        onChange={(e) =>
                          updateEntry(entry.id, "tipe", e.target.value)
                        }
                        className="sr-only"
                      />
                      <div className="p-4 flex items-center justify-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            entry.tipe === "KREDIT"
                              ? "border-green-600 bg-green-600"
                              : "border-gray-400 bg-white"
                          }`}
                        >
                          {entry.tipe === "KREDIT" && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span
                          className={`font-semibold transition-colors ${
                            entry.tipe === "KREDIT"
                              ? "text-green-700"
                              : "text-gray-600"
                          }`}
                        >
                          Kredit
                        </span>
                      </div>
                      {entry.tipe === "KREDIT" && (
                        <>
                          <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-green-500"></div>
                          <div className="absolute top-1 right-1 text-white text-xs">
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                  {/* Warning jika tipe tidak sesuai normal balance */}
                  {entry.akunId && (() => {
                    const selectedAkun = coaList.find((coa) => coa.id === entry.akunId);
                    if (selectedAkun) {
                      const isNormal = isNormalBalance(selectedAkun, entry.tipe);
                      if (!isNormal) {
                        return (
                          <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div>
                                <strong>Peringatan:</strong> Tipe ini tidak sesuai dengan normal balance akun ({getNormalBalanceLabel(selectedAkun)}). 
                                Pastikan ini adalah transaksi yang benar (misalnya pengurangan aset atau reversal).
                              </div>
                            </div>
                          </div>
                        );
                      }
                    }
                    return null;
                  })()}
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
                      value={entry.jumlah}
                      onChange={(e) =>
                        updateEntry(entry.id, "jumlah", e.target.value)
                      }
                      placeholder="0"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white ${
                        errors[entry.id]?.jumlah
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {entry.jumlah && !errors[entry.id]?.jumlah && (
                    <p className="mt-1 text-sm text-gray-500">
                      {formatCurrency(parseFloat(entry.jumlah) || 0)}
                    </p>
                  )}
                  {errors[entry.id]?.jumlah && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[entry.id].jumlah}
                    </p>
                  )}
                </div>

                {/* Keterangan */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keterangan
                  </label>
                  <textarea
                    value={entry.keterangan || ""}
                    onChange={(e) =>
                      updateEntry(entry.id, "keterangan", e.target.value)
                    }
                    rows={2}
                    placeholder="Masukkan keterangan untuk entry ini..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>

                {/* Pembatasan */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={entry.hasRestriction}
                      onChange={(e) =>
                        updateEntry(entry.id, "hasRestriction", e.target.checked)
                      }
                      className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">
                        Dengan Pembatasan dari Pemberi Sumber Daya
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Centang jika dana ini memiliki pembatasan penggunaan (contoh: shodaqoh untuk pembangunan WC)
                      </p>
                    </div>
                    {entry.hasRestriction && (
                      <span className="px-2 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded">
                        Terbatas
                      </span>
                    )}
                  </label>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Add Entry Button */}
        {!isEditMode && (
          <button
            onClick={addEntry}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Entry
          </button>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleBack}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan
              </>
            )}
          </button>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Preview Jurnal</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EyeOff className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">Total Debit</div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(totals.debit)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Kredit</div>
                    <div className="text-xl font-bold text-green-600">
                      {formatCurrency(totals.kredit)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Selisih</div>
                    <div
                      className={`text-xl font-bold ${
                        isBalanced ? "text-gray-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(Math.abs(totals.debit - totals.kredit))}
                    </div>
                  </div>
                </div>

                {/* Entries Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tanggal
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Akun
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tipe
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Jumlah
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Pembatasan
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Keterangan
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {entries.map((entry, index) => {
                        const account = coaList.find((coa) => coa.id === entry.akunId);
                        return (
                          <tr key={entry.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {new Date(tanggal).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div>
                                <span className="font-medium text-gray-900">
                                  {account?.kodeAkun || "-"}
                                </span>
                                <br />
                                <span className="text-xs text-gray-500">
                                  {account?.namaAkun || "-"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  entry.tipe === "DEBIT"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {entry.tipe}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                              {formatCurrency(parseFloat(entry.jumlah) || 0)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {entry.hasRestriction ? (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded">
                                  Dengan Pembatasan
                                </span>
                              ) : (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded">
                                  Tanpa Pembatasan
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {entry.keterangan || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Kembali ke Edit
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Konfirmasi & Simpan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TakmirLayout>
  );
};

export default JurnalFormPage;

