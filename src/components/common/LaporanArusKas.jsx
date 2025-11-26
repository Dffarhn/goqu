import React from "react";
import formatCurrency from "../../utils/formatCurrency";

const LaporanArusKas = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  // Default values untuk mencegah error jika data tidak lengkap
  const operasional = data.operasional && typeof data.operasional === 'object' 
    ? { 
        masuk: data.operasional.masuk || 0, 
        keluar: data.operasional.keluar || 0, 
        netto: data.operasional.netto || 0 
      }
    : { masuk: 0, keluar: 0, netto: 0 };
  
  const investasi = data.investasi && typeof data.investasi === 'object'
    ? { 
        masuk: data.investasi.masuk || 0, 
        keluar: data.investasi.keluar || 0, 
        netto: data.investasi.netto || 0 
      }
    : { masuk: 0, keluar: 0, netto: 0 };
  
  const pendanaan = data.pendanaan && typeof data.pendanaan === 'object'
    ? { 
        masuk: data.pendanaan.masuk || 0, 
        keluar: data.pendanaan.keluar || 0, 
        netto: data.pendanaan.netto || 0 
      }
    : { masuk: 0, keluar: 0, netto: 0 };
  
  const saldoAwal = data.saldoAwal || 0;
  const saldoAkhir = data.saldoAkhir || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Laporan Arus Kas</h2>
        <p className="text-sm text-gray-500 mt-1">
          Arus Kas dari Aktivitas Operasional, Investasi, dan Pendanaan
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Arus Kas dari Aktivitas Operasional */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Arus Kas dari Aktivitas Operasional
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Kas Masuk</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(operasional.masuk)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Kas Keluar</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(operasional.keluar)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-t-2 border-gray-300 pt-2">
                <span className="text-base font-semibold text-gray-800">
                  Arus Kas Bersih dari Operasional
                </span>
                <span
                  className={`text-base font-bold ${
                    operasional.netto >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(operasional.netto)}
                </span>
              </div>
            </div>
          </div>

          {/* Arus Kas dari Aktivitas Investasi */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Arus Kas dari Aktivitas Investasi
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Kas Masuk</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(investasi.masuk)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Kas Keluar</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(investasi.keluar)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-t-2 border-gray-300 pt-2">
                <span className="text-base font-semibold text-gray-800">
                  Arus Kas Bersih dari Investasi
                </span>
                <span
                  className={`text-base font-bold ${
                    investasi.netto >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(investasi.netto)}
                </span>
              </div>
            </div>
          </div>

          {/* Arus Kas dari Aktivitas Pendanaan */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Arus Kas dari Aktivitas Pendanaan
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Kas Masuk</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(pendanaan.masuk)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Kas Keluar</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(pendanaan.keluar)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-t-2 border-gray-300 pt-2">
                <span className="text-base font-semibold text-gray-800">
                  Arus Kas Bersih dari Pendanaan
                </span>
                <span
                  className={`text-base font-bold ${
                    pendanaan.netto >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(pendanaan.netto)}
                </span>
              </div>
            </div>
          </div>

          {/* Saldo Kas */}
          <div className="border-t-4 border-gray-400 pt-4 space-y-2">
            <div className="flex justify-between items-center py-2">
              <span className="text-base font-semibold text-gray-800">
                Saldo Kas Awal Periode
              </span>
              <span className="text-base font-medium text-gray-900">
                {formatCurrency(saldoAwal)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-base font-semibold text-gray-800">
                Kenaikan (Penurunan) Kas Bersih
              </span>
              <span
                className={`text-base font-medium ${
                  operasional.netto + investasi.netto + pendanaan.netto >= 0
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(
                  operasional.netto + investasi.netto + pendanaan.netto
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-t-2 border-gray-300 pt-2">
              <span className="text-lg font-bold text-gray-800">
                Saldo Kas Akhir Periode
              </span>
              <span className="text-lg font-bold text-emerald-600">
                {formatCurrency(saldoAkhir)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanArusKas;

