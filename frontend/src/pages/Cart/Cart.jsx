import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';

const USER_ID = 'guest_user_123';

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:5000/api/cart?userId=${USER_ID}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not fetch cart');
      }

      setCartItems(result.data.items || []);
    } catch (err) {
      console.error('Cart fetch error:', err);
      setError(err.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (medicineId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setActionLoading(true);

      const response = await fetch(`http://localhost:5000/api/cart/update/${medicineId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: USER_ID,
          quantity: newQuantity,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not update quantity');
      }

      setCartItems(result.data.items || []);
      window.dispatchEvent(new Event('cartUpdate'));
    } catch (err) {
      console.error('Quantity update error:', err);
      alert(err.message || 'Failed to update quantity');
    } finally {
      setActionLoading(false);
    }
  };

  const removeItem = async (medicineId) => {
    try {
      setActionLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/cart/remove/${medicineId}?userId=${USER_ID}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not remove item');
      }

      setCartItems(result.data.items || []);
      window.dispatchEvent(new Event('cartUpdate'));
    } catch (err) {
      console.error('Remove item error:', err);
      alert(err.message || 'Failed to remove item');
    } finally {
      setActionLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setActionLoading(true);

      const response = await fetch(`http://localhost:5000/api/cart/clear?userId=${USER_ID}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not clear cart');
      }

      setCartItems([]);
      window.dispatchEvent(new Event('cartUpdate'));
    } catch (err) {
      console.error('Clear cart error:', err);
      alert(err.message || 'Failed to clear cart');
    } finally {
      setActionLoading(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const medicine = item.medicineId;
    return acc + Number(medicine?.price || 0) * Number(item.quantity || 1);
  }, 0);

  const deliveryCharges = cartItems.length > 0 ? 150 : 0;
  const total = subtotal + deliveryCharges;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-slate-500 mt-4 text-sm font-semibold">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-20 px-6 py-12 text-center bg-red-50 rounded-3xl border border-red-100">
        <h3 className="text-lg font-bold text-red-700">Cart Loading Failed</h3>
        <p className="text-red-600 text-sm mt-1 mb-6">{error}</p>
        <Button variant="primary" onClick={fetchCart}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-dark tracking-tight">Shopping Cart</h1>

        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            disabled={actionLoading}
            className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
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
              const medicine = item.medicineId;
              const itemId = medicine?._id;
              const itemImage = medicine?.image || 'https://via.placeholder.com/150';

              return (
                <div
                  key={itemId}
                  className="flex flex-col sm:flex-row items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={itemImage}
                      alt={medicine?.name}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-100"
                    />

                    <div>
                      <h3 className="font-bold text-dark text-lg">{medicine?.name}</h3>
                      <p className="text-xs text-slate-400">{medicine?.category}</p>
                      <p className="text-primary font-bold mt-1 text-sm">Rs. {medicine?.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(itemId, item.quantity - 1)}
                        disabled={actionLoading || item.quantity <= 1}
                        className="px-3 py-1.5 hover:bg-slate-200 transition text-slate-600 font-bold disabled:opacity-40"
                      >
                        -
                      </button>

                      <span className="px-4 text-sm font-semibold text-dark">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(itemId, item.quantity + 1)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 hover:bg-slate-200 transition text-slate-600 font-bold disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <p className="font-black text-dark">
                        Rs. {Number(medicine?.price || 0) * Number(item.quantity || 1)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(itemId)}
                      disabled={actionLoading}
                      className="text-red-500 hover:text-red-700 text-sm p-2 hover:bg-red-50 rounded-xl transition disabled:opacity-40"
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

          <p className="text-slate-500 text-sm mt-2 mb-6">
            Explore our medicines section to add some items!
          </p>

          <Button variant="primary" onClick={() => navigate('/medicines')}>
            Shop Medicines
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;