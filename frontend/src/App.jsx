import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop";

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

// Cart
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";

// Blog
import Blog from "./pages/Blog/Blog";
import BlogDetails from "./pages/Blog/BlogDetails";

// Your Modules
import Emergency from "./pages/Emergency";
import Contact from "./pages/Contact";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-lightBg selection:bg-primary/20">
      <ScrollToTop />

      <Navbar />

      <main className="flex-grow">
        <Routes>

          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Authentication */}
          <Route path="/splash" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Doctors */}
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/:id" element={<DoctorDetails />} />
          <Route
            path="/book-appointment/:id"
            element={<BookAppointment />}
          />

          {/* Medicines */}
          <Route path="/medicines" element={<Medicines />} />
          <Route
            path="/medicines/:id"
            element={<MedicineDetails />}
          />

          {/* Cart */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Blog */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />

          {/* Your Modules */}
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/contact" element={<Contact />} />

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;