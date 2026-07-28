import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Chatbot from "./components/Chatbot";

// Home
import Home from "./pages/Home/Home";

// Authentication
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Doctors
import DoctorsList from "./pages/DoctorsList";
import DoctorDetails from "./pages/DoctorDetails";
import BookAppointment from "./pages/BookAppointment";

// Medicines
import Medicines from "./pages/Medicines/Medicines";
import MedicineDetails from "./pages/MedicineDetails/MedicineDetails";

// Cart & Checkout
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";

// Blog
import Blog from "./pages/Blog/Blog";
import BlogDetails from "./pages/Blog/BlogDetails";

// Lab Tests & Hospitals
import LabTests from "./pages/LabTests";
import Hospitals from "./pages/Hospitals";

// Emergency & Contact
import Emergency from "./pages/Emergency";
import Contact from "./pages/Contact";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  const location = useLocation();

  // Routes where Navbar/Footer/Chatbot should NOT show
  const hideLayoutRoutes = ['/', '/login', '/register', '/forgot-password'];
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-lightBg selection:bg-primary/20">
      <ScrollToTop />

      {!hideLayout && <Navbar />}

      <main className="flex-grow">
      <Routes>
  {/* Splash Screen */}
  <Route path="/" element={<Splash />} />

  {/* Home — after splash redirects here */}
  <Route path="/home" element={<Home />} />

  {/* Auth routes */}
  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
  <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
  <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

  {/* All public routes */}
  <Route path="/doctors" element={<DoctorsList />} />
  <Route path="/doctors/:id" element={<DoctorDetails />} />
  <Route path="/medicines" element={<Medicines />} />
  <Route path="/medicines/:id" element={<MedicineDetails />} />
  <Route path="/lab-tests" element={<LabTests />}/>
  <Route path="/cart" element={<Cart />} />
  <Route path="/blog" element={<Blog />} />
  <Route path="/blog/:id" element={<BlogDetails />} />

  <Route path="/hospitals" element={<Hospitals />} />
  <Route path="/emergency" element={<Emergency />} />
  <Route path="/contact" element={<Contact />} />

  {/* Protected routes */}
  <Route path="/book-appointment/:id" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

</Routes>
      </main>

      {!hideLayout && <Footer />}
      {!hideLayout && <Chatbot />}
    </div>
  );
}

export default App;