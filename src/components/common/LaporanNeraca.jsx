import React from "react";
import formatCurrency from "../../utils/formatCurrency";

const LaporanNeraca = ({ data }) => {
  if (!data) {
    return (
      <div className="text-left py-8 text-gray-500">
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
  const totalAset = data.totalAset || 0;
  const totalKewajiban = data.totalKewajiban || 0;
  const totalEkuitas = data.totalEkuitas || 0;

  // Helper untuk group ekuitas berdasarkan kategori dari backend
  // Backend sudah mengirim data yang di-group, tapi ada duplikasi
  // Kita perlu filter berdasarkan kode akun untuk menghindari duplikasi
  const groupEkuitasByRestriction = () => {
    const tanpaPembatasan = [];
    const denganPembatasan = [];

    // Kode akun untuk Tanpa Pembatasan: 311101, 312101
    // Kode akun untuk Dengan Pembatasan: 321101, 322101
    const kodeTanpaPembatasan = ["311101", "312101"];
    const kodeDenganPembatasan = ["321101", "322101"];

    // Ambil dari kategori "Tanpa Pembatasan dari Pemberi Sumber Daya"
    const kategoriTanpa = ekuitas["Tanpa Pembatasan dari Pemberi Sumber Daya"] || [];
    if (Array.isArray(kategoriTanpa)) {
      kategoriTanpa.forEach((akun) => {
        // Filter hanya akun dengan kode yang sesuai
        if (kodeTanpaPembatasan.includes(akun.kodeAkun)) {
          tanpaPembatasan.push(akun);
        }
      });
    }

    // Ambil dari kategori "Dengan Pembatasan dari Pemberi Sumber Daya"
    const kategoriDengan = ekuitas["Dengan Pembatasan dari Pemberi Sumber Daya"] || [];
    if (Array.isArray(kategoriDengan)) {
      kategoriDengan.forEach((akun) => {
        // Filter hanya akun dengan kode yang sesuai
        if (kodeDenganPembatasan.includes(akun.kodeAkun)) {
          denganPembatasan.push(akun);
        }
      });
    }

    return { tanpaPembatasan, denganPembatasan };
  };

  const { tanpaPembatasan, denganPembatasan } = groupEkuitasByRestriction();

  // Hitung total untuk masing-masing group ekuitas
  const totalTanpaPembatasan = tanpaPembatasan.reduce((sum, akun) => sum + (akun.saldo || 0), 0);
  const totalDenganPembatasan = denganPembatasan.reduce((sum, akun) => sum + (akun.saldo || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-left">
        <h2 className="text-2xl font-bold text-gray-800">
          Laporan Posisi Keuangan
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
            {/* ASET */}
            <tr className="bg-orange-50">
              <td colSpan="2" className="px-4 py-3 font-bold text-gray-800 text-left">
                ASET
              </td>
            </tr>
            
            {/* Aset Lancar */}
            {aset && Object.keys(aset).length > 0 ? (
              Object.keys(aset).map((kategori) => (
                <React.Fragment key={kategori}>
                  <tr className="bg-orange-100">
                    <td colSpan="2" className="px-4 py-2 font-semibold text-gray-700 pl-8 text-left">
                      {kategori}
                    </td>
                  </tr>
                  {(aset[kategori] || []).map((akun) => (
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
                  {subtotalAset[kategori] && (
                    <tr className="bg-orange-50 border-t border-orange-200">
                      <td className="px-4 py-2 text-sm font-semibold text-gray-700 pl-10 text-left">
                        Total {kategori}
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
                <td colSpan="2" className="px-4 py-3 text-sm text-gray-500 text-left">
                  Tidak ada aset
                </td>
              </tr>
            )}
            
            {/* Total Aset */}
            <tr className="bg-gray-100 border-t-2 border-gray-300">
              <td className="px-4 py-3 font-bold text-gray-800 text-left">TOTAL ASET</td>
              <td className="px-4 py-3 text-right font-bold text-gray-900">
                {formatCurrency(totalAset)}
              </td>
            </tr>

            {/* KEWAJIBAN */}
            <tr className="bg-blue-50">
              <td colSpan="2" className="px-4 py-3 font-bold text-gray-800 text-left">
                KEWAJIBAN
              </td>
            </tr>
            
            {Object.keys(kewajiban).length > 0 ? (
              Object.keys(kewajiban).map((kategori) => (
                <React.Fragment key={kategori}>
                  <tr className="bg-blue-100">
                    <td colSpan="2" className="px-4 py-2 font-semibold text-gray-700 pl-8 text-left">
                      {kategori}
                    </td>
                  </tr>
                  {(kewajiban[kategori] || []).map((akun) => (
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
                  {subtotalKewajiban[kategori] && (
                    <tr className="bg-blue-50 border-t border-blue-200">
                      <td className="px-4 py-2 text-sm font-semibold text-gray-700 pl-10 text-left">
                        Total {kategori}
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
                <td colSpan="2" className="px-4 py-3 text-sm text-gray-500 text-left">
                  Tidak ada kewajiban
                </td>
              </tr>
            )}
            
            {/* Total Kewajiban */}
            <tr className="bg-gray-100 border-t-2 border-gray-300">
              <td className="px-4 py-3 font-bold text-gray-800 text-left">TOTAL KEWAJIBAN</td>
              <td className="px-4 py-3 text-right font-bold text-gray-900">
                {formatCurrency(totalKewajiban)}
              </td>
            </tr>

            {/* EKUITAS / ASET NETO */}
            <tr className="bg-orange-50">
              <td colSpan="2" className="px-4 py-3 font-bold text-gray-800 text-left">
                ASET NETO
              </td>
            </tr>
            
            {/* Tanpa Pembatasan dari Pemberi Sumber Daya */}
            <tr className="bg-orange-100">
              <td colSpan="2" className="px-4 py-2 font-semibold text-gray-700 pl-8 text-left">
                Tanpa Pembatasan dari Pemberi Sumber Daya
              </td>
            </tr>
            {tanpaPembatasan.length > 0 ? (
              <>
                {tanpaPembatasan.map((akun) => (
                  <tr key={akun.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700 pl-12 text-left">
                      {akun.kodeAkun} - {akun.namaAkun}
                    </td>
                    <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">
                      {formatCurrency(akun.saldo || 0)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-orange-50 border-t border-orange-200">
                  <td className="px-4 py-2 text-sm font-semibold text-gray-700 pl-10 text-left">
                    Total Tanpa Pembatasan dari Pemberi Sumber Daya
                  </td>
                  <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                    {formatCurrency(totalTanpaPembatasan)}
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="2" className="px-4 py-2 text-sm text-gray-500 text-left pl-12">
                  Tidak ada akun
                </td>
              </tr>
            )}

            {/* Dengan Pembatasan dari Pemberi Sumber Daya */}
            <tr className="bg-orange-100">
              <td colSpan="2" className="px-4 py-2 font-semibold text-gray-700 pl-8 text-left">
                Dengan Pembatasan dari Pemberi Sumber Daya
              </td>
            </tr>
            {denganPembatasan.length > 0 ? (
              <>
                {denganPembatasan.map((akun) => (
                  <tr key={akun.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700 pl-12 text-left">
                      {akun.kodeAkun} - {akun.namaAkun}
                    </td>
                    <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">
                      {formatCurrency(akun.saldo || 0)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-orange-50 border-t border-orange-200">
                  <td className="px-4 py-2 text-sm font-semibold text-gray-700 pl-10 text-left">
                    Total Dengan Pembatasan dari Pemberi Sumber Daya
                  </td>
                  <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                    {formatCurrency(totalDenganPembatasan)}
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="2" className="px-4 py-2 text-sm text-gray-500 text-left pl-12">
                  Tidak ada akun
                </td>
              </tr>
            )}
            
            {/* Total Ekuitas */}
            <tr className="bg-gray-100 border-t-2 border-gray-300">
              <td className="px-4 py-3 font-bold text-gray-800 text-left">TOTAL ASET NETO</td>
              <td className="px-4 py-3 text-right font-bold text-gray-900">
                {formatCurrency(totalEkuitas)}
              </td>
            </tr>

            {/* Total Kewajiban dan Aset Neto */}
            <tr className="bg-gray-200 border-t-4 border-gray-400">
              <td className="px-4 py-3 font-bold text-lg text-gray-800 text-left">
                TOTAL LIABILITAS DAN ASET NETO
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
