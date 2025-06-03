import MosqueCardSection from "../../../components/common/Home/MosqueCardSection";
import CallToAction from "../../../components/common/LandingPage/CallToAction";
import Footer from "../../../components/common/LandingPage/Footer";
import Hero from "../../../components/common/LandingPage/Hero";
import Navbar from "../../../components/common/LandingPage/Navbar";
import MetaData from "../../../components/common/MetaData";

function HomeUser() {
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
      <Hero isHome={true} />
      <MosqueCardSection />

      <MosqueCardSection title="Masjid Disekitar Kamu" />

      <CallToAction />
      <Footer />
    </>
  );
}

export default HomeUser;
