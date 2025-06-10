import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MosqueCard from "../MosqueCard";
import axiosInstance from "../../../api/axiosInstance";

const dummyMosques = [
  {
    image: "/Masjid1.jpg",
    title: "Perbaikan Atap Masjid",
    name: "Masjid Al-Falah",
    description: "Masjid ini sedang membutuhkan dana untuk renovasi atap.",
    currentAmount: 15000000,
    targetAmount: 25000000,
  },
  {
    image: "/Masjid2.jpg",
    title: "Pembangunan Tempat Wudhu",
    name: "Masjid Al-Hikmah",
    description: "Masjid ini sedang membangun tempat wudhu baru.",
    currentAmount: 9000000,
    targetAmount: 20000000,
  },
  {
    image: "/Masjid3.jpg",
    title: "Renovasi Interior",
    name: "Masjid Raya Baiturrahman",
    description: "Dukunganmu sangat berarti untuk renovasi interior.",
    currentAmount: 23000000,
    targetAmount: 30000000,
  },
];

const   MosqueCardSection = ({
  title = "Masjid Membutuhkan Kamu Segera",
  seeMore = true,
  seeMoreUrl = "/donation?search=Masjid Membutuhkan Kamu Segera",
  position = "px-6 md:px-20 mt-12",
  limit = 3,
}) => {
  const [donationCampaigns, setDonationCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axiosInstance.get("/donasi-masjid?limit=" + limit);
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

  if (loading) return <p className="text-center">Loading campaigns...</p>;

  return (
    <section className={`${position}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h2>

        {seeMore && (
          <button
            onClick={() => navigate(seeMoreUrl)}
            className="bg-[#0473A8] hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center transition"
          >
            Lihat Lebih banyak
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        )}
        {/* <button
          onClick={() => navigate(seeMoreUrl)}
          className="bg-[#0473A8] hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center transition"
        >
          Lihat Lebih banyak
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {donationCampaigns.map((mosque, index) => (
          <MosqueCard
            key={index}
            image={mosque.FotoDonasi}
            title={mosque.Nama}
            name={mosque.masjid.Nama}
            description={mosque.Deskripsi}
            currentAmount={mosque.UangDonasiTerkumpul}
            targetAmount={mosque.TargetUangDonasi}
            onClick={() => navigate(`/home/donation/${mosque.id}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default MosqueCardSection;
