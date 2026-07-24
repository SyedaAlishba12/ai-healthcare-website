import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Chatbot from "./components/Chatbot"; // Import is correct because of your index.jsx barrel file!

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

import LabTests from "./pages/LabTests";
import Hospitals from "./pages/Hospitals";

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

          <Route path="/lab-tests" element={<LabTests />} />
          <Route path="/hospitals" element={<Hospitals />} />
          {/* REMOVED the /chat route from here */}
        </Routes>
      </main>

      <Footer />
      
      {/* ADD THE CHATBOT HERE - Outside the routes so it floats globally */}
      <Chatbot />

    </div>
  );
}

export default App;