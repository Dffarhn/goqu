import React from "react";
import Logo from '../../../assets/logo.svg';

const Footer = () => {
  return (
    <footer className="w-full py-16 px-8 md:px-32" style={{ backgroundColor: "#0C6839" }}>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left column - Logo and description */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center mb-4">
            <img src={Logo} alt="GoQu Logo" className="h-10 w-10 mr-2" />
            <span className="text-2xl font-bold text-white">GoQu</span>
          </div>
          <p className="text-white opacity-80 text-sm text-center md:text-left">
            GoQu adalah platform penggalangan dana untuk pembangunan masjid di seluruh Indonesia.
          </p>
        </div>
        
        {/* Right column - Try it today */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-xl font-bold text-white mb-4">Try It Today</h3>
          <p className="text-white opacity-80 text-sm mb-6 text-center md:text-left">
            Get started for free. Add your whole team as your needs grow.
          </p>
          <button className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-md font-medium transition duration-200 flex items-center">
            Start today
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;