import React from "react";
import { useNavigate } from "react-router-dom";
import formatCurrency from "../../utils/formatCurrency";

const MosqueCard = ({
  image,
  title,
  name,
  description,
  currentAmount,
  targetAmount,
  onClick
}) => {
  const navigate = useNavigate();
  // Calculate percentage for progress bar
  const percentage = Math.min(
    Math.round((currentAmount / targetAmount) * 100),
    100
  );

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-52 object-cover" />
        <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 m-2 rounded-full text-xs font-bold">
          {percentage}% Terkumpul
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-800 mb-1">{title}</h3>
        <p className="text-sm font-medium text-blue-600 mb-3">{name}</p>
        <p className="text-sm text-gray-600 mb-5 line-clamp-2">{description}</p>

        {/* Progress bar with enhanced styling */}
        <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
          <div
            className="bg-green-500 h-3 rounded-full shadow-inner transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-xs text-gray-500">Terkumpul</p>
            <p className="text-sm font-bold text-gray-800">
              {formatCurrency(currentAmount)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Target</p>
            <p className="text-sm font-bold text-gray-800">
              {formatCurrency(targetAmount)}
            </p>
          </div>
        </div>

        <button
          className="w-full bg-[#0473A8] hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition duration-300 font-medium shadow-md hover:shadow-lg"
          onClick={
            onClick
          }
        >
          Ayo Bantu Masjid
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MosqueCard;
