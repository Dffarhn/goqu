import MosqueCardSection from "../../../components/common/Home/MosqueCardSection";
import CallToAction from "../../../components/common/LandingPage/CallToAction";
import Footer from "../../../components/common/LandingPage/Footer";
import Hero from "../../../components/common/LandingPage/Hero";
import Navbar from "../../../components/common/LandingPage/Navbar";
import MetaData from "../../../components/common/MetaData";
import DonationHistoryList from "../../../components/common/Riwayat_Donasi/DonationHistoryList";

function RiwayatDonasiPage() {
  return (
    <>
      <MetaData />
      <Navbar
        position="static"
        user={{
          name: JSON.parse(localStorage.getItem("user"))?.NamaLengkap || "User",
          role: "Donatur",
          avatar: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
        }}
      />

      <DonationHistoryList />
      <Footer />
    </>
  );
}

export default RiwayatDonasiPage;
