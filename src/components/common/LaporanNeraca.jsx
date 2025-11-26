import React from "react";
import formatCurrency from "../../utils/formatCurrency";

const LaporanNeraca = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  // Default values untuk mencegah error jika data tidak lengkap
  const aset = data.aset || {};
  const kewajiban = data.kewajiban || {};
  const ekuitas = data.ekuitas || {};
  const subtotalAset = data.subtotalAset || {};
  const subtotalKewajiban = data.subtotalKewajiban || {};
  const subtotalEkuitas = data.subtotalEkuitas || {};
  const totalAsetTanpa = data.totalAsetTanpa || 0;
  const totalAsetDengan = data.totalAsetDengan || 0;
  const totalAset = data.totalAset || 0;
  const totalKewajibanTanpa = data.totalKewajibanTanpa || 0;
  const totalKewajibanDengan = data.totalKewajibanDengan || 0;
  const totalKewajiban = data.totalKewajiban || 0;
  const totalEkuitasTanpa = data.totalEkuitasTanpa || 0;
  const totalEkuitasDengan = data.totalEkuitasDengan || 0;
  const totalEkuitas = data.totalEkuitas || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Laporan Posisi Keuangan
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
                Tanpa Pembatasan
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dengan Pembatasan
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* ASET */}
            <tr className="bg-orange-50">
              <td colSpan="4" className="px-4 py-3 font-bold text-gray-800">
                ASET
              </td>
            </tr>
            
            {/* Aset Lancar */}
            {aset && Object.keys(aset).length > 0 ? (
              Object.keys(aset).map((kategori) => (
                <React.Fragment key={kategori}>
                  <tr className="bg-orange-100">
                    <td colSpan="4" className="px-4 py-2 font-semibold text-gray-700 pl-8">
                      {kategori}
                    </td>
                  </tr>
                  {(aset[kategori] || []).map((akun) => (
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
                  {subtotalAset[kategori] && (
                    <tr className="bg-orange-50 border-t border-orange-200">
                      <td className="px-4 py-2 text-sm font-semibold text-gray-700 pl-10">
                        Total {kategori}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                        {formatCurrency(subtotalAset[kategori].tanpaPembatasan || 0)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                        {formatCurrency(subtotalAset[kategori].denganPembatasan || 0)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                        {formatCurrency(subtotalAset[kategori].saldo || 0)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-3 text-sm text-gray-500 text-center">
                  Tidak ada aset
                </td>
              </tr>
            )}
            
            {/* Total Aset */}
            <tr className="bg-gray-100 border-t-2 border-gray-300">
              <td className="px-4 py-3 font-bold text-gray-800">TOTAL ASET</td>
              <td className="px-4 py-3 text-right font-bold text-gray-900">
                {formatCurrency(totalAsetTanpa)}
              </td>
              <td className="px-4 py-3 text-right font-bold text-gray-900">
                {formatCurrency(totalAsetDengan)}
              </td>
              <td className="px-4 py-3 text-right font-bold text-gray-900">
                {formatCurrency(totalAset)}
              </td>
            </tr>

            {/* KEWAJIBAN */}
            <tr className="bg-blue-50">
              <td colSpan="4" className="px-4 py-3 font-bold text-gray-800">
                KEWAJIBAN
              </td>
            </tr>
            
            {Object.keys(kewajiban).length > 0 ? (
              Object.keys(kewajiban).map((kategori) => (
                <React.Fragment key={kategori}>
                  <tr className="bg-blue-100">
                    <td colSpan="4" className="px-4 py-2 font-semibold text-gray-700 pl-8">
                      {kategori}
                    </td>
                  </tr>
                  {(kewajiban[kategori] || []).map((akun) => (
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
                  {subtotalKewajiban[kategori] && (
                    <tr className="bg-blue-50 border-t border-blue-200">
                      <td className="px-4 py-2 text-sm font-semibold text-gray-700 pl-10">
                        Total {kategori}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                        {formatCurrency(subtotalKewajiban[kategori].tanpaPembatasan || 0)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                        {formatCurrency(subtotalKewajiban[kategori].denganPembatasan || 0)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                        {formatCurrency(subtotalKewajiban[kategori].saldo || 0)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-3 text-sm text-gray-500 text-center">
                  Tidak ada kewajiban
                </td>
              </tr>
            )}
            
            {/* Total Kewajiban */}
            <tr className="bg-gray-100 border-t-2 border-gray-300">
              <td className="px-4 py-3 font-bold text-gray-800">TOTAL KEWAJIBAN</td>
              <td className="px-4 py-3 text-right font-bold text-gray-900">
                {formatCurrency(totalKewajibanTanpa)}
              </td>
              <td className="px-4 py-3 text-right font-bold text-gray-900">
                {formatCurrency(totalKewajibanDengan)}
              </td>
              <td className="px-4 py-3 text-right font-bold text-gray-900">
                {formatCurrency(totalKewajiban)}
              </td>
            </tr>

            {/* EKUITAS / ASET NETO */}
            <tr className="bg-orange-50">
              <td colSpan="4" className="px-4 py-3 font-bold text-gray-800">
                ASET NETO
              </td>
            </tr>
            
            {Object.keys(ekuitas).length > 0 ? (
              Object.keys(ekuitas).map((kategori) => (
                <React.Fragment key={kategori}>
                  <tr className="bg-orange-100">
                    <td colSpan="4" className="px-4 py-2 font-semibold text-gray-700 pl-8">
                      {kategori}
                    </td>
                  </tr>
                  {(ekuitas[kategori] || []).map((akun) => (
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
                  {subtotalEkuitas[kategori] && (
                    <tr className="bg-orange-50 border-t border-orange-200">
                      <td className="px-4 py-2 text-sm font-semibold text-gray-700 pl-10">
                        Total {kategori}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                        {formatCurrency(subtotalEkuitas[kategori].tanpaPembatasan || 0)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                        {formatCurrency(subtotalEkuitas[kategori].denganPembatasan || 0)}
                      </td>
                      <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                        {formatCurrency(subtotalEkuitas[kategori].saldo || 0)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-3 text-sm text-gray-500 text-center">
                  Tidak ada ekuitas
                </td>
              </tr>
            )}
            
            {/* Total Ekuitas */}
            <tr className="bg-gray-100 border-t-2 border-gray-300">
              <td className="px-4 py-3 font-bold text-gray-800">TOTAL ASET NETO</td>
              <td className="px-4 py-3 text-right font-bold text-gray-900">
                {formatCurrency(totalEkuitasTanpa)}
              </td>
              <td className="px-4 py-3 text-right font-bold text-gray-900">
                {formatCurrency(totalEkuitasDengan)}
              </td>
              <td className="px-4 py-3 text-right font-bold text-gray-900">
                {formatCurrency(totalEkuitas)}
              </td>
            </tr>

            {/* Total Kewajiban dan Aset Neto */}
            <tr className="bg-gray-200 border-t-4 border-gray-400">
              <td className="px-4 py-3 font-bold text-lg text-gray-800">
                TOTAL LIABILITAS DAN ASET NETO
              </td>
              <td className="px-4 py-3 text-right font-bold text-lg text-gray-900">
                {formatCurrency(totalKewajibanTanpa + totalEkuitasTanpa)}
              </td>
              <td className="px-4 py-3 text-right font-bold text-lg text-gray-900">
                {formatCurrency(totalKewajibanDengan + totalEkuitasDengan)}
              </td>
              <td className="px-4 py-3 text-right font-bold text-lg text-gray-900">
                {formatCurrency(totalKewajiban + totalEkuitas)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaporanNeraca;
