import React, { useEffect, useState } from "react";
import TakmirLayout from "../../../layouts/takmir_layout";
import { getAllAccounts } from "../../../services/coaService";
import { getAllJurnals } from "../../../services/jurnalService";
import { transformAccounts, transformJurnals } from "../../../utils/dataTransform";
import formatCurrency from "../../../utils/formatCurrency";
import { hitungSaldoAkun } from "../../../utils/jurnalUtils";
import { Calendar, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const BukuBesarPage = () => {
  const [coaList, setCoaList] = useState([]);
  const [jurnalList, setJurnalList] = useState([]);
  const [tanggalAwal, setTanggalAwal] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0]
  );
  const [tanggalAkhir, setTanggalAkhir] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [accounts, jurnals] = await Promise.all([
          getAllAccounts({ includeInactive: false }),
          getAllJurnals({}),
        ]);

        const transformedAccounts = transformAccounts(accounts).filter(
          (acc) => !acc.isGroup && acc.isActive
        );
        const transformedJurnals = transformJurnals(jurnals);

        setCoaList(transformedAccounts);
        setJurnalList(transformedJurnals);
      } catch (error) {
        console.error("Error loading buku besar data:", error);
        toast.error(
          error.response?.data?.message || "Gagal memuat data buku besar"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Flatten semua entry jurnal dengan info transaksi
  const allEntries = jurnalList.flatMap((trx) =>
    (trx.entries || []).map((entry) => ({
      ...entry,
      transactionTanggal: trx.tanggal,
      transactionId: trx.id,
      transactionKeterangan: trx.keterangan,
    }))
  );

  // Filter berdasarkan tanggal
  const filteredEntries = allEntries.filter((entry) => {
    const t = new Date(entry.transactionTanggal);
    return (
      (!tanggalAwal || t >= new Date(tanggalAwal)) &&
      (!tanggalAkhir || t <= new Date(tanggalAkhir))
    );
  });

  // Sort kronologis (terlama ke terbaru)
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    const da = new Date(a.transactionTanggal).getTime();
    const db = new Date(b.transactionTanggal).getTime();
    if (da !== db) return da - db;
    return (a.transactionId || "").localeCompare(b.transactionId || "");
  });

  const totalDebit = sortedEntries
    .filter((r) => r.tipe === "DEBIT")
    .reduce((sum, r) => sum + (parseFloat(r.jumlah) || 0), 0);

  const totalKredit = sortedEntries
    .filter((r) => r.tipe === "KREDIT")
    .reduce((sum, r) => sum + (parseFloat(r.jumlah) || 0), 0);

  return (
    <TakmirLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Buku Besar</h1>
          <p className="text-gray-600 mt-1">
            Lihat semua transaksi jurnal (semua akun) dalam periode tertentu
          </p>
        </div>

        {/* Filter Tanggal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Awal
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={tanggalAwal}
                  onChange={(e) => setTanggalAwal(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Akhir
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={tanggalAkhir}
                  onChange={(e) => setTanggalAkhir(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Buku Besar Semua Akun */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">
                Memuat data buku besar...
              </span>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-600">Total Debit</div>
                  <div className="text-xl font-semibold text-blue-600">
                    {formatCurrency(totalDebit)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Kredit</div>
                  <div className="text-xl font-semibold text-green-600">
                    {formatCurrency(totalKredit)}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
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
                        Debit
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kredit
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Keterangan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedEntries.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          Tidak ada transaksi untuk periode ini
                        </td>
                      </tr>
                    ) : (
                      sortedEntries.map((row, idx) => (
                        <tr key={row.id || idx}>
                          <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                            {new Date(row.transactionTanggal).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {row.akun?.kodeAkun || "-"}{" "}
                            {row.akun?.namaAkun
                              ? `- ${row.akun.namaAkun}`
                              : ""}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {row.tipe}
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-gray-900">
                            {row.tipe === "DEBIT"
                              ? formatCurrency(parseFloat(row.jumlah) || 0)
                              : "-"}
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-gray-900">
                            {row.tipe === "KREDIT"
                              ? formatCurrency(parseFloat(row.jumlah) || 0)
                              : "-"}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {row.keterangan || row.transactionKeterangan || "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                Menampilkan {sortedEntries.length} transaksi
              </div>
            </>
          )}
        </div>
      </div>
    </TakmirLayout>
  );
};

export default BukuBesarPage;


