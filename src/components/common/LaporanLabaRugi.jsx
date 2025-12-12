import React from "react";
import formatCurrency from "../../utils/formatCurrency";

const LaporanLabaRugi = ({ data }) => {
  if (!data) {
    return (
      <div className="text-left py-8 text-gray-500">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  // Default values untuk mencegah error jika data tidak lengkap
  const pendapatan = data.pendapatan || {};
  const beban = data.beban || {};
  const subtotalPendapatan = data.subtotalPendapatan || {};
  const subtotalBeban = data.subtotalBeban || {};
  const totalPendapatan = data.totalPendapatan || 0;
  const totalBeban = data.totalBeban || 0;
  const labaRugi = data.labaRugi || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-left">
        <h2 className="text-2xl font-bold text-gray-800">
          Laporan Penghasilan Komprehensif
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uraian
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Saldo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* PENDAPATAN */}
            <tr className="bg-emerald-50">
              <td colSpan="2" className="px-4 py-3 font-bold text-gray-800 text-left">
                PENDAPATAN
              </td>
            </tr>
            
            {pendapatan && Object.keys(pendapatan).length > 0 ? (
              Object.keys(pendapatan).map((kategori) => (
                <React.Fragment key={kategori}>
                  <tr className="bg-emerald-100">
                    <td colSpan="2" className="px-4 py-2 font-semibold text-gray-700 pl-8 text-left">
                      {kategori}
                    </td>
                  </tr>
                  {(pendapatan[kategori] || []).map((akun) => (
                    <tr key={akun.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-700 pl-12 text-left">
                        {akun.kodeAkun} - {akun.namaAkun}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">
                        {formatCurrency(akun.saldo || 0)}
                      </td>
                    </tr>
                  ))}
                  {/* Subtotal per kategori */}
                  {subtotalPendapatan[kategori] && (
                    <tr className="bg-emerald-50 border-t border-emerald-200">
                      <td className="px-4 py-2 text-sm font-semibold text-gray-700 pl-10 text-left">
                        Total {kategori}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                        {formatCurrency(subtotalPendapatan[kategori].saldo || 0)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-4 py-3 text-sm text-gray-500 text-left">
                  Tidak ada pendapatan
                </td>
              </tr>
            )}
            
            {/* Total Pendapatan */}
            <tr className="bg-gray-100 border-t-2 border-gray-300">
              <td className="px-4 py-3 font-bold text-gray-800 text-left">TOTAL PENDAPATAN</td>
              <td className="px-4 py-3 text-right font-bold text-emerald-600">
                {formatCurrency(totalPendapatan)}
              </td>
            </tr>

            {/* BEBAN */}
            <tr className="bg-red-50">
              <td colSpan="2" className="px-4 py-3 font-bold text-gray-800 text-left">
                BEBAN
              </td>
            </tr>
            
            {beban && Object.keys(beban).length > 0 ? (
              Object.keys(beban).map((kategori) => (
                <React.Fragment key={kategori}>
                  <tr className="bg-red-100">
                    <td colSpan="2" className="px-4 py-2 font-semibold text-gray-700 pl-8 text-left">
                      {kategori}
                    </td>
                  </tr>
                  {(beban[kategori] || []).map((akun) => (
                    <tr key={akun.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-700 pl-12 text-left">
                        {akun.kodeAkun} - {akun.namaAkun}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">
                        {formatCurrency(akun.saldo || 0)}
                      </td>
                    </tr>
                  ))}
                  {/* Subtotal per kategori */}
                  {subtotalBeban[kategori] && (
                    <tr className="bg-red-50 border-t border-red-200">
                      <td className="px-4 py-2 text-sm font-semibold text-gray-700 pl-10 text-left">
                        Total {kategori}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                        {formatCurrency(subtotalBeban[kategori].saldo || 0)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-4 py-3 text-sm text-gray-500 text-left">
                  Tidak ada beban
                </td>
              </tr>
            )}
            
            {/* Total Beban */}
            <tr className="bg-gray-100 border-t-2 border-gray-300">
              <td className="px-4 py-3 font-bold text-gray-800 text-left">TOTAL BEBAN</td>
              <td className="px-4 py-3 text-right font-bold text-red-600">
                {formatCurrency(totalBeban)}
              </td>
            </tr>

            {/* SURPLUS (DEFISIT) */}
            <tr className="bg-gray-200 border-t-4 border-gray-400">
              <td className="px-4 py-3 font-bold text-lg text-gray-800 text-left">
                SURPLUS (DEFISIT)
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
