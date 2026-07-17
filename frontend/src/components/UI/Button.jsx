import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button' }) => {
  // Common styling for all buttons
  const baseStyle = "px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md focus:outline-none hover:shadow-lg active:scale-95";

  // Dynamic variants mapping to our custom theme colors
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark hover:scale-105",
    secondary: "bg-secondary text-white hover:bg-emerald-600 hover:scale-105",
    danger: "bg-emergency text-white hover:bg-red-600 hover:scale-105",
    outline: "border-2 border-primary text-primary hover:bg-lightBg hover:scale-105"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;