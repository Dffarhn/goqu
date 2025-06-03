import formatCurrency from "../../../utils/formatCurrency";

const DonationSummaryCard = ({
  FotoDonasi,
  Nama,
  Deskripsi,
  UangPengeluaran,
  UangDonasiTerkumpul,
  donasi,
  TargetUangDonasi,
}) => {
  const progress = Math.round((UangDonasiTerkumpul / TargetUangDonasi) * 100);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <div className="flex flex-col lg:flex-row gap-4">
        <img
          src={FotoDonasi}
          alt={Nama}
          className="w-full lg:w-1/4 rounded-lg object-cover h-40"
        />
        <div className="flex-1 space-y-2">
          <h2 className="text-xl font-bold text-gray-800">{Nama}</h2>
          <p className="text-gray-500">{Deskripsi}</p>

          <div className="space-y-1 mt-2">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{progress}%</span>
              <span className="text-sm text-gray-600">
                {formatCurrency(UangDonasiTerkumpul)} / {formatCurrency(TargetUangDonasi)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-green-100 text-green-700 p-3 rounded-md text-center">
              <p className="text-sm">Donasi Siap Pakai</p>
              <p className="font-bold">
                {formatCurrency(UangDonasiTerkumpul - UangPengeluaran)}
              </p>
            </div>
            <div className="bg-purple-100 text-purple-700 p-3 rounded-md text-center">
              <p className="text-sm">Akumulasi Donasi</p>
              <p className="font-bold">{formatCurrency(UangDonasiTerkumpul)}</p>
            </div>
            <div className="bg-blue-100 text-blue-700 p-3 rounded-md text-center">
              <p className="text-sm">Pengeluaran</p>
              <p className="font-bold">{formatCurrency(UangPengeluaran)}</p>
            </div>
            <div className="bg-orange-100 text-orange-700 p-3 rounded-md text-center">
              <p className="text-sm">Total Donatur</p>
              <p className="font-bold">{donasi.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSummaryCard;