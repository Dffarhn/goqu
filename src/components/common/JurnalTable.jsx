import React, { useState } from "react";
import { Search, Filter, Edit2, Trash2, Calendar } from "lucide-react";
import formatCurrency from "../../utils/formatCurrency";

const JurnalTable = ({
  jurnalList,
  coaList,
  onEdit,
  onDelete,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAkun, setFilterAkun] = useState("ALL");
  const [filterTipe, setFilterTipe] = useState("ALL");
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");

  // Flatten transactions to entries - setiap entry menjadi baris terpisah
  const allEntries = jurnalList.flatMap((transaction) => {
    if (!transaction.entries || transaction.entries.length === 0) return [];
    return transaction.entries.map((entry) => ({
      ...entry,
      transactionId: transaction.id,
      transactionTanggal: transaction.tanggal,
      transactionKeterangan: transaction.keterangan,
      transactionReferensi: transaction.referensi,
    }));
  });

  // Filter entries
  const filteredEntries = allEntries.filter((entry) => {
    const matchSearch =
      (entry.transactionKeterangan || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.keterangan || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.akun?.namaAkun || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.akun?.kodeAkun || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchAkun = filterAkun === "ALL" || entry.akunId === filterAkun;
    const matchTipe = filterTipe === "ALL" || entry.tipe === filterTipe;

    const matchTanggal =
      (!tanggalAwal || new Date(entry.transactionTanggal) >= new Date(tanggalAwal)) &&
      (!tanggalAkhir || new Date(entry.transactionTanggal) <= new Date(tanggalAkhir));

    return matchSearch && matchAkun && matchTipe && matchTanggal;
  });

  // Sort entries by date (newest first), then by transaction ID
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    const dateA = new Date(a.transactionTanggal);
    const dateB = new Date(b.transactionTanggal);
    if (dateB.getTime() !== dateA.getTime()) {
      return dateB.getTime() - dateA.getTime();
    }
    return b.transactionId.localeCompare(a.transactionId);
  });

  const getTipeColor = (tipe) => {
    return tipe === "DEBIT"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  const handleFilterChange = () => {
    if (onFilterChange) {
      onFilterChange({
        akunId: filterAkun,
        tipe: filterTipe,
        tanggalAwal,
        tanggalAkhir,
      });
    }
  };

  React.useEffect(() => {
    handleFilterChange();
  }, [filterAkun, filterTipe, tanggalAwal, tanggalAkhir]);

  const activeCOA = coaList.filter((coa) => coa.isActive);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header dengan Search dan Filter */}
      <div className="p-4 border-b border-gray-200 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari keterangan, kode akun, atau nama akun..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Filter Akun */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterAkun}
              onChange={(e) => setFilterAkun(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white text-sm text-gray-900"
            >
              <option value="ALL">Semua Akun</option>
              {activeCOA.map((coa) => (
                <option key={coa.id} value={coa.id}>
                  {coa.kodeAkun} - {coa.namaAkun}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Tipe */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterTipe}
              onChange={(e) => setFilterTipe(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white text-sm text-gray-900"
            >
              <option value="ALL">Semua Tipe</option>
              <option value="DEBIT">Debit</option>
              <option value="KREDIT">Kredit</option>
            </select>
          </div>

          {/* Filter Tanggal Awal */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={tanggalAwal}
              onChange={(e) => setTanggalAwal(e.target.value)}
              placeholder="Tanggal Awal"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 bg-white"
            />
          </div>

          {/* Filter Tanggal Akhir */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={tanggalAkhir}
              onChange={(e) => setTanggalAkhir(e.target.value)}
              placeholder="Tanggal Akhir"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akun
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipe
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Keterangan
              </th>
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEntries.length === 0 ? (
              <tr>
                <td
                  colSpan={onEdit || onDelete ? 6 : 5}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  Tidak ada data entry jurnal
                </td>
              </tr>
            ) : (
              sortedEntries.map((entry, idx) => {
                // Group entries by date untuk menampilkan date header
                const currentDate = new Date(entry.transactionTanggal).toISOString().split("T")[0];
                const prevDate = idx > 0 
                  ? new Date(sortedEntries[idx - 1].transactionTanggal).toISOString().split("T")[0]
                  : null;
                const showDateHeader = currentDate !== prevDate;

                return (
                  <React.Fragment key={entry.id || idx}>
                    {/* Date Header Row */}
                    {showDateHeader && (
                      <tr className="bg-blue-50 border-t-2 border-b border-blue-200">
                      <td
                          colSpan={onEdit || onDelete ? 6 : 5}
                          className="px-6 py-3"
                      >
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-blue-700" />
                            <span className="text-sm font-semibold text-blue-900">
                              {new Date(entry.transactionTanggal).toLocaleDateString("id-ID", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Entry Row */}
                    <tr className="hover:bg-gray-50 bg-white border-b border-gray-100">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(entry.transactionTanggal).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {entry.akun?.kodeAkun || "-"}
                          </span>
                          <br />
                          <span className="text-xs text-gray-500">
                            {entry.akun?.namaAkun || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipeColor(
                              entry.tipe
                            )}`}
                          >
                            {entry.tipe}
                            </span>
                          {entry.hasRestriction && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded">
                              Terbatas
                              </span>
                            )}
                          </div>
                        </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        {formatCurrency(parseFloat(entry.jumlah) || 0)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {entry.keterangan || "-"}
                      </td>
                        {(onEdit || onDelete) && (
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              {onEdit && (
                                <button
                                onClick={() => onEdit({ id: entry.transactionId })}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              )}
                              {onDelete && (
                                <button
                                onClick={() => onDelete({ id: entry.transactionId })}
                                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer dengan info jumlah */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Menampilkan {sortedEntries.length} entry
        </p>
      </div>
    </div>
  );
};

export default JurnalTable;
