import React from "react";
import formatCurrency from "../../utils/formatCurrency";

const LaporanPerubahanEkuitas = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  const {
    saldoAwalEkuitasTanpa,
    saldoAwalEkuitasDengan,
    saldoAwalEkuitas,
    labaRugiTanpa,
    labaRugiDengan,
    labaRugi,
    perubahanModalTanpa,
    perubahanModalDengan,
    perubahanModal,
    saldoAkhirEkuitasTanpa,
    saldoAkhirEkuitasDengan,
    saldoAkhirEkuitas,
  } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Laporan Perubahan Aset Neto
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
                Tanpa Pembatasan dari Pemberi Sumber Daya
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dengan Pembatasan dari Pemberi Sumber Daya
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Saldo Awal */}
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 text-base font-semibold text-gray-800">
                Saldo Awal
              </td>
              <td className="px-4 py-3 text-right text-base font-medium text-gray-900">
                {formatCurrency(saldoAwalEkuitasTanpa || 0)}
              </td>
              <td className="px-4 py-3 text-right text-base font-medium text-gray-900">
                {formatCurrency(saldoAwalEkuitasDengan || 0)}
              </td>
              <td className="px-4 py-3 text-right text-base font-medium text-gray-900">
                {formatCurrency(saldoAwalEkuitas || 0)}
              </td>
            </tr>

            {/* Penghasilan Komprehensif */}
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 text-base font-semibold text-gray-800">
                Penghasilan Komprehensif
              </td>
              <td className={`px-4 py-3 text-right text-base font-medium ${
                (labaRugiTanpa || 0) >= 0 ? "text-emerald-600" : "text-red-600"
              }`}>
                {formatCurrency(labaRugiTanpa || 0)}
              </td>
              <td className={`px-4 py-3 text-right text-base font-medium ${
                (labaRugiDengan || 0) >= 0 ? "text-emerald-600" : "text-red-600"
              }`}>
                {formatCurrency(labaRugiDengan || 0)}
              </td>
              <td className={`px-4 py-3 text-right text-base font-medium ${
                (labaRugi || 0) >= 0 ? "text-emerald-600" : "text-red-600"
              }`}>
                {formatCurrency(labaRugi || 0)}
              </td>
            </tr>

            {/* Perubahan Modal (jika ada) */}
            {(perubahanModalTanpa !== 0 || perubahanModalDengan !== 0 || perubahanModal !== 0) && (
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 text-base font-semibold text-gray-800">
                  Perubahan Modal
                </td>
                <td className="px-4 py-3 text-right text-base font-medium text-gray-900">
                  {formatCurrency(perubahanModalTanpa || 0)}
                </td>
                <td className="px-4 py-3 text-right text-base font-medium text-gray-900">
                  {formatCurrency(perubahanModalDengan || 0)}
                </td>
                <td className="px-4 py-3 text-right text-base font-medium text-gray-900">
                  {formatCurrency(perubahanModal || 0)}
                </td>
              </tr>
            )}

            {/* Saldo Akhir */}
            <tr className="bg-gray-100 border-t-4 border-gray-400">
              <td className="px-4 py-3 text-lg font-bold text-gray-800">
                Saldo Akhir
              </td>
              <td className={`px-4 py-3 text-right text-lg font-bold ${
                (saldoAkhirEkuitasTanpa || 0) >= 0 ? "text-emerald-600" : "text-red-600"
              }`}>
                {formatCurrency(saldoAkhirEkuitasTanpa || 0)}
              </td>
              <td className={`px-4 py-3 text-right text-lg font-bold ${
                (saldoAkhirEkuitasDengan || 0) >= 0 ? "text-emerald-600" : "text-red-600"
              }`}>
                {formatCurrency(saldoAkhirEkuitasDengan || 0)}
              </td>
              <td className={`px-4 py-3 text-right text-lg font-bold ${
                (saldoAkhirEkuitas || 0) >= 0 ? "text-emerald-600" : "text-red-600"
              }`}>
                {formatCurrency(saldoAkhirEkuitas || 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Keterangan */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Keterangan:</strong> Saldo akhir ekuitas dihitung dari saldo awal ditambah penghasilan komprehensif dalam periode. Perubahan modal menunjukkan selisih antara perubahan total ekuitas dengan laba rugi.
        </p>
      </div>
    </div>
  );
};

export default LaporanPerubahanEkuitas;
