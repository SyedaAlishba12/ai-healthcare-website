import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Button from "./components/UI/Button";
import ScrollToTop from "./components/ScrollToTop";

import DoctorsList from "./pages/DoctorsList";
import DoctorDetails from "./pages/DoctorDetails";
import BookAppointment from "./pages/BookAppointment";

import Medicines from "./pages/Medicines/Medicines";
import MedicineDetails from "./pages/MedicineDetails/MedicineDetails";
import Cart from "./pages/Cart/Cart";

function App() {
  const stats = [
    {
      value: "15,000+",
      label: "Verified Medicines",
    },
    {
      value: "450+",
      label: "Specialist Doctors",
    },
    {
      value: "24/7",
      label: "Emergency Support",
    },
    {
      value: "100%",
      label: "Secure Digital Records",
    },
  ];

  const coreModules = [
    {
      icon: "💊",
      title: "Medicine Pharmacy Store",
      description:
        "Browse, filter, and order prescriptions with direct visual validation and easy checkouts.",
      tag: "Pharmacy",
      actionText: "Browse Store",
      variant: "primary",
      path: "/medicines",
    },
    {
      icon: "👨‍⚕️",
      title: "Doctor Appointments",
      description:
        "Schedule consultations with leading medical professionals and clinical specialists near you.",
      tag: "Consultation",
      actionText: "Find Doctors",
      variant: "secondary",
      path: "/doctors",
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
  ];

  return (
    <div className="flex min-h-screen flex-col bg-lightBg selection:bg-primary/20">
      <ScrollToTop />

      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={<Home stats={stats} coreModules={coreModules} />}
          />

          {/* Doctor and Appointment routes */}
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/:id" element={<DoctorDetails />} />
          <Route
            path="/book-appointment/:id"
            element={<BookAppointment />}
          />

          {/* Medicine and Cart routes */}
          <Route path="/medicines" element={<Medicines />} />
          <Route
            path="/medicines/:id"
            element={<MedicineDetails />}
          />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function Home({ stats, coreModules }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-lightBg pb-20 pt-16">
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            The Ultimate AI-Powered Patient Portal
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight text-dark sm:text-5xl lg:text-6xl">
            Revolutionizing Healthcare with{" "}
            <span className="text-primary">Smart Digital Care</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Your comprehensive medical interface. Book clinical specialist
            appointments, access real-time emergency desks, and order
            medications securely.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              onClick={() => navigate("/medicines")}
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

        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[300px] w-[1000px] -translate-x-1/2 bg-gradient-to-b from-blue-100/30 to-transparent blur-3xl" />
      </section>

      {/* Health Statistics */}
      <section className="border-y border-slate-100 bg-white py-10 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="p-4">
                <div className="text-3xl font-extrabold text-primary sm:text-4xl">
                  {stat.value}
                </div>

                <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Modules */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-dark">
            Explore Our Core Health Modules
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 sm:text-base">
            Access our main healthcare services, including doctor
            appointments, medicines, and emergency support.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {coreModules.map((module) => (
            <div
              key={module.title}
              className="card-zoom flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div>
                <div className="mb-6 inline-block rounded-full bg-slate-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                  {module.tag}
                </div>

                <div className="mb-4 text-4xl">{module.icon}</div>

                <h3 className="mb-3 text-xl font-bold text-dark">
                  {module.title}
                </h3>

                <p className="mb-6 text-sm leading-relaxed text-slate-500">
                  {module.description}
                </p>
              </div>

              <Button
                variant={module.variant}
                className="mt-4 w-full text-center"
                onClick={() => navigate(module.path)}
              >
                {module.actionText}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Laboratory Section */}
      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">
              Diagnostic Integrity
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Integrate Diagnostic Labs Instantly
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
              Access available laboratory tests, view test prices, and book
              diagnostic tests through the healthcare portal.
            </p>

            <div className="mt-8">
              <Button
                variant="secondary"
                onClick={() => navigate("/lab-tests")}
              >
                Manage Lab Testing
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-800/80 p-8">
            <div className="absolute right-0 top-0 rounded-bl-xl bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
              LIVE METRIC
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-sm font-medium text-slate-300">
                  Blood Analysis Setup
                </span>

                <span className="rounded bg-teal-500/10 px-2 py-1 text-xs font-semibold text-secondary">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-sm font-medium text-slate-300">
                  ECG Processing Pipeline
                </span>

                <span className="rounded bg-teal-500/10 px-2 py-1 text-xs font-semibold text-secondary">
                  Ready
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">
                  AI Support Agent
                </span>

                <span className="rounded bg-blue-500/10 px-2 py-1 text-xs font-semibold text-primary">
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