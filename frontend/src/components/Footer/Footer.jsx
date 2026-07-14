import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-primary">HealthPulse</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your trusted AI-powered health partner. Providing direct medical store access, smart consultations, and immediate emergency contact support under one click.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-secondary">Quick Navigation</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="/" className="hover:text-primary transition">Home</a></li>
            <li><a href="/doctors" className="hover:text-primary transition">Doctors Appointment</a></li>
            <li><a href="/medicines" className="hover:text-primary transition">Medicine Store</a></li>
            <li><a href="/emergency" className="hover:text-emergency transition font-semibold">Emergency Contacts</a></li>
          </ul>
        </div>

        {/* Clinical Disclaimer */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-red-400">Medical Safety Notice</h3>
          <p className="text-gray-400 text-xs leading-relaxed border-l-2 border-emergency pl-3">
            This platform provides general educational information and utility features. It does not diagnose diseases, prescribe medication directly, or replace a licensed clinical consultation.
          </p>
        </div>
      </div>

      {/* Copyright Subfooter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-700 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} HealthPulse Portal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;