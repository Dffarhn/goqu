import React, { useState, useMemo } from "react";
import { Search, Filter, Edit2, Trash2, Plus, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

const COATable = ({
  coaList,
  onEdit,
  onDelete,
  onCreate,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipe, setFilterTipe] = useState("ALL");
  const [sortColumn, setSortColumn] = useState("kodeAkun");
  const [sortDirection, setSortDirection] = useState("asc");

  // Helper function untuk sorting kode akun hierarchical
  const compareKodeAkun = (a, b) => {
    const aParts = a.split(".").map(Number);
    const bParts = b.split(".").map(Number);
    const maxLength = Math.max(aParts.length, bParts.length);
    
    for (let i = 0; i < maxLength; i++) {
      const aPart = aParts[i] || 0;
      const bPart = bParts[i] || 0;
      if (aPart !== bPart) {
        return aPart - bPart;
      }
    }
    return 0;
  };

  const filteredCOA = useMemo(() => {
    let filtered = coaList.filter((coa) => {
      const matchSearch =
        coa.kodeAkun.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coa.namaAkun.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coa.kategori.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTipe = filterTipe === "ALL" || coa.tipeAkun === filterTipe;

      return matchSearch && matchTipe;
    });

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortColumn) {
        case "kodeAkun":
          comparison = compareKodeAkun(a.kodeAkun, b.kodeAkun);
          break;
        case "namaAkun":
          comparison = a.namaAkun.localeCompare(b.namaAkun, "id");
          break;
        case "tipeAkun":
          comparison = a.tipeAkun.localeCompare(b.tipeAkun, "id");
          break;
        case "kategori":
          comparison = a.kategori.localeCompare(b.kategori, "id");
          break;
        case "isActive":
          comparison = a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [coaList, searchTerm, filterTipe, sortColumn, sortDirection]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-green-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-green-600" />
    );
  };

  const getTipeColor = (tipe) => {
    const colors = {
      ASET: "bg-blue-100 text-blue-800",
      KEWAJIBAN: "bg-red-100 text-red-800",
      EKUITAS: "bg-green-100 text-green-800",
      PENDAPATAN: "bg-emerald-100 text-emerald-800",
      BEBAN: "bg-orange-100 text-orange-800",
    };
    return colors[tipe] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header dengan Search dan Filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari kode akun, nama, atau kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterTipe}
                onChange={(e) => {
                  setFilterTipe(e.target.value);
                  if (onFilterChange) onFilterChange(e.target.value);
                }}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white text-gray-900"
              >
                <option value="ALL">Semua Tipe</option>
                <option value="ASET">Aset</option>
                <option value="KEWAJIBAN">Kewajiban</option>
                <option value="EKUITAS">Ekuitas</option>
                <option value="PENDAPATAN">Pendapatan</option>
                <option value="BEBAN">Beban</option>
              </select>
            </div>
            {onCreate && (
              <button
                onClick={onCreate}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah Akun</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("kodeAkun")}
              >
                <div className="flex items-center gap-2">
                  <span>Kode Akun</span>
                  {getSortIcon("kodeAkun")}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("namaAkun")}
              >
                <div className="flex items-center gap-2">
                  <span>Nama Akun</span>
                  {getSortIcon("namaAkun")}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("tipeAkun")}
              >
                <div className="flex items-center gap-2">
                  <span>Tipe</span>
                  {getSortIcon("tipeAkun")}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("kategori")}
              >
                <div className="flex items-center gap-2">
                  <span>Kategori</span>
                  {getSortIcon("kategori")}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("isActive")}
              >
                <div className="flex items-center gap-2">
                  <span>Status</span>
                  {getSortIcon("isActive")}
                </div>
              </th>
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCOA.length === 0 ? (
              <tr>
                <td
                  colSpan={onEdit || onDelete ? 6 : 5}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  Tidak ada data akun
                </td>
              </tr>
            ) : (
              filteredCOA.map((coa, index) => (
                <tr 
                  key={coa.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm font-mono font-medium text-gray-900">
                      {coa.kodeAkun}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900 font-medium">{coa.namaAkun}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getTipeColor(
                        coa.tipeAkun
                      )}`}
                    >
                      {coa.tipeAkun}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">
                      {coa.kategori}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                        coa.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {coa.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(coa)}
                            className="text-blue-600 hover:text-blue-900 p-1.5 rounded hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(coa)}
                            className="text-red-600 hover:text-red-900 p-1.5 rounded hover:bg-red-50 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer dengan info jumlah */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Menampilkan {filteredCOA.length} dari {coaList.length} akun
        </p>
      </div>
    </div>
  );
};

export default COATable;

