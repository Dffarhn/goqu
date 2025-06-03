import React, { useState, useEffect } from 'react';
import {
  Home,
  ArrowLeft,
  Search,
  Building,
  Users,
  Calendar,
  Heart,
  Navigation,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from "lucide-react";

const NotFoundPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Stop animation after 3 seconds
    const timer = setTimeout(() => setIsAnimating(false), 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-teal-50/50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-teal-200/20 to-blue-200/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-2xl"
          style={{
            transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl shadow-lg">
            <Building className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Takmir</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          {/* 404 Number with Animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-blue-600/20 blur-3xl rounded-full"></div>
            <div className={`relative text-[12rem] md:text-[16rem] font-black leading-none bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent select-none ${isAnimating ? 'animate-pulse' : ''}`}>
              404
            </div>
            <div className="absolute inset-0 text-[12rem] md:text-[16rem] font-black leading-none text-white/5 scale-110 select-none">
              404
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-3xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 p-8 md:p-12">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg">
                      <Navigation className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Halaman Tidak Ditemukan
                  </h1>
                  
                  <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                    Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman telah dipindahkan, 
                    dihapus, atau Anda salah mengetik alamat URL.
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                    <button
                      onClick={handleGoBack}
                      className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Kembali
                    </button>
                    
                    <button
                      onClick={() => window.location.href = '/'}
                      className="flex items-center gap-3 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-teal-300 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <Home className="w-5 h-5" />
                      Ke Beranda
                    </button>
                    
                    <button
                      onClick={handleRefresh}
                      className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Butuh Bantuan?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm">admin@takmir.id</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium">Telepon</div>
                  <div className="text-sm">+62 812-3456-7890</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium">Lokasi</div>
                  <div className="text-sm">Surabaya, Jawa Timur</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 p-6 text-center">
        <div className="text-sm text-gray-500">
          © 2024 Takmir. Semua hak dilindungi. • Sistem Manajemen Masjid Digital
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;