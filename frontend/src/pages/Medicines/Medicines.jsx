import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';

const Medicines = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter Categories
  const categories = ["All", "Tablets", "Syrups", "Inhalers"];

  // Fetch medicines from the cloud-connected Node.js backend
  useEffect(() => {
    const fetchMedicinesFromDatabase = async () => {
      try {
        setLoading(true);
        // We call our live server API running on port 5000
        const response = await fetch('http://localhost:5000/api/medicines');
        
        if (!response.ok) {
          throw new Error('Failed to retrieve data from the server');
        }

        const jsonResult = await response.json();
        
        if (jsonResult.success) {
          setMedicines(jsonResult.data);
        } else {
          throw new Error(jsonResult.message || 'Unknown database error occurred');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicinesFromDatabase();
  }, []);

  // Direct Add to Cart Handler (This solves your exact issue)
  const handleAddDirectToCart = (medicineProduct) => {
    if (!medicineProduct) return;

    // Get current cart or initialize empty list
    const existingCart = JSON.parse(localStorage.getItem('healthpulse_cart')) || [];
    
    // Safety check for Medicine ID (MongoDB uses _id)
    const resolvedId = medicineProduct._id || medicineProduct.id;

    if (!resolvedId) {
      alert("Error: Product ID is missing!");
      return;
    }

    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex(item => (item._id === resolvedId || item.id === resolvedId));

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // Create and append new item
      const newItem = {
        _id: resolvedId,
        id: resolvedId,
        name: medicineProduct.name || 'Unnamed Medicine',
        category: medicineProduct.category || 'General',
        price: Number(medicineProduct.price) || 0,
        image: medicineProduct.image || 'https://via.placeholder.com/150',
        quantity: 1, // Default quantity on direct catalog click is 1
        manufacturer: medicineProduct.manufacturer || 'Prescribed Drug'
      };
      existingCart.push(newItem);
    }

    // Save back to local storage
    localStorage.setItem('healthpulse_cart', JSON.stringify(existingCart));
    
    // Dispatch custom event to instantly sync and update Navbar cart badges/counters
    window.dispatchEvent(new Event('cartUpdate'));

    alert(`${medicineProduct.name} successfully added to cart!`);
    
    // Redirect instantly to Cart page
    navigate('/cart');
  };

  // Filter search and categories locally on client-side
  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
      {/* Header section */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
          Medicines Pharmacy Store
        </h1>
        <p className="mt-2 text-slate-500">
          Find, filter, and order authentic healthcare prescriptions with smart delivery.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-100">
        {/* Search Bar */}
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search medicines (e.g. Panadol)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
          />
        </div>

        {/* Categories Tab */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state indicator */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-slate-500 mt-4 text-sm font-semibold">Connecting to cloud database...</p>
        </div>
      ) : error ? (
        /* Error handling layout */
        <div className="text-center py-16 bg-red-50 rounded-3xl border border-red-100 max-w-md mx-auto px-6">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-bold text-red-700">Connection Failed</h3>
          <p className="text-red-600 text-sm mt-1 mb-4">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry Connection
          </Button>
        </div>
      ) : filteredMedicines.length > 0 ? (
        /* Main Grid of Medicines fetched directly from MongoDB */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedicines.map((medicine) => (
            <div
              key={medicine._id} // MongoDB uses "_id" instead of temporary "id"
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Medicine Image Container */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {!medicine.stock && (
                  <span className="absolute top-4 right-4 bg-red-100 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Out of Stock
                  </span>
                )}
                <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  {medicine.category}
                </span>
              </div>

              {/* Medicine Info */}
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-dark mb-1 group-hover:text-primary transition-colors">
                  {medicine.name}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
                  {medicine.description}
                </p>
                <div className="text-lg font-black text-primary">
                  Rs. {medicine.price}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 pt-2 border-t border-slate-50 flex gap-3">
                {/* 1. Details Button pointing to MERN route */}
                <Button
                  variant="outline"
                  className="flex-1 text-center py-2 text-xs"
                  onClick={() => navigate(`/medicines/${medicine._id}`)} // Redirects dynamically to the correct DB product ID
                >
                  Details
                </Button>
                
                {/* 2. Add to Cart Button (Linked to handleAddDirectToCart function) */}
                <Button
                  variant="primary"
                  className="flex-1 text-center py-2 text-xs"
                  disabled={!medicine.stock}
                  onClick={() => handleAddDirectToCart(medicine)}
                >
                  {medicine.stock ? "Add to Cart" : "Unavailable"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty states */
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-dark">No medicines found</h3>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
};

export default Medicines;