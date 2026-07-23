import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';

const USER_ID = 'guest_user_123';

const Checkout = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    deliveryAddress: '',
    paymentMethod: 'cash_on_delivery',
  });

  const [loadingCart, setLoadingCart] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    try {
      setLoadingCart(true);
      setError('');

      const response = await fetch(`http://localhost:5000/api/cart?userId=${USER_ID}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not fetch cart');
      }

      setCartItems(result.data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load checkout cart');
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = cartItems.reduce((acc, item) => {
    const medicine = item.medicineId;
    return acc + Number(medicine?.price || 0) * Number(item.quantity || 1);
  }, 0);

  const deliveryCharges = cartItems.length > 0 ? 150 : 0;
  const totalAmount = subtotal + deliveryCharges;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  };

  const validateForm = () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add medicines before checkout.');
      return false;
    }

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.deliveryAddress.trim() ||
      !formData.paymentMethod
    ) {
      setError('Please fill all billing information fields.');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (formData.phoneNumber.trim().length < 10) {
      setError('Please enter a valid phone number.');
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setPlacingOrder(true);
      setError('');

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: USER_ID,
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          deliveryAddress: formData.deliveryAddress,
          paymentMethod: formData.paymentMethod,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to place order');
      }

      window.dispatchEvent(new Event('cartUpdate'));
      setCartItems([]);
      setOrderSuccess(result.data);
    } catch (err) {
      console.error('Order error:', err);
      setError(err.message || 'Something went wrong while placing your order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loadingCart) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-slate-500 mt-4 text-sm font-semibold">Loading checkout...</p>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[70vh]">
        <Card className="text-center">
          <div className="text-5xl mb-4">✅</div>

          <h1 className="text-3xl font-extrabold text-dark mb-3">
            Order Placed Successfully
          </h1>

          <p className="text-slate-500 text-sm mb-6">
            Your medicine order has been received and is currently pending confirmation.
          </p>

          <div className="bg-slate-50 rounded-2xl p-5 text-left mb-6 border border-slate-100">
            <p className="text-sm text-slate-500">Order ID</p>
            <p className="font-bold text-dark break-all">{orderSuccess._id}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <div>
                <p className="text-sm text-slate-500">Subtotal</p>
                <p className="font-bold text-dark">Rs. {orderSuccess.subtotal}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Delivery Charges</p>
                <p className="font-bold text-dark">Rs. {orderSuccess.deliveryCharges}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Total Amount</p>
                <p className="font-bold text-primary">Rs. {orderSuccess.totalAmount}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Payment Method</p>
                <p className="font-bold text-dark">
                  {orderSuccess.paymentMethod === 'cash_on_delivery'
                    ? 'Cash on Delivery'
                    : 'Card Payment — Demo only'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Order Status</p>
                <p className="font-bold text-secondary capitalize">{orderSuccess.status}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Delivery Address</p>
                <p className="font-bold text-dark">{orderSuccess.deliveryAddress}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button variant="primary" onClick={() => navigate('/medicines')}>
              Continue Shopping
            </Button>

            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
      <div className="mb-8">
        <button
          onClick={() => navigate('/cart')}
          className="mb-4 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
        >
          ← Back to Cart
        </button>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
          Checkout
        </h1>

        <p className="mt-2 text-slate-500">
          Complete your billing information and place your medicine order securely.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <Card className="text-center max-w-2xl mx-auto py-14">
          <div className="text-5xl mb-4">🛒</div>

          <h3 className="text-xl font-bold text-dark">Your cart is empty</h3>

          <p className="text-slate-500 text-sm mt-2 mb-6">
            Please add medicines before proceeding to checkout.
          </p>

          <Button variant="primary" onClick={() => navigate('/medicines')}>
            Shop Medicines
          </Button>
        </Card>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-bold text-dark mb-6">
                Billing Information
              </h2>

              {error && (
                <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Full Name"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />

                <div className="w-full flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 tracking-wide">
                    Payment Method
                  </label>

                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  >
                    <option value="cash_on_delivery">Cash on Delivery</option>
                    <option value="card_demo">Card Payment — Demo only</option>
                  </select>
                </div>

                <div className="md:col-span-2 w-full flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 tracking-wide">
                    Delivery Address
                  </label>

                  <textarea
                    name="deliveryAddress"
                    placeholder="Enter your complete delivery address"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-slate-400 resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-xs leading-relaxed text-slate-600">
                  <strong className="text-dark">Safety note:</strong> Please read medicine labels carefully and consult a qualified healthcare professional before use.
                </p>
              </div>
            </Card>
          </div>

          <div>
            <Card className="h-fit">
              <h2 className="text-xl font-bold text-dark mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-[330px] overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const medicine = item.medicineId;

                  return (
                    <div
                      key={medicine?._id}
                      className="flex items-center gap-3 border-b border-slate-100 pb-4"
                    >
                      <img
                        src={medicine?.image || 'https://via.placeholder.com/150'}
                        alt={medicine?.name}
                        className="w-14 h-14 object-cover rounded-xl border border-slate-100"
                      />

                      <div className="flex-grow min-w-0">
                        <h3 className="font-bold text-dark text-sm truncate">
                          {medicine?.name}
                        </h3>

                        <p className="text-xs text-slate-400">
                          Qty: {item.quantity} × Rs. {medicine?.price}
                        </p>
                      </div>

                      <p className="font-bold text-primary text-sm">
                        Rs. {Number(medicine?.price || 0) * Number(item.quantity || 1)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 text-sm border-b border-slate-100 py-4 mt-4">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-dark">Rs. {subtotal}</span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-dark">Rs. {deliveryCharges}</span>
                </div>
              </div>

              <div className="flex justify-between text-base font-extrabold text-dark py-4 mb-4">
                <span>Total Amount</span>
                <span className="text-primary text-lg">Rs. {totalAmount}</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={placingOrder}
                className="w-full text-center py-3 text-sm font-bold shadow-md shadow-primary/20"
              >
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full text-center py-3 text-sm font-bold mt-3"
                onClick={() => navigate('/cart')}
              >
                Review Cart
              </Button>
            </Card>
          </div>
        </form>
      )}
    </div>
  );
};

export default Checkout;