import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Chatbot from "./components/Chatbot";

// Home
import Home from "./pages/Home/Home";

// Authentication (Sayeel's module)
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Doctors (Fatima's module)
import DoctorsList from "./pages/DoctorsList";
import DoctorDetails from "./pages/DoctorDetails";
import BookAppointment from "./pages/BookAppointment";

// Medicines (Zainab's module)
import Medicines from "./pages/Medicines/Medicines";
import MedicineDetails from "./pages/MedicineDetails/MedicineDetails";

// Cart & Checkout (Zainab + Alishba)
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";

// Blog (Alishba's module)
import Blog from "./pages/Blog/Blog";
import BlogDetails from "./pages/Blog/BlogDetails";

// Lab Tests & Hospitals (Taha's module)
import LabTests from "./pages/LabTests";
import Hospitals from "./pages/Hospitals";

// Emergency & Contact (Sayeel's module)
import Emergency from "./pages/Emergency";
import Contact from "./pages/Contact";

// Route Guards (Sayeel's module)
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  const location = useLocation();

  // Hide Navbar/Footer on Splash, Login, Register, and Forgot Password
  const hideLayout = ['/', '/login', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-lightBg selection:bg-primary/20">
      <ScrollToTop />

      {!hideLayout && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Splash */}
          <Route path="/" element={<Splash />} />

          {/* Protected Home */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Authentication */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          {/* Doctors Module */}
          <Route
            path="/doctors"
            element={
              <ProtectedRoute>
                <DoctorsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctors/:id"
            element={
              <ProtectedRoute>
                <DoctorDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/book-appointment/:id"
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            }
          />

          {/* Medicines Module */}
          <Route
            path="/medicines"
            element={
              <ProtectedRoute>
                <Medicines />
              </ProtectedRoute>
            }
          />

          <Route
            path="/medicines/:id"
            element={
              <ProtectedRoute>
                <MedicineDetails />
              </ProtectedRoute>
            }
          />

          {/* Cart & Checkout */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Blog Module */}
          <Route
            path="/blog"
            element={
              <ProtectedRoute>
                <Blog />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blog/:id"
            element={
              <ProtectedRoute>
                <BlogDetails />
              </ProtectedRoute>
            }
          />

          {/* Lab Tests & Hospitals (Taha's module) */}
          <Route
            path="/lab-tests"
            element={
              <ProtectedRoute>
                <LabTests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hospitals"
            element={
              <ProtectedRoute>
                <Hospitals />
              </ProtectedRoute>
            }
          />

          {/* Emergency & Contact (Sayeel's module) */}
          <Route
            path="/emergency"
            element={
              <ProtectedRoute>
                <Emergency />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!hideLayout && <Footer />}

      {/* Floating Chatbot — visible on all pages except Splash */}
      {!hideLayout && <Chatbot />}
    </div>
  );
}

export default App;