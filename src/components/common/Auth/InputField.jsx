// Input Component
import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Heart, Home } from "lucide-react";


const InputField = ({ 
  label, 
  type, 
  name, 
  value, 
  onChange, 
  required, 
  icon: Icon,
  showPasswordToggle,
  onTogglePassword,
  showPassword
}) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={showPasswordToggle && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white  dark:border-gray-600 text-black placeholder-gray-400"
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;