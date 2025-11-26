import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import formatCurrency from "../../utils/formatCurrency";

const LaporanLabaRugi = ({ data }) => {
  // State untuk track kategori mana yang expanded/collapsed
  // Default: semua kategori collapsed (false jika belum di-set)
  const [expandedCategories, setExpandedCategories] = useState({});

  // Function untuk toggle expand/collapse kategori
  const toggleCategory = (kategori) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [kategori]: prev[kategori] === undefined ? true : !prev[kategori],
    }));
  };

  // Helper untuk check apakah kategori expanded
  const isCategoryExpanded = (kategori) => {
    return expandedCategories[kategori] === true; // Default false jika belum di-set
  };
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  // Default values untuk mencegah error jika data tidak lengkap
  const pendapatan = data.pendapatan || {};
  const beban = data.beban || {};
  const subtotalPendapatan = data.subtotalPendapatan || {};
  const subtotalBeban = data.subtotalBeban || {};
  const totalPendapatanTanpa = data.totalPendapatanTanpa || 0;
  const totalPendapatanDengan = data.totalPendapatanDengan || 0;
  const totalPendapatan = data.totalPendapatan || 0;
  const totalBebanTanpa = data.totalBebanTanpa || 0;
  const totalBebanDengan = data.totalBebanDengan || 0;
  const totalBeban = data.totalBeban || 0;
  const labaRugiTanpa = data.labaRugiTanpa || 0;
  const labaRugiDengan = data.labaRugiDengan || 0;
  const labaRugi = data.labaRugi || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Laporan Penghasilan Komprehensif
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uraian
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanpa Pembatasan dari Pemberi Sumber
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dengan Pembatasan dari Pemberi Sumber
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* PENDAPATAN */}
            <tr className="bg-emerald-50">
              <td colSpan="4" className="px-4 py-3 font-bold text-gray-800">
                4 PENDAPATAN
              </td>
            </tr>
            
            {pendapatan && Object.keys(pendapatan).length > 0 ? (
              Object.keys(pendapatan).map((kategori) => (
                <React.Fragment key={kategori}>
                  <tr 
                    className="bg-emerald-100 cursor-pointer hover:bg-emerald-200 transition-colors"
                    onClick={() => toggleCategory(kategori)}
                  >
                    <td colSpan="4" className="px-4 py-2 font-semibold text-gray-700 pl-8">
                      <div className="flex items-center gap-2">
                        {isCategoryExpanded(kategori) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <span>{kategori}</span>
                      </div>
                    </td>
                  </tr>
                  {isCategoryExpanded(kategori) && (
                    <>
                      {(pendapatan[kategori] || []).map((akun) => (
                        <tr key={akun.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700 pl-12">
                            {akun.kodeAkun} - {akun.namaAkun}
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-gray-900">
                            {formatCurrency(akun.tanpaPembatasan || 0)}
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-gray-900">
                            {formatCurrency(akun.denganPembatasan || 0)}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">
                            {formatCurrency(akun.saldo || 0)}
                          </td>
                        </tr>
                      ))}
                      {/* Subtotal per kategori */}
                      {subtotalPendapatan[kategori] && (
                        <tr className="bg-emerald-50 border-t border-emerald-200">
                          <td className="px-4 py-2 text-sm font-semibold text-gray-700 pl-10">
                            Total {kategori}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                            {formatCurrency(subtotalPendapatan[kategori].tanpaPembatasan || 0)}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                            {formatCurrency(subtotalPendapatan[kategori].denganPembatasan || 0)}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                            {formatCurrency(subtotalPendapatan[kategori].saldo || 0)}
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-3 text-sm text-gray-500 text-center">
                  Tidak ada pendapatan
                </td>
              </tr>
            )}
            
            {/* Total Pendapatan */}
            <tr className="bg-gray-100 border-t-2 border-gray-300">
              <td className="px-4 py-3 font-bold text-gray-800">TOTAL PENDAPATAN</td>
              <td className="px-4 py-3 text-right font-bold text-emerald-600">
                {formatCurrency(totalPendapatanTanpa)}
              </td>
              <td className="px-4 py-3 text-right font-bold text-emerald-600">
                {formatCurrency(totalPendapatanDengan)}
              </td>
              <td className="px-4 py-3 text-right font-bold text-emerald-600">
                {formatCurrency(totalPendapatan)}
              </td>
            </tr>

            {/* BEBAN */}
            <tr className="bg-red-50">
              <td colSpan="4" className="px-4 py-3 font-bold text-gray-800">
                5 BEBAN
              </td>
            </tr>
            
            {beban && Object.keys(beban).length > 0 ? (
              Object.keys(beban).map((kategori) => (
                <React.Fragment key={kategori}>
                  <tr 
                    className="bg-red-100 cursor-pointer hover:bg-red-200 transition-colors"
                    onClick={() => toggleCategory(kategori)}
                  >
                    <td colSpan="4" className="px-4 py-2 font-semibold text-gray-700 pl-8">
                      <div className="flex items-center gap-2">
                        {isCategoryExpanded(kategori) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <span>{kategori}</span>
                      </div>
                    </td>
                  </tr>
                  {isCategoryExpanded(kategori) && (
                    <>
                      {(beban[kategori] || []).map((akun) => (
                        <tr key={akun.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700 pl-12">
                            {akun.kodeAkun} - {akun.namaAkun}
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-gray-900">
                            {formatCurrency(akun.tanpaPembatasan || 0)}
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-gray-900">
                            {formatCurrency(akun.denganPembatasan || 0)}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">
                            {formatCurrency(akun.saldo || 0)}
                          </td>
                        </tr>
                      ))}
                      {/* Subtotal per kategori */}
                      {subtotalBeban[kategori] && (
                        <tr className="bg-red-50 border-t border-red-200">
                          <td className="px-4 py-2 text-sm font-semibold text-gray-700 pl-10">
                            Total {kategori}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                            {formatCurrency(subtotalBeban[kategori].tanpaPembatasan || 0)}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                            {formatCurrency(subtotalBeban[kategori].denganPembatasan || 0)}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                            {formatCurrency(subtotalBeban[kategori].saldo || 0)}
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-3 text-sm text-gray-500 text-center">
                  Tidak ada beban
                </td>
              </tr>
            )}
            
            {/* Total Beban */}
            <tr className="bg-gray-100 border-t-2 border-gray-300">
              <td className="px-4 py-3 font-bold text-gray-800">TOTAL BEBAN</td>
              <td className="px-4 py-3 text-right font-bold text-red-600">
                {formatCurrency(totalBebanTanpa)}
              </td>
              <td className="px-4 py-3 text-right font-bold text-red-600">
                {formatCurrency(totalBebanDengan)}
              </td>
              <td className="px-4 py-3 text-right font-bold text-red-600">
                {formatCurrency(totalBeban)}
              </td>
            </tr>

            {/* SURPLUS (DEFISIT) */}
            <tr className="bg-gray-200 border-t-4 border-gray-400">
              <td className="px-4 py-3 font-bold text-lg text-gray-800">
                SURPLUS (DEFISIT)
              </td>
              <td className={`px-4 py-3 text-right font-bold text-lg ${
                labaRugiTanpa >= 0 ? "text-emerald-600" : "text-red-600"
              }`}>
                {formatCurrency(labaRugiTanpa)}
              </td>
              <td className={`px-4 py-3 text-right font-bold text-lg ${
                labaRugiDengan >= 0 ? "text-emerald-600" : "text-red-600"
              }`}>
                {formatCurrency(labaRugiDengan)}
              </td>
              <td className={`px-4 py-3 text-right font-bold text-lg ${
                labaRugi >= 0 ? "text-emerald-600" : "text-red-600"
              }`}>
                {formatCurrency(labaRugi)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaporanLabaRugi;
