import React from "react";
import UIILogo from "/UII.png";

const UIISupport = () => {
  return (
    <section 
      className="w-full py-20 px-8 md:px-16 lg:px-24 relative overflow-hidden"
      style={{ 
        background: "linear-gradient(120deg, #0C6839 0%, #0C6839 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
      }}
    >
      {/* Abstract shapes for visual interest */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-400 opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-yellow-400 opacity-5 transform -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left side - Text and button */}
          <div className="w-full md:w-1/2 mb-12 md:mb-0 flex flex-col items-start relative z-10">
            <span className="bg-blue-700 bg-opacity-70 text-white text-sm font-medium px-4 py-1 rounded-full mb-4">
              Official Partnership
            </span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Supported By<br />
              <span className="text-yellow-400">Universitas Islam Indonesia</span>
            </h2>
            
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-300 mb-8 self-start rounded-full"></div>
            
            <p className="text-white text-opacity-90 text-lg mb-8 max-w-xl leading-relaxed">
              Kerjasama resmi dengan Universitas Islam Indonesia memungkinkan kami menyediakan platform tepercaya untuk meningkatkan kualitas masjid di seluruh Indonesia.
            </p>
            
            <div className="flex justify-center w-full">
              <button className="border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10 text-white px-6 py-3 rounded-lg font-medium transition duration-300 flex items-center">
                Learn More
              </button>
            </div>
          </div>
          
          {/* Right side - UII Logo with enhanced presentation */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end relative z-10">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm border border-white border-opacity-20 p-8 rounded-2xl shadow-2xl transform hover:rotate-1 transition duration-500 hover:shadow-blue-900/20">
              <div className="bg-white rounded-xl p-6 flex items-center justify-center shadow-inner">
                <img 
                  src={UIILogo} 
                  alt="Universitas Islam Indonesia Logo" 
                  className="w-56 h-56 md:w-72 md:h-72 object-contain filter drop-shadow-md"
                />
              </div>
            
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default UIISupport;