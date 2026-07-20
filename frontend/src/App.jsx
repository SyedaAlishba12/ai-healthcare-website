import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop";


import Home from "./pages/Home/Home";
import Blog from "./pages/Blog/Blog"; 
import BlogDetails from "./pages/Blog/BlogDetails";

import DoctorsList from "./pages/DoctorsList";
import DoctorDetails from "./pages/DoctorDetails";
import BookAppointment from "./pages/BookAppointment";

import Medicines from "./pages/Medicines/Medicines";
import MedicineDetails from "./pages/MedicineDetails/MedicineDetails";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";


function App() {
  return (
    <div className="flex min-h-screen flex-col bg-lightBg selection:bg-primary/20">
      <ScrollToTop />

      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} /> 
          
          {/* Doctor and Appointment routes */}
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/:id" element={<DoctorDetails />} />
          <Route path="/book-appointment/:id" element={<BookAppointment />} />

          {/* Medicine and Cart routes */}
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/medicines/:id" element={<MedicineDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

        </Routes>
      </main>

      <Footer />
      

    </div>
  );
}

export default App;