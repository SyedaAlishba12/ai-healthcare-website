import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Medicines', path: '/medicines' },
    { name: 'Lab Tests', path: '/lab-tests' },
    { name: "Contact", path: "/contact" },
    { name: 'Emergency', path: '/emergency', isEmergency: true },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand Name */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <span className="text-2xl font-bold text-primary mr-1">✦</span>
              <span className="text-xl font-extrabold text-dark tracking-tight">
                Health<span className="text-primary">Pulse</span>
              </span>
            </div>
          </div>

          {/* Desktop Nav Links & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-semibold px-3 py-2 rounded-lg transition-all duration-300 ${
                  link.isEmergency
                    ? 'bg-emergency text-white hover:bg-red-600 shadow-md hover:shadow-lg hover:scale-105'
                    : 'text-dark hover:text-primary hover:bg-lightBg'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Auth buttons */}
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-dark hover:text-primary focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-2 pt-2 pb-4 space-y-1 shadow-inner animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                link.isEmergency
                  ? 'bg-emergency text-white text-center mt-2'
                  : 'text-dark hover:text-primary hover:bg-lightBg'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile auth buttons */}
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full mt-2 px-4 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block w-full mt-2 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold text-center hover:bg-primary-dark transition"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;