import { useEffect, useState } from "react";
import DonationCard from "../../../components/common/Dashboard_Takmir/DonationCardTakmir";
import TakmirLayout from "../../../layouts/takmir_layout";
import { Plus, Download, Calendar, PlusIcon } from "lucide-react"; // or replace these if you don't use Lucide
import axiosInstance from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";


const DonationTakmir = () => {
  const [donationCampaigns, setDonationCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axiosInstance.get("/donasi-masjid/takmir");
        setDonationCampaigns(res.data.data); // sesuaikan struktur response lo
        console.log("Fetched donation campaigns:", res.data.data);
      } catch (error) {
        console.error("Error fetching donation campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading)
    return <p className="text-center text-black">Loading campaigns...</p>;

  return (
    <TakmirLayout>
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Donation Overview
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
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            
              onClick={() => navigate("/admin/add/donation")} // <-- navigate to add donation page
            >
              <PlusIcon className="w-4 h-4" />
              Tambah Donasi
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Campaign Cards */}
        <div className="space-y-4">
          {donationCampaigns.map((campaign) => (
            <DonationCard
              key={campaign.id}
              campaign={campaign}
              onViewDetail={() => {
                navigate(`/admin/donation/${campaign.id}`); // <-- pass id di URL
              }}
            />
          ))}
        </div>
      </div>
    </TakmirLayout>
  );
};

export default DonationTakmir;
