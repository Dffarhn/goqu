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

// Loading Skeleton Component
const MosqueCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-md w-3/4"></div>

        {/* Mosque name skeleton */}
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-md w-1/2"></div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-md w-full"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-md w-4/5"></div>
        </div>

        {/* Progress bar skeleton */}
        <div className="pt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer rounded-full w-3/5"></div>
          </div>

          {/* Amount skeleton */}
          <div className="flex justify-between mt-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-md w-24"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-md w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Loading Component
const EnhancedLoadingScreen = ({ limit = 3 }) => {
  return (
    <div className="space-y-8">
      {/* Header loading */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-md w-80"></div>
        <div className="h-10 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 bg-[length:200%_100%] animate-shimmer rounded-md w-40"></div>
      </div>

      {/* Cards grid loading */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: limit }, (_, index) => (
          <MosqueCardSkeleton key={index} />
        ))}
      </div>

      {/* Loading text with animation */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
        <p className="text-gray-600 mt-2 text-sm font-medium">
          Memuat kampanye donasi...
        </p>
      </div>
    </div>
  );
};

const MosqueCardSection = ({
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

  // if (loading) return <p className="text-center">Loading campaigns...</p>;

  return (
    <section className={`${position}`}>
      {loading ? (
        <EnhancedLoadingScreen limit={limit} />
      ) : (
        <>
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
        </>
      )}
    </section>
  );
};

export default MosqueCardSection;
