import React, { useState } from "react";
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
  Plus,
  FileImage,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import TakmirLayout from "../../../layouts/takmir_layout";

const KegiatanMasjidPage = () => {
  const [activities, setActivities] = useState([
    { id: 1, name: "", file: null, fileName: "" },
    { id: 2, name: "", file: null, fileName: "" },
    { id: 3, name: "", file: null, fileName: "" },
    { id: 4, name: "", file: null, fileName: "" },
    { id: 5, name: "", file: null, fileName: "" },
  ]);

  const [saveStatus, setSaveStatus] = useState(null);

  const handleActivityChange = (id, value) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id ? { ...activity, name: value } : activity
      )
    );
  };

  const handleFileChange = (id, file) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id
          ? {
              ...activity,
              file: file,
              fileName: file ? file.name : "",
            }
          : activity
      )
    );
  };

  const removeFile = (id) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id
          ? {
              ...activity,
              file: null,
              fileName: "",
            }
          : activity
      )
    );
  };

  const addNewActivity = () => {
    const newId = Math.max(...activities.map((a) => a.id)) + 1;
    setActivities((prev) => [
      ...prev,
      {
        id: newId,
        name: "",
        file: null,
        fileName: "",
      },
    ]);
  };

  const removeActivity = (id) => {
    if (activities.length > 1) {
      setActivities((prev) => prev.filter((activity) => activity.id !== id));
    }
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaveStatus("success");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const filledActivities = activities.filter(
    (activity) => activity.name.trim() !== ""
  );
  const hasRequiredData = filledActivities.length >= 1;

  return (
    <TakmirLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30">
        <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-blue-500/5 rounded-2xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl shadow-lg">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-[1.6]">
                      Kegiatan Masjid
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

          {/* Enhanced Form Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            {/* Form Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl text-left font-bold text-gray-900 mb-2">
                    Daftar Kegiatan
                  </h2>
                  <p className="text-gray-600">
                    Tambahkan kegiatan sosial masjid beserta dokumentasinya
                  </p>
                </div>
                <button
                  onClick={addNewActivity}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Kegiatan
                </button>
              </div>

              {/* Legend
              <div className="flex flex-wrap items-center gap-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">
                    <span className="text-red-500">*</span> Wajib diisi minimal
                    1 kegiatan
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Foto bersifat opsional
                  </span>
                </div>
              </div> */}
            </div>

            {/* Activity Items */}
            <div className="space-y-6">
              {activities.map((activity, idx) => (
                <div
                  key={activity.id}
                  className="group relative bg-white rounded-2xl border-2 border-gray-100 hover:border-teal-200 transition-all duration-300 shadow-sm hover:shadow-lg p-6"
                >
                  {/* Remove button for additional activities */}
                  {activities.length > 1 && (
                    <button
                      onClick={() => removeActivity(activity.id)}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                    {/* Number Badge */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl font-bold text-lg border-2 transition-all duration-200 ${
                          activity.name.trim()
                            ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white border-transparent shadow-lg"
                            : "bg-white text-gray-400 border-gray-300"
                        }`}
                      >
                        {idx + 1}
                      </div>
                    </div>

                    {/* Activity Input */}
                    <div className="flex-1 space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Kegiatan{" "}
                        {idx === 0 && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="text"
                        value={activity.name}
                        onChange={(e) =>
                          handleActivityChange(activity.id, e.target.value)
                        }
                        placeholder="Contoh: Bakti sosial pembagian sembako"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      />
                    </div>

                    {/* File Upload Section */}
                    <div className="w-full lg:w-80 space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Dokumentasi Foto
                      </label>

                      {!activity.file ? (
                        <label className="cursor-pointer group">
                          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-teal-50 border-2 border-dashed border-gray-300 hover:border-teal-400 rounded-xl transition-all duration-200">
                            <Upload className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
                            <div className="text-sm">
                              <span className="text-gray-600 group-hover:text-teal-600 font-medium">
                                Pilih foto
                              </span>
                              <div className="text-xs text-gray-400 mt-1">
                                JPG, PNG, max 5MB
                              </div>
                            </div>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(activity.id, e.target.files[0])
                            }
                          />
                        </label>
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl">
                          <FileImage className="w-5 h-5 text-green-600" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-green-800 truncate">
                              {activity.fileName}
                            </div>
                            <div className="text-xs text-green-600">
                              File siap diunggah
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(activity.id)}
                            className="p-1 text-green-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  //   onClick={handleSubmit}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Simpan Semua Dokumen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TakmirLayout>
  );
};

export default KegiatanMasjidPage;
