import TakmirLayout from "../../../layouts/takmir_layout";
import { Calendar, Save, Plus, Trash2, Edit, Building, Star, CheckCircle } from "lucide-react";
import { useState } from "react";

const FasilitasMasjidPage = () => {
  const [facilities, setFacilities] = useState([
    { id: 1, name: "Parkiran", rating: "", isDefault: true },
    { id: 2, name: "Mimbar Masjid", rating: "", isDefault: true },
    { id: 3, name: "Sajadah", rating: "", isDefault: true },
    { id: 4, name: "Sound System", rating: "", isDefault: true },
    { id: 5, name: "Tempat Wudhu & Toilet", rating: "", isDefault: true },
    { id: 6, name: "Ruang Ibadah", rating: "", isDefault: true }
  ]);
  
  const [newFacility, setNewFacility] = useState("");
  const [isAddingFacility, setIsAddingFacility] = useState(false);

  const ratingOptions = [
    { value: "kurang-baik", label: "Kurang Baik", color: "text-red-600 bg-red-50", stars: 1 },
    { value: "cukup-baik", label: "Cukup Baik", color: "text-orange-600 bg-orange-50", stars: 2 },
    { value: "baik", label: "Baik", color: "text-yellow-600 bg-yellow-50", stars: 3 },
    { value: "baik-sekali", label: "Baik Sekali", color: "text-blue-600 bg-blue-50", stars: 4 },
    { value: "sangat-baik", label: "Sangat Baik", color: "text-green-600 bg-green-50", stars: 5 }
  ];

  const handleRatingChange = (facilityId, rating) => {
    setFacilities(prev => 
      prev.map(facility => 
        facility.id === facilityId 
          ? { ...facility, rating } 
          : facility
      )
    );
  };

  const addNewFacility = () => {
    if (newFacility.trim()) {
      const newId = Math.max(...facilities.map(f => f.id)) + 1;
      setFacilities(prev => [
        ...prev,
        { id: newId, name: newFacility.trim(), rating: "", isDefault: false }
      ]);
      setNewFacility("");
      setIsAddingFacility(false);
    }
  };

  const removeFacility = (facilityId) => {
    setFacilities(prev => prev.filter(facility => facility.id !== facilityId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Facilities data:", facilities);
    // Handle form submission here
  };

  const getRatingDisplay = (ratingValue) => {
    const rating = ratingOptions.find(r => r.value === ratingValue);
    return rating || null;
  };

  const getCompletionStats = () => {
    const completed = facilities.filter(f => f.rating).length;
    const total = facilities.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const stats = getCompletionStats();

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
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Fasilitas Masjid
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
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Progress Penilaian</p>
                      <p className="text-lg font-bold text-gray-900">
                        {stats.completed}/{stats.total} ({stats.percentage}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Kelengkapan Penilaian</h3>
              <span className="text-sm font-medium text-teal-600">{stats.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-teal-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Facilities List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Penilaian Fasilitas</h2>
              <p className="text-gray-600">Berikan penilaian untuk setiap fasilitas masjid</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {facilities.map((facility) => {
                  const currentRating = getRatingDisplay(facility.rating);
                  return (
                    <div
                      key={facility.id}
                      className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-teal-50 rounded-lg">
                            <Building className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{facility.name}</h3>
                            {currentRating && (
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < currentRating.stars
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentRating.color}`}>
                                  {currentRating.label}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex flex-wrap gap-2">
                            {ratingOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => handleRatingChange(facility.id, option.value)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                  facility.rating === option.value
                                    ? `${option.color} ring-2 ring-offset-1`
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>

                          {!facility.isDefault && (
                            <button
                              type="button"
                              onClick={() => removeFacility(facility.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Facility */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tambah Fasilitas Baru</h3>
                
                {isAddingFacility ? (
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={newFacility}
                        onChange={(e) => setNewFacility(e.target.value)}
                        placeholder="Nama fasilitas baru..."
                        className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={addNewFacility}
                          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300"
                        >
                          Tambah
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingFacility(false);
                            setNewFacility("");
                          }}
                          className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingFacility(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-dashed border-gray-300 text-gray-600 font-semibold rounded-xl hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                    Tambah Fasilitas
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Simpan Penilaian
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </TakmirLayout>
  );
};

export default FasilitasMasjidPage;