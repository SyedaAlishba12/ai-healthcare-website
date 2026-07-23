import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Navbar from './components/navbar/navbar';
import Footer from './components/Footer/Footer';
import Button from './components/UI/Button';

import DoctorsList from './pages/DoctorsList';
import DoctorDetails from './pages/DoctorDetails';
import Login from './pages/Login';
import Emergency from "./pages/Emergency";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import Splash from "./pages/Splash";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  // Key metrics to make the page look like a real, functional healthcare system
  const stats = [
    { value: "15,000+", label: "Verified Medicines" },
    { value: "450+", label: "Specialist Doctors" },
    { value: "24/7", label: "Emergency Support" },
    { value: "100%", label: "Secure Digital Records" }
  ];

  // Modules division based on your team's architecture
  const coreModules = [
    {
      icon: "💊",
      title: "Medicine Pharmacy Store",
      description: "Browse, filter, and order prescriptions with direct visual validation and easy checkouts.",
      tag: "Pharmacy",
      actionText: "Browse Store",
      variant: "primary"
    },
    {
      icon: "👨‍⚕️",
      title: "Doctor Appointments",
      description: "Schedule consultations with leading medical professionals and clinical specialists near you.",
      tag: "Consultation",
      actionText: "Book Appointment",
      variant: "secondary",
      path: "/doctors"
    },
    {
      icon: "🚨",
      title: "24/7 Emergency Hub",
      description:
        "Get instant access to critical emergency contacts, hospital dispatch, and real-time medical aid.",
      tag: "Urgent Care",
      actionText: "Emergency Contacts",
      variant: "danger",
      path: "/emergency",
    },
    {
      icon: "📩",
      title: "Contact Us",
      description:
        "Reach our healthcare support team for any questions or assistance.",
      tag: "Support",
      actionText: "Contact Us",
      variant: "primary",
      path: "/contact",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-lightBg selection:bg-primary/20">
      {/* Structural Header Navigation */}
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/splash"
            element={<Splash />}
          />

          <Route
            path="/"
            element={<Home stats={stats} coreModules={coreModules} />}
          />

          <Route path="/login" element={<Login />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/register" element={<Register />} />

          <Route path="/doctors" element={<DoctorsList />} />

          <Route path="/doctors/:id" element={<DoctorDetails />} />

          <Route path="/emergency" element={<Emergency />} />

          <Route path="/contact" element={<Contact />} />

        </Routes>
      </main>

      {/* Structural Footer */}
      <Footer />
    </div>
  );
}

// Homepage content, extracted so it can live at the "/" route
function Home({ stats, coreModules }) {
  const navigate = useNavigate();

  return (
    <>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-lightBg pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-blue-50 text-primary border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            The Ultimate AI-Powered Patient Portal
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-dark tracking-tight max-w-4xl mx-auto leading-tight">
            Revolutionizing Healthcare with{" "}
            <span className="text-primary">Smart Digital Care</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Your comprehensive medical interface. Book clinical specialist appointments,
            access real-time emergency desks, and order medications securely.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              onClick={() => alert("Redirecting to Medicine Store...")}
            >
              Explore Medicines
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/emergency")}
            >
              View Emergency Hotlines
            </Button>
          </div>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-gradient-to-b from-blue-100/30 to-transparent blur-3xl pointer-events-none -z-10"></div>
      </section>

      {/* 2. Statistical Highlights */}
      <section className="bg-white border-y border-slate-100 py-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="p-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-primary">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Structural Modules Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-dark tracking-tight">
            Explore Our Core Health Modules
          </h2>

          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
            The project structure is split into robust functional pipelines.
            Click on any block to begin testing the implementation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreModules.map((module, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 card-zoom flex flex-col justify-between"
            >
              <div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-50 text-slate-600 mb-6">
                  {module.tag}
                </div>

                <div className="text-4xl mb-4">{module.icon}</div>

                <h3 className="text-xl font-bold text-dark mb-3">
                  {module.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {module.description}
                </p>
              </div>

              <Button
                variant={module.variant}
                className="w-full text-center mt-4"
                onClick={() =>
                  module.path
                    ? navigate(module.path)
                    : alert(`Navigating to ${module.title}...`)
                }
              >
                {module.actionText}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Feature Showcase */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-secondary font-bold uppercase tracking-widest text-xs">
              Diagnostic Integrity
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">
              Integrate Diagnostic Labs Instantly
            </h2>

            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              Connect your medical diagnostics pipeline seamlessly. Patients
              can upload test reports, view dynamic tracking states, and
              receive interactive graphical feedback instantly.
            </p>

            <div className="mt-8">
              <Button
                variant="secondary"
                onClick={() => alert("Opening Lab Portal...")}
              >
                Manage Lab Testing
              </Button>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-secondary/10 text-secondary text-xs px-3 py-1 rounded-bl-xl font-bold">
              LIVE METRIC
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <span className="text-sm font-medium text-slate-300">
                  Blood Analysis Setup
                </span>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-teal-500/10 text-secondary">
                  Active
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <span className="text-sm font-medium text-slate-300">
                  ECG Processing Pipeline
                </span>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-teal-500/10 text-secondary">
                  Ready
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-300">
                  AI Symptom Check Agent
                </span>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-500/10 text-primary">
                  Integrating
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;