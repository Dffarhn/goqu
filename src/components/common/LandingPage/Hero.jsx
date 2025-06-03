import React from "react";
import ImageCarousel from "./ImageCarousel";

const Hero = ({ isHome = false }) => {
  return (
    <section
      className="w-full min-h-[calc(100vh-72px)] flex flex-col md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 py-20 md:py-16 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0C6839 0%, #0C6839 100%)",
      }}
    >
      {/* Enhanced Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-300 blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-yellow-200 blur-3xl animate-float-delayed"></div>

        {/* Mosque silhouette in the background */}
        <div
          className="absolute bottom-0 left-0 w-full h-48 bg-contain bg-bottom bg-no-repeat opacity-10"
          style={{ backgroundImage: "url('/mosque-silhouette.png')" }}
        ></div>
      </div>

      {/* Left Column: Text and Search with enhancements */}
      <div className="w-full md:w-1/2 flex flex-col space-y-8 md:pr-12 text-center md:text-left z-10">
        <div>
          <span className="inline-block px-4 py-1 bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm text-black rounded-full text-sm font-medium mb-4">
            Platform Donasi Masjid #1 di Indonesia
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Ayo Bantu <span className="text-yellow-400">Penggalangan</span>{" "}
            Masjid
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-300 mt-6 mb-6 mx-auto md:mx-0"></div>

          <p className="text-xl text-white text-opacity-90 mb-2">
            Platform donasi digital untuk pembangunan dan renovasi masjid yang
            akuntabel dan transparan.
          </p>

          <p className="text-lg font-semibold text-yellow-400">
            #AkuntabelTransparan
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <div className="flex items-center bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg px-4 py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-400 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-black text-sm font-medium">
              Terverifikasi
            </span>
          </div>

          <div className="flex items-center bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg px-4 py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-400 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span className="text-black text-sm font-medium">
              100+ Proyek Sukses
            </span>
          </div>

          <div className="flex items-center bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg px-4 py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-400 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-black text-sm font-medium">
              10.000+ Donatur
            </span>
          </div>
        </div>

        {isHome && (
          <div className="mt-8">
            <label className="block text-white text-sm font-medium mb-2">
              Cari Masjid
            </label>
            <div className="flex shadow-lg shadow-blue-900/20">
              <input
                id="search"
                type="text"
                placeholder="Cari nama atau lokasi masjid..."
                className="flex-1 px-5 py-4 rounded-l-xl border-0 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white text-gray-800 text-lg"
              />
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-8 py-4 rounded-r-xl font-bold transition duration-300 flex items-center text-lg shadow-lg"
                style={{ backgroundColor: "#0473A8" }}
              >
                Cari
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <p className="text-white text-opacity-70 text-sm mt-2">
              Contoh: Masjid Al-Falah, Masjid Jakarta, Renovasi Masjid
            </p>
          </div>
        )}

        {isHome && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-white text-sm">Populer:</span>
            <button
              className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white text-sm px-3 py-1 rounded-full transition duration-200"
              style={{ backgroundColor: "#0473A8" }}
            >
              Masjid Raya
            </button>
            <button
              className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white text-sm px-3 py-1 rounded-full transition duration-200"
              style={{ backgroundColor: "#0473A8" }}
            >
              Jakarta
            </button>
            <button
              className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white text-sm px-3 py-1 rounded-full transition duration-200"
              style={{ backgroundColor: "#0473A8" }}
            >
              Renovasi
            </button>
          </div>
        )}

        {/* <div className="mt-8">
          <label className="block text-white text-sm font-medium mb-2">
            Cari Masjid
          </label>
          <div className="flex shadow-lg shadow-blue-900/20">
            <input
              id="search"
              type="text"
              placeholder="Cari nama atau lokasi masjid..."
              className="flex-1 px-5 py-4 rounded-l-xl border-0 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white text-gray-800 text-lg"
            />
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-8 py-4 rounded-r-xl font-bold transition duration-300 flex items-center text-lg shadow-lg"
              style={{ backgroundColor: "#0473A8" }}
            >
              Cari
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <p className="text-white text-opacity-70 text-sm mt-2">
            Contoh: Masjid Al-Falah, Masjid Jakarta, Renovasi Masjid
          </p>
        </div> */}

        {/* Popular searches
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-white text-sm">Populer:</span>
          <button
            className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white text-sm px-3 py-1 rounded-full transition duration-200"
            style={{ backgroundColor: "#0473A8" }}
          >
            Masjid Raya
          </button>
          <button
            className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white text-sm px-3 py-1 rounded-full transition duration-200"
            style={{ backgroundColor: "#0473A8" }}
          >
            Jakarta
          </button>
          <button
            className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white text-sm px-3 py-1 rounded-full transition duration-200"
            style={{ backgroundColor: "#0473A8" }}
          >
            Renovasi
          </button>
        </div> */}
      </div>

      {/* Right Column: Enhanced Image Carousel */}
      <div className="w-full md:w-1/2 flex justify-center items-center mt-16 md:mt-0 h-[420px] z-10">
        <div className="w-full max-w-[520px] relative">
          {/* Frame decoration */}
          <div className="absolute -inset-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-2xl -z-10"></div>

          {/* Animated dots decoration */}
          <div className="absolute -top-2 -right-2 h-4 w-4 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-blue-400 rounded-full animate-ping animation-delay-700"></div>

          {/* Carousel with shadow and border */}
          <div className="rounded-xl overflow-hidden shadow-2xl border border-white border-opacity-20">
            <ImageCarousel />
          </div>
        </div>
      </div>
    </section>
  );
};

// Add these to your global CSS or Tailwind config

export default Hero;
