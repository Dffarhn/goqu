// pages/Landing.jsx
import MetaData from "../components/common/MetaData";
import Navbar from "../components/common/LandingPage/Navbar";
import Hero from "../components/common/LandingPage/Hero";
import FeaturedMosques from "../components/common/LandingPage/FeaturedMosques";
import UIISupport from "../components/common/LandingPage/UIISupport";
import CallToAction from "../components/common/LandingPage/CallToAction";
import Footer from "../components/common/LandingPage/Footer";
import { useEffect } from "react";

function Landing() {
  useEffect(() => {
    const handlePopState = (e) => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  return (
    <>
      <MetaData />
      <Navbar />
      <Hero />
      <FeaturedMosques />
      <UIISupport />
      <CallToAction />
      <Footer />
    </>
  );
}

export default Landing;
