import { useState } from "react";
import DonationSummaryCard from "./DonationDetailSummary";
import DonationTable from "./DonationDetailTable";
import ExpenseDialog from "./PengeluaranDialogDonasi";

const DonationDetailContent = ({ donation, onSavePengeluaran }) => {
  console.log("Donation Detail Content:", donation.masjid.id);
  const expenseData = donation.pengeluaran_donasi_masjid.map((expense) => ({
    name: expense.TujuanPengeluaran,
    amount: expense.UangPengeluaran,
  }));
  const donationData = donation.donasi.map((donatur) => ({
    name: donatur.Nama,
    amount: donatur.JumlahDonasi,
  }));


  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  // const handleSaveExpense = (expenseData) => {
  //   onSavePengeluaran
  // };
  return (
    <div className="space-y-6">
      <DonationSummaryCard {...donation} />

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          + Tambah Pengeluaran
        </button>
      </div>
      <ExpenseDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={onSavePengeluaran}
        id_donasi_masjid={donation.id}
        kategori_donasi_id={donation.kategori_donasi.id}
        masjid_id={donation.masjid.id}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donation Table */}
        <DonationTable
          title="Data Donatur"
          data={donationData}
          loading={loading}
        />

        {/* Expense Table */}
        <DonationTable
          title="Data Pengeluaran"
          data={expenseData}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DonationDetailContent;
