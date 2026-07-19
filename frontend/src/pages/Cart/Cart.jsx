import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Load cart data from localStorage when the component mounts
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('healthpulse_cart')) || [];
    console.log("Cart loaded from localStorage:", savedCart); // Debugger log
    setCartItems(savedCart);
  }, []);

  // Sync state changes back to localStorage
  const saveCartToStorage = (updatedCart) => {
    console.log("Saving updated cart to localStorage:", updatedCart); // Debugger log
    setCartItems(updatedCart);
    localStorage.setItem('healthpulse_cart', JSON.stringify(updatedCart));
  };

  // Quantity control handlers
  const updateQuantity = (targetId, amount) => {
    const updated = cartItems.map(item => {
      const itemId = item._id || item.id;
      if (itemId === targetId) {
        const newQuantity = item.quantity + amount;
        return { ...item, quantity: Math.max(1, newQuantity) };
      }
      return item;
    });
    saveCartToStorage(updated);
  };

  // Remove a specific medicine item
  const removeItem = (targetId) => {
    const filtered = cartItems.filter(item => {
      const itemId = item._id || item.id;
      return itemId !== targetId;
    });
    saveCartToStorage(filtered);
  };

  // Clear entire cart
  const clearCart = () => {
    saveCartToStorage([]);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price || 0) * item.quantity), 0);
  const deliveryCharges = cartItems.length > 0 ? 150 : 0;
  const total = subtotal + deliveryCharges;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-dark tracking-tight">Shopping Cart</h1>
        {cartItems.length > 0 && (
          <button 
            onClick={clearCart}
            className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear All Items
          </button>
        )}
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              // Resolve safe key identifier
              const itemId = item._id || item.id;
              const itemImage = item.image || 'https://via.placeholder.com/150';
              
              return (
                <div
                  key={itemId}
                  className="flex flex-col sm:flex-row items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={itemImage}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-100"
                    />
                    <div>
                      <h3 className="font-bold text-dark text-lg">{item.name}</h3>
                      <p className="text-xs text-slate-400">{item.category}</p>
                      <p className="text-primary font-bold mt-1 text-sm">Rs. {item.price}</p>
                    </div>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(itemId, -1)}
                        className="px-3 py-1.5 hover:bg-slate-200 transition text-slate-600 font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 text-sm font-semibold text-dark">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(itemId, 1)}
                        className="px-3 py-1.5 hover:bg-slate-200 transition text-slate-600 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <p className="font-black text-dark">Rs. {Number(item.price || 0) * item.quantity}</p>
                    </div>

                    <button
                      onClick={() => removeItem(itemId)}
                      className="text-red-500 hover:text-red-700 text-sm p-2 hover:bg-red-50 rounded-xl transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold text-dark mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm border-b border-slate-100 pb-4">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-dark">Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Charges</span>
                <span className="font-semibold text-dark">Rs. {deliveryCharges}</span>
              </div>
            </div>
            <div className="flex justify-between text-base font-extrabold text-dark py-4 mb-6">
              <span>Total Amount</span>
              <span className="text-primary text-lg">Rs. {total}</span>
            </div>

            <Button
              variant="primary"
              className="w-full text-center py-3 text-sm font-bold shadow-md shadow-primary/20"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="outline"
              className="w-full text-center py-3 text-sm font-bold mt-3"
              onClick={() => navigate('/medicines')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 max-w-2xl mx-auto">
          <div className="text-5xl mb-4">🛒</div>
          <h3 className="text-xl font-bold text-dark">Your cart is empty</h3>
          <p className="text-slate-500 text-sm mt-2 mb-6">Explore our medicines section to add some items!</p>
          <Button variant="primary" onClick={() => navigate('/medicines')}>
            Shop Medicines
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;