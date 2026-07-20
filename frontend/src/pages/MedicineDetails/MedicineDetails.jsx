import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MedicineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch individual medicine details from backend
  useEffect(() => {
    const fetchMedicineDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/medicines/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to retrieve product specifications');
        }

        const jsonResult = await response.json();

        if (jsonResult.success) {
          setMedicine(jsonResult.data);
        } else {
          throw new Error(jsonResult.message || 'Database fetch failed');
        }
      } catch (err) {
        console.error('Error loading product details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMedicineDetails();
    }
  }, [id]);

  const handleAddToCart = async (e) => {
  if (e) e.preventDefault();

  if (!medicine) {
    alert("Error: Product data is still loading. Please try again.");
    return;
  }

  try {
    const resolvedId = medicine._id || medicine.id || id;

    const response = await fetch('http://localhost:5000/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'guest_user_123',
        medicineId: resolvedId,
        quantity,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Could not add item to cart');
    }

    window.dispatchEvent(new Event('cartUpdate'));

    alert(`${quantity}x ${medicine.name || 'item'} successfully added to cart!`);
    navigate('/cart');
  } catch (error) {
    console.error('Add to cart error:', error);
    alert(error.message || 'Failed to add item to cart');
  }


    // Get current cart or initialize empty list
    const existingCart = JSON.parse(localStorage.getItem('healthpulse_cart')) || [];
    
    // Safety check for Medicine ID
    const resolvedId = medicine._id || medicine.id || id;
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex(item => (item._id === resolvedId || item.id === resolvedId));

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Create and append new item
      const newItem = {
        _id: resolvedId,
        id: resolvedId,
        name: medicine.name || 'Unnamed Medicine',
        category: medicine.category || 'General',
        price: Number(medicine.price) || 0,
        image: medicine.image || 'https://via.placeholder.com/150',
        quantity: quantity,
        manufacturer: medicine.manufacturer || 'Prescribed Drug'
      };
      existingCart.push(newItem);
    }

    // Save to local storage
    localStorage.setItem('healthpulse_cart', JSON.stringify(existingCart));
    
    // Dispatch custom event to notify other components (like Navbar/Cart badge) immediately
    window.dispatchEvent(new Event('cartUpdate'));
    
    alert(`${quantity}x ${medicine.name || 'item'} successfully added to cart!`);
    
    // Redirect instantly to Cart page
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[75vh] py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="text-slate-500 mt-4 text-sm font-semibold">Retrieving medical specifications...</p>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="max-w-md mx-auto my-20 px-6 py-12 text-center bg-red-50 rounded-3xl border border-red-100">
        <h3 className="text-lg font-bold text-red-700">Information Unavailable</h3>
        <p className="text-red-600 text-sm mt-1 mb-6">{error || 'Medicine details could not be located.'}</p>
        <button 
          onClick={() => navigate('/medicines')}
          className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[75vh]">
      <button 
        onClick={() => navigate('/medicines')} 
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-600 transition-colors"
      >
        ← Back to Pharmacy Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm">
        
        {/* Left Column: Image */}
        <div className="flex flex-col gap-4">
          <div className="relative h-[350px] sm:h-[450px] rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
            <img 
              src={medicine.image || 'https://via.placeholder.com/150'} 
              alt={medicine.name} 
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">
              {medicine.category}
            </span>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                {medicine.manufacturer || 'Prescribed Drug'}
              </span>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wide ${
                medicine.stock ? 'bg-teal-50 text-teal-600' : 'bg-red-50 text-red-600'
              }`}>
                {medicine.stock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2 tracking-tight">
              {medicine.name}
            </h1>
            <div className="text-2xl font-black text-teal-600 mb-6">
              Rs. {medicine.price} <span className="text-xs text-slate-400 font-medium">/ per pack</span>
            </div>

            <div className="space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-6">
              <div>
                <h3 className="font-bold text-slate-800 mb-1.5">Clinical Overview</h3>
                <p>{medicine.description}</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 mb-1.5">Prescription Dosage Instructions</h3>
                <p className="bg-blue-50 text-slate-700 p-3 rounded-xl border border-blue-100">
                  {medicine.dosage}
                </p>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
            {/* Stable & Squeeze-free Quantity Selector */}
            <div className="flex items-center justify-between border border-slate-200 rounded-xl bg-slate-50 overflow-hidden w-32 h-[46px] shrink-0">
              <button 
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-full hover:bg-slate-200 transition font-bold text-slate-600 flex items-center justify-center text-lg"
                disabled={!medicine.stock}
              >
                -
              </button>
              <span className="flex-1 text-sm font-bold text-slate-800 text-center select-none">{quantity}</span>
              <button 
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-full hover:bg-slate-200 transition font-bold text-slate-600 flex items-center justify-center text-lg"
                disabled={!medicine.stock}
              >
                +
              </button>
            </div>

            {/* Standard HTML Button */}
            <button 
              type="button"
              className="w-full sm:flex-grow text-center py-3.5 px-6 text-sm font-bold shadow-md bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all duration-150 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
              disabled={!medicine.stock}
              onClick={handleAddToCart}
            >
              {medicine.stock ? `Add ${quantity} to Shopping Cart` : 'Product Unavailable'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MedicineDetails;