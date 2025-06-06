import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import formatCurrency from "../../../utils/formatCurrency";
import formatDateWIB from "../../../utils/formatDate";

const statusColor = {
    Sukses: "text-green-700 bg-green-100 border-green-300",
    Pending: "text-yellow-700 bg-yellow-100 border-yellow-300",
    Gagal: "text-red-700 bg-red-100 border-red-300",
};

export default function DonationHistoryList() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axiosInstance.get("donasi");
                if (response.data.statusCode !== 200) {
                    throw new Error("Gagal mengambil data donasi");
                }
                setDonations(response.data.data || []);
            } catch (err) {
                console.error("Gagal mengambil data donasi", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDonations();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        );

    if (donations.length === 0)
        return (
            <div className="flex flex-col items-center py-16 text-gray-500">
                <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mb-4 text-gray-300">
                    <path d="M12 21C12 21 4 13.5 4 8.5C4 5.46243 6.46243 3 9.5 3C11.1566 3 12.7357 3.87972 13.5 5.15385C14.2643 3.87972 15.8434 3 17.5 3C20.5376 3 23 5.46243 23 8.5C23 13.5 15 21 15 21H12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Belum ada riwayat donasi.</span>
            </div>
        );

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-8 text-center text-blue-700">Riwayat Donasi</h2>
            <div className="space-y-6">
                {donations.map((item) => (
                    <div
                        key={item.id}
                        className="border rounded-xl p-6 shadow-md bg-white hover:shadow-lg transition flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                        <div className="flex-1">
                            <h3 className="font-semibold text-left text-lg text-gray-800 mb-1">
                                {item.donasi_masjid?.Nama || "Donasi Masjid"}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="inline-block mr-1 text-blue-400">
                                    <path d="M12 8v4l3 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                {formatDateWIB(item.CreatedAt)}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 min-w-[120px]">
                            <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColor[item.StatusDonasi] || "bg-gray-200 text-gray-600 border-gray-300"}`}
                            >
                                {item.StatusDonasi}
                            </span>
                            <span className="text-xl font-bold text-blue-600 tracking-tight">
                                {formatCurrency(Number(item.JumlahDonasi))}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
