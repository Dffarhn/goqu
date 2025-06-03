import DonationCard from "../../../components/common/Dashboard_Takmir/DonationCardTakmir";
import DonaturTableTakmir from "../../../components/common/Dashboard_Takmir/DonaturTableTakmir";
import TakmirLayout from "../../../layouts/takmir_layout";
import { Plus, Download, Calendar, PlusIcon } from "lucide-react"; // or replace these if you don't use Lucide
import formatCurrency from "../../../utils/formatCurrency";
import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";

const recentDonors = [
  {
    id: 1,
    name: "Ahmad Supardi",
    campaign: "Teras Masjid",
    amount: 2000000,
    date: "2 jam lalu",
  },
  {
    id: 2,
    name: "Siti Aminah",
    campaign: "Toilet Masjid",
    amount: 500000,
    date: "5 jam lalu",
  },
  {
    id: 3,
    name: "Hamba Allah",
    campaign: "Santunan Yatim",
    amount: 1000000,
    date: "1 hari lalu",
  },
  {
    id: 4,
    name: "Budi Santoso",
    campaign: "Teras Masjid",
    amount: 750000,
    date: "1 hari lalu",
  },
  {
    id: 5,
    name: "Fatimah Zahra",
    campaign: "Santunan Yatim",
    amount: 300000,
    date: "2 hari lalu",
  },
];

const DonaturTakmir = () => {
  const [donatur, setDonatur] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonatur = async () => {
      try {
        const res = await axiosInstance.get("/donasi/donatur");
        setDonatur(res.data.data); // sesuaikan struktur response lo
        console.log("Fetched donation campaigns:", res.data.data);
      } catch (error) {
        console.error("Error fetching donation campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonatur();
  }, []);

  if (loading) return <p className="text-center">Loading donatur...</p>;

  return (
    <TakmirLayout>
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Donatur Overview
            </h1>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <DonaturTableTakmir
          recentDonors={donatur}
          formatCurrency={formatCurrency}
        ></DonaturTableTakmir>
      </div>
    </TakmirLayout>
  );
};

export default DonaturTakmir;
