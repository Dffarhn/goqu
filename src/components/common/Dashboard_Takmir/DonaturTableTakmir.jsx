import { useState } from "react";
import { Search, Eye } from "lucide-react";
import PropTypes from "prop-types";
import formatDateWIB from "../../../utils/formatDate";

const DonaturTableTakmir = ({ recentDonors, formatCurrency }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDonors = recentDonors.filter((donor) =>
    donor.Nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Donatur Terbaru
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Donasi terbaru yang masuk hari ini
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari donatur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors">
              <Eye className="w-4 h-4" />
              Lihat Semua
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Donatur", "Tujuan", "Jumlah", "Waktu", "Aksi"].map((head, idx) => (
                <th
                  key={idx}
                  className={`w-[20%] px-6 py-4 ${
                    idx === 0 ? "text-left" : "text-center"
                  } text-xs font-medium text-gray-500 uppercase tracking-wider`}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDonors.map((donor) => (
              <tr key={donor.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                      {donor.isAnonymous ? "🤝" : donor.Nama.charAt(0)}
                    </div>
                    <div className="ml-4 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {donor.isAnonymous ? "Hamba Allah" : donor.Nama}
                      </div>
                      <div className="text-xs text-gray-500 text-left">
                        {donor.isAnonymous ? "Anonim" : "Donatur"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 truncate">
                    {donor.donasi_masjid.Nama}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-sm font-semibold text-green-600">
                    {formatCurrency(donor.JumlahDonasi)}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-sm text-gray-500">{formatDateWIB( donor.CreatedAt)}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="inline-flex items-center px-3 py-1 border border-green-300 text-green-600 hover:bg-green-50 text-sm font-medium rounded-md transition-colors">
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

DonaturTableTakmir.propTypes = {
  recentDonors: PropTypes.array.isRequired,
  formatCurrency: PropTypes.func.isRequired,
};

export default DonaturTableTakmir;
